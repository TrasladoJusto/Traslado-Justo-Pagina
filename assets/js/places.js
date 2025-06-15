/**
 * places.js - Extracción de datos de Google Places
 * Implementación básica según las instrucciones de Google Maps API
 */

// Función principal para extraer datos
async function extractDataFromGoogleMapsLink(url) {
    try {
        // Intentar primero con Supabase si está configurado
        if (window.CONFIG.app.useSupabase && window.CONFIG.supabase.url && window.CONFIG.supabase.key) {
            try {
                const data = await extractWithSupabase(url);
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

        // Si Supabase falla o no está configurado, usar Google Maps
        if (window.CONFIG.app.fallbackToGoogle) {
            if (!window.CONFIG.googleMaps.apiKey) {
                throw new Error('Se requiere API Key válida de Google Places. Configúrala en config.js');
            }
            return await extractWithGoogleMaps(url);
        }

        throw new Error('No hay método de extracción disponible');
    } catch (error) {
        console.error('❌ Error extrayendo datos:', error);
        throw error;
    }
}

// Extracción usando Supabase
async function extractWithSupabase(url) {
    try {
        const response = await fetch(window.CONFIG.supabase.functionUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${window.CONFIG.supabase.key}`
            },
            body: JSON.stringify({ url: url, action: 'get_place_details' })
        });

        if (!response.ok) {
            throw new Error(`Error Supabase: ${response.statusText}`);
        }

        const data = await response.json();
        return formatPlaceData(data);
    } catch (error) {
        console.error('Error en Supabase:', error);
        throw error;
    }
}

// Extracción usando Google Maps (fallback)
async function extractWithGoogleMaps(url) {
    const placeId = extractPlaceId(url);
    if (!placeId) {
        throw new Error('URL de Google Maps inválida');
    }

    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        const callbackName = 'googlePlacesCallback_' + Date.now();
        
        window[callbackName] = function(response) {
            if (response.status === 'OK') {
                const data = formatPlaceData(response.result);
                resolve(data);
            } else {
                reject(new Error(`Error de API: ${response.status}`));
            }
            delete window[callbackName];
            document.head.removeChild(script);
        };

        script.src = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,formatted_phone_number,website,rating,reviews,photos,opening_hours,types&key=${window.CONFIG.googleMaps.apiKey}&callback=${callbackName}`;
        script.async = true;
        script.onerror = () => {
            reject(new Error('Error al cargar script de Google Places API'));
            delete window[callbackName];
        };
        document.head.appendChild(script);
    });
}

// Función auxiliar para extraer Place ID
function extractPlaceId(url) {
    const patterns = [
        /place_id=([^&]+)/,
        /cid=(\d+)/,
        /maps\/place\/[^\/]+\/([^\/]+)/
    ];

    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
    }
    return null;
}

// Formatear datos del lugar
function formatPlaceData(data) {
    return {
        name: data.name || '',
        address: data.formatted_address || '',
        phone: data.formatted_phone_number || '',
        website: data.website || '',
        rating: data.rating || 0,
        photos: (data.photos || []).map(photo => photo.photo_reference),
        hours: data.opening_hours?.weekday_text || [],
        type: data.types?.[0] || 'business'
    };
}

// Obtener detalles del lugar usando Place ID
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
      console.log('📡 Respuesta de Google Places API:', data);
      
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
      console.error('❌ Error al cargar script de Google Places API');
      
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
      console.log('✅ Script de Google Places API cargado correctamente');
    };
    
    // Agregar script al DOM
    document.head.appendChild(script);
    
    // Timeout de seguridad
    setTimeout(() => {
      if (window[callbackName]) {
        console.error('⏰ Timeout en llamada a Google Places API');
        reject(new Error('Timeout en llamada a Google Places API. La API no respondió en 10 segundos.'));
        delete window[callbackName];
        if (document.head.contains(script)) {
          document.head.removeChild(script);
        }
      }
    }, 10000);
  });
}

// Obtener URLs de fotos del lugar
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
      console.error('Error procesando foto:', error);
    }
  }
  
  return photoUrls;
}

// Formatear datos extraídos para integrar con tu generador de websites
function formatPlaceDataForWebsite(placeDetails, photos) {
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

// Funciones auxiliares para formateo
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
  return '';
}

// Función para integrar con tu plataforma existente
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
    console.error('Error en extracción:', error);
    showStatus(`Error: ${error.message}`, 'error');
  }
}

// Llenar formularios con datos extraídos
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

// Mostrar información extraída
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

// Mostrar estado de la extracción
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

// Función de diagnóstico específica para Google Places API
async function diagnoseGooglePlacesAPI() {
  console.log('🔍 DIAGNÓSTICO DE GOOGLE PLACES API');
  console.log('====================================');
  
  // Verificar configuración
  console.log('⚙️ Verificando configuración:');
  const apiKey = window.GOOGLE_MAPS_CONFIG?.apiKey;
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

// Exportar funciones para uso global
window.extractDataFromGoogleMapsLink = extractDataFromGoogleMapsLink;
window.extractFromGoogleMaps = extractFromGoogleMaps;
window.fillFormWithExtractedData = fillFormWithExtractedData;
window.showExtractedInfo = showExtractedInfo;
window.showStatus = showStatus;
window.diagnoseGooglePlacesAPI = diagnoseGooglePlacesAPI;

console.log('✅ Places.js cargado correctamente');
console.log('🔧 Funciones disponibles:');
console.log('- extractDataFromGoogleMapsLink(url)');
console.log('- extractFromGoogleMaps()');
console.log('- diagnoseGooglePlacesAPI()');
