/**
 * places.js - Extracción de datos de Google Places
 * Implementación básica según las instrucciones de Google Maps API
 */

// Esperar a que CONFIG esté disponible (función original del usuario)
function waitForConfig() {
    return new Promise((resolve) => {
        if (window.CONFIG) {
            resolve(window.CONFIG);
        } else {
            const checkConfig = setInterval(() => {
                if (window.CONFIG) {
                    clearInterval(checkConfig);
                    resolve(window.CONFIG);
                }
            }, 100);
        }
    });
}

// Función auxiliar para formatear los datos obtenidos de la API (mi versión, más robusta para API)
function formatPlaceData(data) {
    if (!data || !data.result) {
        console.error("❌ Datos o resultado inválidos para formatear:", data);
        return null;
    }

    const result = data.result;
    const formatted = {
        name: result.name || 'N/A',
        address: result.formatted_address || 'N/A',
        phone: result.formatted_phone_number || 'N/A',
        website: result.website || 'N/A',
        rating: result.rating !== undefined ? result.rating : 'N/A',
        user_ratings_total: result.user_ratings_total !== undefined ? result.user_ratings_total : 'N/A',
        opening_hours: result.opening_hours ? result.opening_hours.weekday_text.join('<br>') : 'N/A',
        reviews: result.reviews || [],
        photos: result.photos || [],
        types: result.types || [],
        latitude: result.geometry && result.geometry.location ? result.geometry.location.lat : 'N/A',
        longitude: result.geometry && result.geometry.location ? result.geometry.location.lng : 'N/A'
    };
    console.log("✅ Datos formateados para API (formatPlaceData):", formatted);
    return formatted;
}

// Extracción usando Supabase
async function extractWithSupabase(url) {
    console.log('🌐 Iniciando extracción con Supabase...');
    console.log('URL a procesar (cliente -> Supabase):', url);
    
    const isShortUrl = url.includes('maps.app.goo.gl');
    console.log('¿Es URL corta (cliente)?', isShortUrl);
    
    // El cliente siempre envía la URL original a Supabase con la acción 'get_place_details'.
    // Supabase se encargará de resolver la URL y extraer el Place ID.
    try {
        const response = await fetch(window.CONFIG.supabase.functionUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${window.CONFIG.supabase.key}`
            },
            body: JSON.stringify({ 
                action: 'get_place_details',
                url: url, // Siempre enviamos la URL original
                fields: 'name,formatted_address,formatted_phone_number,website,rating,user_ratings_total,opening_hours,reviews,types,geometry,photos'
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Error en respuesta de Supabase:', response.status, errorText);
            throw new Error(`Error Supabase: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log('✅ Respuesta de Supabase recibida:', data);
        
        if (data.error) {
            throw new Error(data.error);
        }
        
        // Usamos la versión de formatPlaceData que es para el resultado de la API
        return formatPlaceData(data);
    } catch (error) {
        console.error('❌ Error en Supabase (función extractWithSupabase):', error);
        throw error;
    }
}

// Extracción usando Google Maps (solo para cuando NO se usa Supabase como fallback o método principal)
// Esta función ahora es más una envoltura que asegura que un Place ID válido se usa.
async function extractWithGoogleMaps(url) {
    // Si la URL es corta, debería haber sido manejada por Supabase primero.
    // Esto es un fallback/advertencia si el flujo no se sigue correctamente.
    if (url.includes('maps.app.goo.gl')) {
        console.warn('🔄 Advertencia: extractWithGoogleMaps llamado con URL corta. Esto debería ser manejado por Supabase.');
        return extractWithSupabase(url); // Redirige a Supabase si por alguna razón llega aquí
    }

    // Para URLs que no son cortas, intentamos extraer el Place ID directamente en el cliente
    const placeId = extractPlaceId(url);
    if (!placeId) {
        throw new Error('URL de Google Maps inválida o Place ID no extraíble directamente por el cliente.');
    }

    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        const callbackName = 'googlePlacesCallback_' + Date.now();
        
        window[callbackName] = function(response) {
            if (response.status === 'OK') {
                const data = formatPlaceData(response.result); // Usamos la versión de formatPlaceData para API
                resolve(data);
            } else {
                let errorMessage = `Error de API: ${response.status}`;
                if (response.error_message) {
                    errorMessage += ` - ${response.error_message}`;
                }
                reject(new Error(errorMessage));
            }
            delete window[callbackName];
            if (document.head.contains(script)) {
                document.head.removeChild(script);
            }
        };

        const apiUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,formatted_phone_number,website,rating,reviews,photos,opening_hours,types&key=${window.CONFIG.googleMaps.apiKey}&callback=${callbackName}`;
        
        console.log('🌐 Cargando script de Google Places API (cliente). URL de la API:', apiUrl);
        
        script.src = apiUrl;
        script.async = true;
        script.onerror = () => {
            console.error('❌ Error al cargar script de Google Places API (cliente). Verifica tu conexión a internet y la API Key.');
            reject(new Error('Error al cargar script de Google Places API. Verifica tu conexión a internet y la API Key.'));
            delete window[callbackName];
        };
        
        document.head.appendChild(script);
    });
}

// Función auxiliar para extraer Place ID (solo se usa en cliente para URLs no cortas o directas)
function extractPlaceId(url) {
    console.log('Analizando URL (cliente) para Place ID:', url);
    
    if (!url || typeof url !== 'string') {
        console.error('❌ URL no válida para extracción de Place ID (cliente):', url);
        return null;
    }

    url = url.trim();

    // 1. Si ya es un Place ID directo (empieza con ChIJ o 0x...)
    if (url.startsWith('ChIJ') || url.startsWith('0x')) {
        // Limpiar el ':0' si viene directamente en el Place ID inicial para 0x
        const cleanInputId = url.startsWith('0x') && url.includes(':') ? url.split(':')[0] : url;
        console.log('✅ URL es un Place ID directo (cliente), limpiado:', cleanInputId);
        return cleanInputId;
    }

    // Las URLs de maps.app.goo.gl son responsabilidad de Supabase, no las intentamos extraer aquí.
    if (url.includes('maps.app.goo.gl')) {
        console.log('🔍 URL corta de Google Maps detectada (cliente), se delegará a Supabase para su resolución completa.');
        return null; 
    }

    // 2. Patrones para URLs de Google Maps (sin incluir el problemático de coordenadas)
    const patterns = [
        /place_id=([^&]+)/,                    // Captura Place ID de `place_id=XYZ`
        /data=!4m[^!]+!1s(0x[0-9a-fA-F]+)/,    // Captura IDs como `0x...`
        /maps\/place\/[^/]+\/data=!4m[^!]+!1s(0x[0-9a-fA-F]+)/, // Patrón combinado para `0x`
        /maps\/place\/[^/]+\/data=!3m1!4b1!4m[^!]+!1s(0x[0-9a-fA-F]+)/ // Otro patrón común para `0x`
    ];

    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1]) {
            let potentialPlaceId = decodeURIComponent(match[1]);
            console.log(`Cliente: Patrón "${pattern.source}" encontró coincidencia: "${match[1]}". Potencial ID (antes de limpiar): "${potentialPlaceId}"`);
            
            // Limpieza adicional: Si el ID empieza con 0x y contiene un ':', tomar solo la parte antes del primer ':'
            if (potentialPlaceId.startsWith('0x') && potentialPlaceId.includes(':')) {
                potentialPlaceId = potentialPlaceId.split(':')[0];
                console.log('Cliente: Limpiado 0x ID removiendo sufijo de dos puntos:', potentialPlaceId);
            }

            // Validación final: Asegurarse de que el ID extraído sea un Place ID real (ChIJ o 0x)
            if (potentialPlaceId.startsWith('ChIJ') || potentialPlaceId.startsWith('0x')) {
                console.log('✅ Cliente: Place ID validado y encontrado:', potentialPlaceId);
                return potentialPlaceId;
            } else {
                console.log('⚠️ Cliente: Potencial ID no validado (no empieza con ChIJ o 0x):', potentialPlaceId);
            }
        }
    }

    console.error('❌ No se pudo extraer Place ID de la URL (cliente):', url);
    return null;
}

// Función principal para extraer datos
async function extractDataFromGoogleMapsLink(url) {
    console.log('Iniciando extracción de datos...');
    
    // Validar URL
    if (!url) {
        throw new Error('URL no proporcionada');
    }
    
    // Validar configuración
    if (!window.CONFIG) {
        console.error('❌ CONFIG no está disponible');
        throw new Error('Configuración no disponible');
    }
    
    console.log('✅ Configuración validada');
    
    try {
        // Intentar primero con Supabase si está configurado
        if (window.CONFIG.app.useSupabase && window.CONFIG.supabase.url && window.CONFIG.supabase.key) {
            console.log('Intentando extracción con Supabase...');
            try {
                const data = await extractWithSupabase(url); // Siempre enviamos la URL a Supabase
                if (data) {
                    console.info('✅ Datos extraídos exitosamente con Supabase');
                    return data;
                }
            } catch (supabaseError) {
                console.warn('⚠️ Error con Supabase:', supabaseError);
                if (!window.CONFIG.app.fallbackToGoogle) {
                    throw new Error('Error con Supabase y fallback deshabilitado');
                }
            }
        }

        // Si Supabase falla o no está configurado, usar Google Maps API directamente (menos recomendado para URLs cortas)
        if (window.CONFIG.app.fallbackToGoogle) {
            console.log('Intentando extracción con Google Maps API directamente...');
            if (!window.CONFIG.googleMaps.apiKey) {
                throw new Error('Se requiere API Key válida de Google Places. Configúrala en config.js');
            }
            // Aquí, extractWithGoogleMaps intentará extraer el ID o redirigir internamente si es URL corta
            return await extractWithGoogleMaps(url);
        }

        throw new Error('No hay método de extracción disponible (ni Supabase ni fallback a Google API directa)');
    } catch (error) {
        console.error('❌ Error extrayendo datos (función principal):', error);
        throw error;
    }
}

// --------- FUNCIONES AUXILIARES ADICIONALES (DE TU CÓDIGO ANTERIOR) ---------

// Obtener detalles del lugar usando Place ID (del código anterior del usuario)
async function getPlaceDetails(placeId, apiKey) {
  const fields = 'name,formatted_address,formatted_phone_number,website,rating,user_ratings_total,opening_hours,reviews,types,geometry,photos';
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(placeId)}&fields=${fields}&language=es&key=${apiKey}`;
  
  console.log('🌐 Haciendo llamada a Google Places API...');
  console.log('URL de la API:', url);
  
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    const callbackName = 'googlePlacesCallback_' + Date.now();
    
    // Configurar callback global
    window[callbackName] = function(data) {
      console.log('📡 Respuesta de Google Places API (getPlaceDetails):', data);
      
      if (data.status === 'OK') {
        resolve(data.result);
      } else {
        let errorMessage = `Error de API: ${data.status}`;
        
        // Mensajes de error específicos
        if (data.status === 'REQUEST_DENIED') {
          errorMessage += ' - API Key no tiene permisos o está mal configurada';
        } else if (data.status === 'OVER_QUERY_LIMIT') {
          errorMessage += ' - Cuota de API excedida';
        } else if (data.status === 'INVALID_REQUEST') {
          errorMessage += ' - Place ID inválido o parámetros incorrectos';
        } else if (data.error_message) {
          errorMessage += ` - ${data.error_message}`;
        }
        
        reject(new Error(errorMessage));
      }
      
      // Limpiar
      delete window[callbackName];
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
    
    // Configurar script con manejo de errores mejorado
    script.src = url + '&callback=' + callbackName;
    script.async = true;
    
    script.onerror = () => {
      console.error('❌ Error al cargar script de Google Places API (getPlaceDetails)');
      
      // Verificar si estamos en file://
      if (window.location.protocol === 'file:') {
        reject(new Error('Error: Estás ejecutando desde file://. Por favor, usa un servidor web local (http://localhost:8000)'));
      } else {
        // Verificar si la API Key es válida
        if (!apiKey || apiKey === 'TU_API_KEY_AQUI') {
          reject(new Error('Error: API Key no configurada o inválida. Por favor, configura una API Key válida en config.js'));
        } else {
          reject(new Error('Error al cargar script de Google Places API. Verifica tu conexión a internet y la configuración de la API Key.'));
        }
      }
      
      delete window[callbackName];
    };
    
    script.onload = () => {
      console.log('✅ Script de Google Places API cargado correctamente (getPlaceDetails)');
    };
    
    // Agregar script al DOM
    document.head.appendChild(script);
    
    // Timeout de seguridad
    setTimeout(() => {
      if (window[callbackName]) {
        console.error('⏰ Timeout en llamada a Google Places API (getPlaceDetails)');
        reject(new Error('Timeout en llamada a Google Places API. La API no respondió en 10 segundos.'));
        delete window[callbackName];
        if (document.head.contains(script)) {
          document.head.removeChild(script);
        }
      }
    }, 10000);
  });
}

// Obtener URLs de fotos del lugar (del código anterior del usuario)
async function getPlacePhotos(photos, apiKey, maxPhotos = 10) {
  if (!photos || photos.length === 0) {
    return [];
  }
  
  const photoUrls = [];
  const photosToProcess = photos.slice(0, maxPhotos);
  
  for (const photo of photosToProcess) {
    try {
      const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photo.photo_reference}&key=${apiKey}`;
      photoUrls.push({
        url: photoUrl,
        width: photo.width,
        height: photo.height,
        attributions: photo.html_attributions
      });
    } catch (error) {
      console.error('Error procesando foto (getPlacePhotos):', error);
    }
  }
  
  return photoUrls;
}

// Formatear datos extraídos para integrar con tu generador de websites (del código anterior del usuario)
function formatPlaceDataForWebsite(placeDetails, photos) {
  console.log("📝 Formateando datos para el website (formatPlaceDataForWebsite):", placeDetails, photos);
  return {
    // Información básica
    businessName: placeDetails.name || '',
    businessType: determineBusinessType(placeDetails.types) || '',
    logoText: extractLogoText(placeDetails.name) || '',
    mainDescription: generateDescription(placeDetails) || '',
    
    // Ubicación y contacto
    fullAddress: placeDetails.formatted_address || '',
    phone: placeDetails.formatted_phone_number || '',
    email: extractEmailFromWebsite(placeDetails.website) || '',
    website: placeDetails.website || '',
    
    // Características especiales
    specialFeature1: `Calificación ${placeDetails.rating || 'N/A'} estrellas`,
    specialFeature2: `${placeDetails.user_ratings_total || 0} reseñas`,
    specialFeature3: generateSpecialFeature(placeDetails) || '',
    
    // Horarios
    openingHours: placeDetails.opening_hours ? placeDetails.opening_hours.weekday_text : [],
    
    // Fotos
    photos: photos,
    
    // Datos adicionales
    rating: placeDetails.rating || 0,
    totalReviews: placeDetails.user_ratings_total || 0,
    priceLevel: placeDetails.price_level || 0,
    coordinates: {
      lat: placeDetails.geometry ? placeDetails.geometry.location.lat : 0,
      lng: placeDetails.geometry ? placeDetails.geometry.location.lng : 0
    }
  };
}

// Funciones auxiliares para formateo (del código anterior del usuario)
function determineBusinessType(types) {
  const typeMapping = {
    'restaurant': 'Restaurante',
    'food': 'Restaurante',
    'lodging': 'Hotel',
    'spa': 'Spa',
    'gym': 'Gimnasio',
    'hospital': 'Centro Médico',
    'store': 'Tienda',
    'cafe': 'Café'
  };
  
  for (const type of types) {
    if (typeMapping[type]) {
      return typeMapping[type];
    }
  }
  
  return 'Negocio';
}

function extractLogoText(businessName) {
  const words = businessName.split(' ');
  if (words.length === 1) {
    return words[0].substring(0, 4).toUpperCase();
  }
  return words.map(word => word.charAt(0)).join('').substring(0, 4).toUpperCase();
}

function generateDescription(placeDetails) {
  const rating = placeDetails.rating ? `con ${placeDetails.rating} estrellas` : '';
  const reviews = placeDetails.user_ratings_total ? `y ${placeDetails.user_ratings_total} reseñas` : '';
  
  return `Descubre ${placeDetails.name}, un establecimiento excepcional ${rating} ${reviews}. Ubicado en ${placeDetails.vicinity || 'una excelente ubicación'}, ofrecemos una experiencia única que supera las expectativas de nuestros clientes.`;
}

function generateSpecialFeature(placeDetails) {
  if (placeDetails.opening_hours && placeDetails.opening_hours.open_now) {
    return 'Abierto ahora';
  }
  if (placeDetails.price_level) {
    const priceLabels = ['Económico', 'Moderado', 'Caro', 'Muy caro'];
    return priceLabels[placeDetails.price_level - 1] || 'Precios variados';
  }
  return 'Servicio de calidad';
}

function extractEmailFromWebsite(website) {
  // Aquí puedes añadir lógica para intentar extraer un email del sitio web, si es necesario.
  // Por ahora, devuelve vacío.
  return '';
}

// Función para integrar con tu plataforma existente (del código anterior del usuario)
async function extractFromGoogleMaps() {
  const urlInput = document.getElementById('placeUrl');
  
  if (!urlInput || !urlInput.value.trim()) {
    showStatus('Por favor ingresa una URL de Google Maps', 'error');
    return;
    }
    
    try {
    showStatus('Extrayendo datos de Google Maps...', 'loading');
    
    const extractedData = await extractDataFromGoogleMapsLink(urlInput.value.trim());
    
    // Llenar formularios automáticamente
    fillFormWithExtractedData(extractedData);
    
    // Mostrar información extraída
    showExtractedInfo(extractedData);
    
    showStatus('¡Datos extraídos exitosamente!', 'success');
    
  } catch (error) {
    console.error('Error en extracción (extractFromGoogleMaps):', error);
    showStatus(`Error: ${error.message}`, 'error');
  }
}

// Llenar formularios con datos extraídos (del código anterior del usuario)
function fillFormWithExtractedData(data) {
  console.log('📝 Llenando formularios con datos extraídos:', data);
  
  const fields = {
    'businessName': data.businessName,
    'businessType': data.businessType,
    'logoText': data.logoText,
    'mainDescription': data.mainDescription,
    'fullAddress': data.fullAddress,
    'phone': data.phone,
    'email': data.email,
    'specialFeature1': data.specialFeature1,
    'specialFeature2': data.specialFeature2,
    'specialFeature3': data.specialFeature3
  };
  
  for (const [fieldId, value] of Object.entries(fields)) {
    const element = document.getElementById(fieldId);
    if (element) {
      element.value = value;
      console.log(`✅ Campo ${fieldId} llenado con: ${value}`);
    }
  }
}

// Mostrar información extraída (del código anterior del usuario)
function showExtractedInfo(data) {
  const extractedInfo = document.getElementById('extractedInfo');
  if (!extractedInfo) return;
  
  const infoFields = {
    'extractedName': data.businessName,
    'extractedAddress': data.fullAddress,
    'extractedPhone': data.phone,
    'extractedRating': data.rating ? `${data.rating} ⭐` : 'N/A',
    'extractedHours': data.openingHours && data.openingHours.length > 0 ? data.openingHours[0] : 'N/A',
    'extractedWebsite': data.website || 'N/A'
  };
  
  for (const [fieldId, value] of Object.entries(infoFields)) {
    const element = document.getElementById(fieldId);
    if (element) {
      element.textContent = value;
    }
  }
  
  extractedInfo.classList.remove('hidden');
}

// Mostrar estado de la extracción (del código anterior del usuario)
function showStatus(message, type) {
  console.log(`📢 Estado: ${type} - ${message}`);
  
  let statusDiv = document.getElementById('extractionStatus');
  if (!statusDiv) {
    statusDiv = document.createElement('div');
    statusDiv.id = 'extractionStatus';
    statusDiv.className = 'extraction-status';
    
    const placeUrlInput = document.getElementById('placeUrl');
    if (placeUrlInput && placeUrlInput.parentNode) {
      placeUrlInput.parentNode.appendChild(statusDiv);
    }
  }
  
  statusDiv.innerHTML = `<div class="status-${type}">${message}</div>`;
  
  if (type === 'success') {
    setTimeout(() => {
      statusDiv.innerHTML = '';
    }, 3000);
  }
}

// Función de diagnóstico específica para Google Places API (del código anterior del usuario)
async function diagnoseGooglePlacesAPI() {
  console.log('🔍 DIAGNÓSTICO DE GOOGLE PLACES API');
  console.log('====================================');
  
  // Verificar configuración
  console.log('⚙️ Verificando configuración:');
  const apiKey = window.CONFIG?.googleMaps?.apiKey; // Usar window.CONFIG
  console.log(`API Key configurada: ${apiKey ? '✅ Sí' : '❌ No'}`);
  
  if (apiKey) {
    console.log(`API Key válida: ${apiKey !== 'TU_API_KEY_AQUI' ? '✅ Sí' : '❌ No (placeholder)'}`);
    console.log(`API Key formato: ${apiKey.startsWith('AIza') ? '✅ Correcto' : '❌ Formato incorrecto'}`);
  }
  
  // Verificar funciones disponibles
  console.log('🔧 Verificando funciones:');
  const functions = [
    'extractDataFromGoogleMapsLink',
    'extractPlaceId',
    'getPlaceDetails',
    'getPlacePhotos',
    'formatPlaceDataForWebsite'
  ];
  
  functions.forEach(funcName => {
    const func = window[funcName];
    console.log(`${func ? '✅' : '❌'} ${funcName}: ${func ? 'Disponible' : 'NO DISPONIBLE'}`);
  });
  
  // Probar con Place ID de ejemplo
  if (apiKey && apiKey !== 'TU_API_KEY_AQUI') {
    console.log('🧪 Probando con Place ID de ejemplo...');
    const testPlaceId = 'ChIJN1t_tDeuEmsRUsoyG83frY4'; // Sydney Opera House
    
    try {
      console.log('📡 Haciendo llamada de prueba...');
      const result = await getPlaceDetails(testPlaceId, apiKey);
      console.log('✅ Llamada exitosa:', result.name);
      console.log('✅ API funcionando correctamente');
    } catch (error) {
      console.error('❌ Error en llamada de prueba:', error.message);
      
      if (error.message.includes('REQUEST_DENIED')) {
        console.error('💡 Posibles causas:');
        console.error('- API Key no tiene permisos para Places API');
        console.error('- Restricciones de dominio no configuradas');
        console.error('- APIs no habilitadas en Google Cloud Console');
      } else if (error.message.includes('OVER_QUERY_LIMIT')) {
        console.error('💡 Posibles causas:');
        console.error('- Cuota de API excedida');
        console.error('- Demasiadas llamadas en poco tiempo');
      } else if (error.message.includes('INVALID_REQUEST')) {
        console.error('💡 Posibles causas:');
        console.error('- Place ID inválido');
        console.error('- Parámetros incorrectos');
      }
    }
  }
  
  console.log('====================================');
  console.log('🔍 DIAGNÓSTICO COMPLETADO');
}


// Hacer todas las funciones disponibles globalmente
window.extractDataFromGoogleMapsLink = extractDataFromGoogleMapsLink;
window.extractWithGoogleMaps = extractWithGoogleMaps;
window.extractWithSupabase = extractWithSupabase;
window.extractPlaceId = extractPlaceId;
window.formatPlaceData = formatPlaceData; // Esta es la formatPlaceData que formatea de la API
window.getPlaceDetails = getPlaceDetails;
window.getPlacePhotos = getPlacePhotos;
window.formatPlaceDataForWebsite = formatPlaceDataForWebsite;
window.determineBusinessType = determineBusinessType;
window.extractLogoText = extractLogoText;
window.generateDescription = generateDescription;
window.generateSpecialFeature = generateSpecialFeature;
window.extractEmailFromWebsite = extractEmailFromWebsite;
window.extractFromGoogleMaps = extractFromGoogleMaps;
window.fillFormWithExtractedData = fillFormWithExtractedData;
window.showExtractedInfo = showExtractedInfo;
window.showStatus = showStatus;
window.diagnoseGooglePlacesAPI = diagnoseGooglePlacesAPI;
window.waitForConfig = waitForConfig; // La función de espera de config

// Notificar que places.js está listo
console.log('✅ places.js cargado y listo');


