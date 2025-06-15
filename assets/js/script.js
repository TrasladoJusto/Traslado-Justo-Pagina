/**
 * script.js - Funcionalidad principal de la aplicación WebCreator Pro
 * Maneja la interfaz de usuario, navegación, formularios y interacciones
 */

// Estado global de la aplicación
const appState = {
  currentTab: 'places',
  selectedTemplate: null,
  selectedColorScheme: null,
  extractedData: null,
  formData: {
    business: {},
    contact: {},
    social: {},
    design: {},
    advanced: {}
  },
  templatesLoaded: false
};

// Configuración de plantillas
const templates = [
  {
    id: 'restaurant',
    name: 'Restaurante',
    icon: 'fas fa-utensils',
    description: 'Perfecta para restaurantes, bares y cafeterías',
    colors: ['#d97706', '#f59e0b', '#fbbf24', '#fef3c7'],
    features: ['menú', 'reservas', 'horarios', 'ubicación']
  },
  {
    id: 'cafe',
    name: 'Café',
    icon: 'fas fa-coffee',
    description: 'Ideal para cafeterías y pastelerías',
    colors: ['#7c3aed', '#8b5cf6', '#a78bfa', '#ddd6fe'],
    features: ['menú', 'ambiente', 'horarios', 'ubicación']
  },
  {
    id: 'hotel',
    name: 'Hotel',
    icon: 'fas fa-hotel',
    description: 'Diseñada para hoteles y alojamientos',
    colors: ['#059669', '#10b981', '#34d399', '#d1fae5'],
    features: ['habitaciones', 'reservas', 'servicios', 'ubicación']
  },
  {
    id: 'store',
    name: 'Tienda',
    icon: 'fas fa-shopping-bag',
    description: 'Perfecta para tiendas y comercios',
    colors: ['#dc2626', '#ef4444', '#f87171', '#fecaca'],
    features: ['productos', 'catálogo', 'horarios', 'ubicación']
  },
  {
    id: 'gym',
    name: 'Gimnasio',
    icon: 'fas fa-dumbbell',
    description: 'Ideal para gimnasios y centros deportivos',
    colors: ['#1f2937', '#374151', '#6b7280', '#d1d5db'],
    features: ['clases', 'membresías', 'horarios', 'equipos']
  },
  {
    id: 'clinic',
    name: 'Clínica',
    icon: 'fas fa-stethoscope',
    description: 'Diseñada para clínicas y consultorios',
    colors: ['#0891b2', '#06b6d4', '#22d3ee', '#a5f3fc'],
    features: ['servicios', 'citas', 'horarios', 'ubicación']
  },
  {
    id: 'event',
    name: 'Eventos',
    icon: 'fas fa-calendar-alt',
    description: 'Perfecta para salones de eventos',
    colors: ['#be185d', '#ec4899', '#f472b6', '#fce7f3'],
    features: ['eventos', 'reservas', 'galería', 'contacto']
  },
  {
    id: 'service',
    name: 'Servicios',
    icon: 'fas fa-tools',
    description: 'Ideal para servicios profesionales',
    colors: ['#7c2d12', '#92400e', '#b45309', '#fef3c7'],
    features: ['servicios', 'portafolio', 'contacto', 'ubicación']
  }
];

// Esquemas de color sugeridos
const colorSchemes = {
  restaurant: [
    { name: 'Cálido', colors: ['#d97706', '#f59e0b', '#fbbf24', '#fef3c7'] },
    { name: 'Elegante', colors: ['#1f2937', '#374151', '#6b7280', '#f3f4f6'] },
    { name: 'Fresco', colors: ['#059669', '#10b981', '#34d399', '#d1fae5'] }
  ],
  cafe: [
    { name: 'Acogedor', colors: ['#7c3aed', '#8b5cf6', '#a78bfa', '#ddd6fe'] },
    { name: 'Clásico', colors: ['#92400e', '#a16207', '#d97706', '#fef3c7'] },
    { name: 'Moderno', colors: ['#1f2937', '#374151', '#6b7280', '#f9fafb'] }
  ],
  hotel: [
    { name: 'Lujo', colors: ['#059669', '#10b981', '#34d399', '#d1fae5'] },
    { name: 'Tradicional', colors: ['#92400e', '#a16207', '#d97706', '#fef3c7'] },
    { name: 'Minimalista', colors: ['#1f2937', '#374151', '#6b7280', '#f9fafb'] }
  ],
  store: [
    { name: 'Vibrante', colors: ['#dc2626', '#ef4444', '#f87171', '#fecaca'] },
    { name: 'Profesional', colors: ['#1f2937', '#374151', '#6b7280', '#f3f4f6'] },
    { name: 'Amigable', colors: ['#059669', '#10b981', '#34d399', '#d1fae5'] }
  ],
  gym: [
    { name: 'Energético', colors: ['#dc2626', '#ef4444', '#f87171', '#fecaca'] },
    { name: 'Fuerte', colors: ['#1f2937', '#374151', '#6b7280', '#d1d5db'] },
    { name: 'Motivador', colors: ['#059669', '#10b981', '#34d399', '#d1fae5'] }
  ],
  clinic: [
    { name: 'Profesional', colors: ['#0891b2', '#06b6d4', '#22d3ee', '#a5f3fc'] },
    { name: 'Tranquilo', colors: ['#059669', '#10b981', '#34d399', '#d1fae5'] },
    { name: 'Confiable', colors: ['#1f2937', '#374151', '#6b7280', '#f9fafb'] }
  ],
  event: [
    { name: 'Festivo', colors: ['#be185d', '#ec4899', '#f472b6', '#fce7f3'] },
    { name: 'Elegante', colors: ['#1f2937', '#374151', '#6b7280', '#f3f4f6'] },
    { name: 'Celebración', colors: ['#d97706', '#f59e0b', '#fbbf24', '#fef3c7'] }
  ],
  service: [
    { name: 'Profesional', colors: ['#7c2d12', '#92400e', '#b45309', '#fef3c7'] },
    { name: 'Confiable', colors: ['#1f2937', '#374151', '#6b7280', '#f9fafb'] },
    { name: 'Moderno', colors: ['#0891b2', '#06b6d4', '#22d3ee', '#a5f3fc'] }
  ]
};

// Características disponibles
const availableFeatures = [
  { id: 'menu', name: 'Menú de productos', icon: 'fas fa-list' },
  { id: 'reservations', name: 'Sistema de reservas', icon: 'fas fa-calendar-check' },
  { id: 'gallery', name: 'Galería de fotos', icon: 'fas fa-images' },
  { id: 'testimonials', name: 'Testimonios', icon: 'fas fa-quote-left' },
  { id: 'contact_form', name: 'Formulario de contacto', icon: 'fas fa-envelope' },
  { id: 'map', name: 'Mapa interactivo', icon: 'fas fa-map-marker-alt' },
  { id: 'social_links', name: 'Enlaces a redes sociales', icon: 'fas fa-share-alt' },
  { id: 'blog', name: 'Blog/Noticias', icon: 'fas fa-newspaper' },
  { id: 'services', name: 'Lista de servicios', icon: 'fas fa-cogs' },
  { id: 'team', name: 'Equipo/Personal', icon: 'fas fa-users' },
  { id: 'pricing', name: 'Precios/Tarifas', icon: 'fas fa-tags' },
  { id: 'faq', name: 'Preguntas frecuentes', icon: 'fas fa-question-circle' }
];

// Esperar a que todos los componentes necesarios estén disponibles
async function waitForComponents() {
    return new Promise((resolve) => {
        const checkComponents = setInterval(() => {
            if (window.CONFIG && 
                typeof window.extractDataFromGoogleMapsLink === 'function' &&
                typeof window.extractWithGoogleMaps === 'function') {
                clearInterval(checkComponents);
                resolve();
            }
        }, 100);
    });
}

// Inicializar la aplicación
async function initializeApp() {
    try {
        // Esperar a que todos los componentes estén disponibles
        await waitForComponents();
        
        console.log('✅ Todos los componentes cargados correctamente');
        
        // Inicializar componentes críticos
        initializeCriticalComponents();
        
        // Inicializar componentes no críticos
        initializeNonCriticalComponents();
        
        // Configurar navegación
        setupNavigation();
        
        // Configurar plantillas
        setupTemplates();
        
        // Configurar manejadores de formularios
        setupFormHandlers();
        
        // Configurar esquemas de colores
        setupColorSchemes();
        
        console.log('🚀 Aplicación inicializada correctamente');
        
    } catch (error) {
        console.error('❌ Error inicializando la aplicación:', error);
        showNotification('error', 'Error de Inicialización', 'No se pudo inicializar la aplicación correctamente. Por favor, recarga la página.');
    }
}

// Iniciar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initializeApp);

function initializeCriticalComponents() {
  setupNavigation();
  setupTemplates();
  setupFormHandlers();
  showTab('places');
  console.log('Componentes críticos inicializados');
}

function initializeNonCriticalComponents() {
  console.log('Inicializando componentes no críticos...');
  
  // Cargar plantillas de forma asíncrona
  loadTemplatesAsync();
}

/**
 * Configuración de la navegación optimizada
 */
function setupNavigation() {
  console.log('Configurando navegación...');
  const navItems = document.querySelectorAll('.nav-item');
  console.log('Elementos de navegación encontrados:', navItems.length);
  
    navItems.forEach(item => {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      const tab = this.dataset.tab;
      console.log('Cambiando a pestaña:', tab);
      
      // Optimización: Usar requestAnimationFrame para mejor rendimiento
      requestAnimationFrame(() => {
        showTab(tab);
        
        // Actualizar estado activo
        navItems.forEach(nav => nav.classList.remove('active'));
        this.classList.add('active');
      });
      });
    });
}

/**
 * Muestra una pestaña específica optimizada
 */
function showTab(tabName) {
  console.log('Mostrando pestaña:', tabName);
  
  // Ocultar todas las secciones de forma eficiente
  const sections = document.querySelectorAll('.content-section');
  sections.forEach(section => {
    if (section.classList.contains('active')) {
      section.classList.remove('active');
      console.log('Ocultando sección:', section.id);
    }
  });
  
  // Mostrar la sección seleccionada
  const targetSection = document.getElementById(`${tabName}-section`);
  if (targetSection) {
    targetSection.classList.add('active');
    console.log('Mostrando sección:', targetSection.id);
    appState.currentTab = tabName;
    
    // Lazy load del contenido si es necesario
    if (tabName === 'template' && !appState.templatesLoaded) {
      loadTemplatesAsync();
    }
  } else {
    console.error('Sección no encontrada:', `${tabName}-section`);
  }
}

/**
 * Carga las plantillas de forma asíncrona
 */
function loadTemplatesAsync() {
  if (appState.templatesLoaded) return;
  
  console.log('Cargando plantillas de forma asíncrona...');
  
  // Simular carga asíncrona
  setTimeout(() => {
    setupTemplates();
    appState.templatesLoaded = true;
    console.log('Plantillas cargadas');
  }, 50);
}

/**
 * Configuración de plantillas optimizada
 */
function setupTemplates() {
  console.log('Configurando plantillas...');
  const templateGrid = document.getElementById('templateGrid');
  
  if (!templateGrid) {
    console.error('No se encontró el contenedor de plantillas');
    return;
  }
  
  // Limpiar contenido existente de forma eficiente
  templateGrid.innerHTML = '';
  
  // Crear fragmento para mejor rendimiento
  const fragment = document.createDocumentFragment();
  
  templates.forEach(template => {
    const templateCard = createTemplateCard(template);
    fragment.appendChild(templateCard);
  });
  
  templateGrid.appendChild(fragment);
  console.log('Plantillas configuradas:', templates.length);
}

/**
 * Crea una tarjeta de plantilla optimizada
 */
function createTemplateCard(template) {
  const card = document.createElement('div');
  card.className = 'template-card';
  card.dataset.template = template.id;
  
  card.innerHTML = `
    <div class="template-icon">
      <i class="${template.icon}"></i>
    </div>
    <div class="template-name">${template.name}</div>
    <div class="template-description">${template.description}</div>
  `;
  
  // Optimización: Usar delegación de eventos
  card.addEventListener('click', () => {
    console.log('Seleccionando plantilla:', template.name);
    requestAnimationFrame(() => {
      selectTemplate(template);
    });
  });
  
  return card;
}

/**
 * Selecciona una plantilla optimizada
 */
function selectTemplate(template) {
  console.log('Plantilla seleccionada:', template.name);
  
  // Remover selección anterior de forma eficiente
  const selectedCards = document.querySelectorAll('.template-card.selected');
  selectedCards.forEach(card => card.classList.remove('selected'));
  
  // Seleccionar nueva plantilla
  const selectedCard = document.querySelector(`[data-template="${template.id}"]`);
  if (selectedCard) {
    selectedCard.classList.add('selected');
  }
  
  appState.selectedTemplate = template;
  
  // Actualizar esquemas de color de forma asíncrona
  requestAnimationFrame(() => {
    updateSuggestedColorSchemes(template.id);
  });
  
  // Auto-completar tipo de negocio
  const businessTypeSelect = document.getElementById('businessType');
  if (businessTypeSelect) {
    businessTypeSelect.value = template.id;
  }
  
  showAppNotification('success', 'Plantilla seleccionada', `Has seleccionado la plantilla "${template.name}"`);
}

/**
 * Actualiza los esquemas de color sugeridos optimizado
 */
function updateSuggestedColorSchemes(templateId) {
  console.log('Actualizando esquemas de color para:', templateId);
  const schemeGrid = document.getElementById('suggestedSchemes');
  if (!schemeGrid) {
    console.error('No se encontró el contenedor de esquemas');
    return;
  }
  
  // Limpiar contenido de forma eficiente
  schemeGrid.innerHTML = '';
  
  const schemes = colorSchemes[templateId] || colorSchemes.service;
  
  // Crear fragmento para mejor rendimiento
  const fragment = document.createDocumentFragment();
  
  schemes.forEach(scheme => {
    const schemeCard = createSchemeCard(scheme);
    fragment.appendChild(schemeCard);
  });
  
  schemeGrid.appendChild(fragment);
  console.log('Esquemas actualizados:', schemes.length);
}

/**
 * Crea una tarjeta de esquema de color optimizada
 */
function createSchemeCard(scheme) {
  const card = document.createElement('div');
  card.className = 'scheme-card';
  
  card.innerHTML = `
    <div class="scheme-colors">
      ${scheme.colors.map(color => `
        <div class="scheme-color" style="background-color: ${color}"></div>
      `).join('')}
    </div>
    <div class="scheme-name">${scheme.name}</div>
  `;
  
  card.addEventListener('click', (e) => {
    console.log('Seleccionando esquema:', scheme.name);
    requestAnimationFrame(() => {
      selectColorScheme(scheme, e);
    });
  });
  
  return card;
}

/**
 * Selecciona un esquema de color optimizado
 */
function selectColorScheme(scheme, event) {
  console.log('Esquema seleccionado:', scheme.name);
  
  // Remover selección anterior de forma eficiente
  const selectedCards = document.querySelectorAll('.scheme-card.selected');
  selectedCards.forEach(card => card.classList.remove('selected'));
  
  // Seleccionar nuevo esquema
  const targetCard = event.target.closest('.scheme-card');
  if (targetCard) {
    targetCard.classList.add('selected');
  }
  
  appState.selectedColorScheme = scheme;
  
  // Aplicar colores de forma asíncrona
  requestAnimationFrame(() => {
    applyColorScheme(scheme);
    updateColorPreview();
  });
  
  showAppNotification('success', 'Esquema aplicado', `Has aplicado el esquema "${scheme.name}"`);
}

/**
 * Aplica un esquema de color optimizado
 */
function applyColorScheme(scheme) {
  console.log('Aplicando esquema de colores:', scheme.name);
  
  const colorInputs = {
    primaryColor: scheme.colors[0],
    secondaryColor: scheme.colors[1],
    accentColor: scheme.colors[2],
    textColor: '#1f2937'
  };
  
  Object.entries(colorInputs).forEach(([inputId, color]) => {
    const input = document.getElementById(inputId);
    const textInput = document.getElementById(`${inputId}Text`);
    
    if (input) {
      input.value = color;
      console.log(`Color ${inputId} aplicado:`, color);
    }
    if (textInput) {
      textInput.value = color;
    }
  });
}

/**
 * Configuración de manejadores de formularios optimizada
 */
function setupFormHandlers() {
  console.log('Configurando manejadores de formularios...');
  
  // Extracción de datos de Google Places
  const extractBtn = document.getElementById('extractBtn');
  if (extractBtn) {
    extractBtn.addEventListener('click', handleExtractPlaceData);
    console.log('Botón de extracción configurado');
  } else {
    console.error('No se encontró el botón de extracción');
  }
  
  // Prueba de API de Google Places
  const testApiBtn = document.getElementById('testApiBtn');
  if (testApiBtn) {
    testApiBtn.addEventListener('click', handleTestAPI);
    console.log('Botón de prueba de API configurado');
  } else {
    console.error('No se encontró el botón de prueba de API');
  }
  
  // Generación del sitio
  const generateBtn = document.getElementById('generateSiteBtn');
  if (generateBtn) {
    generateBtn.addEventListener('click', handleGenerateSite);
    console.log('Botón de generación configurado');
      } else {
    console.error('No se encontró el botón de generación');
  }
  
  // Descarga del ZIP
  const downloadBtn = document.getElementById('downloadZipBtn');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', handleDownloadZip);
    console.log('Botón de descarga configurado');
  } else {
    console.error('No se encontró el botón de descarga');
  }
  
  // Actualizar vista previa
  const refreshBtn = document.getElementById('refreshPreviewBtn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', handleRefreshPreview);
    console.log('Botón de actualizar vista previa configurado');
  } else {
    console.error('No se encontró el botón de actualizar vista previa');
  }
}

/**
 * Maneja la extracción de datos del lugar
 */
async function handleExtractPlaceData() {
  console.log('=== INICIO DE EXTRACCIÓN ===');
  
  const urlInput = document.getElementById('placeUrl');
  
  if (!urlInput) {
    console.error('Elemento de entrada no encontrado');
    showNotification('error', 'Error', 'Elemento de entrada no encontrado');
    return;
  }
  
  const urlValue = urlInput.value.trim();
  
  if (!urlValue) {
    showNotification('error', 'Error', 'Por favor ingresa una URL de Google Maps');
    return;
  }

  showNotification('info', 'Extrayendo', 'Extrayendo datos del lugar...');
  
  try {
    // Verificar que la función esté disponible
    if (typeof window.extractDataFromGoogleMapsLink !== 'function') {
      throw new Error('Función de extracción no disponible. Asegúrate de que places.js esté cargado.');
    }

    // Extraer datos usando la nueva implementación
    console.log('Extrayendo datos de:', urlValue);
    const extractedData = await window.extractDataFromGoogleMapsLink(urlValue);
    
    console.log('Datos extraídos:', extractedData);
    
    if (extractedData && extractedData.businessName) {
      // Guardar datos
      appState.extractedData = extractedData;
      
      // Llenar formulario
      fillFormWithData(extractedData);
      
      // Mostrar información extraída
      showExtractedInfo(extractedData);
      
      showNotification('success', 'Extracción exitosa', 'Datos extraídos exitosamente');
      
          } else {
      showNotification('error', 'Error', 'No se pudieron extraer los datos');
    }
  } catch (error) {
    console.error('Error al extraer datos:', error);
    showNotification('error', 'Error', 'Error al extraer datos: ' + error.message);
  }
}

/**
 * Muestra la información extraída en la interfaz
 */
function showExtractedInfo(data) {
  const extractedInfo = document.getElementById('extractedInfo');
  if (extractedInfo) {
    // Llenar los campos de información extraída
    const nameSpan = document.getElementById('extractedName');
    const addressSpan = document.getElementById('extractedAddress');
    const phoneSpan = document.getElementById('extractedPhone');
    const ratingSpan = document.getElementById('extractedRating');
    const hoursSpan = document.getElementById('extractedHours');
    const websiteSpan = document.getElementById('extractedWebsite');
    
    if (nameSpan) nameSpan.textContent = data.businessName || data.name || '-';
    if (addressSpan) addressSpan.textContent = data.fullAddress || data.address || '-';
    if (phoneSpan) phoneSpan.textContent = data.phone || '-';
    if (ratingSpan) ratingSpan.textContent = data.rating ? `${data.rating} ⭐` : '-';
    if (hoursSpan) hoursSpan.textContent = data.openingHours && data.openingHours.length > 0 ? data.openingHours[0] : '-';
    if (websiteSpan) websiteSpan.textContent = data.website || '-';
    
    // Mostrar la sección
    extractedInfo.classList.remove('hidden');
  }
}

/**
 * Llena el formulario con los datos extraídos del lugar
 * @param {Object} data - Datos extraídos del lugar
 */
function fillFormWithData(data) {
  try {
    console.log('=== LLENANDO FORMULARIO ===');
    console.log('Datos a llenar:', data);
    
    // Llenar datos del negocio
    if (data.businessName || data.name) {
      const nameInput = document.getElementById('businessName');
      if (nameInput) {
        nameInput.value = data.businessName || data.name;
        console.log('✅ Nombre llenado:', data.businessName || data.name);
      } else {
        console.warn('⚠️ Campo businessName no encontrado');
      }
    }
    
    if (data.fullAddress || data.address) {
      const addressInput = document.getElementById('fullAddress');
      if (addressInput) {
        addressInput.value = data.fullAddress || data.address;
        console.log('✅ Dirección llenada:', data.fullAddress || data.address);
      } else {
        console.warn('⚠️ Campo fullAddress no encontrado');
      }
    }
    
    if (data.phone) {
      const phoneInput = document.getElementById('phone');
      if (phoneInput) {
        phoneInput.value = data.phone;
        console.log('✅ Teléfono llenado:', data.phone);
      } else {
        console.warn('⚠️ Campo phone no encontrado');
      }
    }
    
    if (data.website) {
      const websiteInput = document.getElementById('website');
      if (websiteInput) {
        websiteInput.value = data.website;
        console.log('✅ Sitio web llenado:', data.website);
      } else {
        console.warn('⚠️ Campo website no encontrado');
      }
    }
    
    if (data.email) {
      const emailInput = document.getElementById('email');
      if (emailInput) {
        emailInput.value = data.email;
        console.log('✅ Email llenado:', data.email);
      } else {
        console.warn('⚠️ Campo email no encontrado');
      }
    }
    
    // Llenar tipo de negocio
    if (data.businessType) {
      const typeInput = document.getElementById('businessType');
      if (typeInput) {
        typeInput.value = data.businessType;
        console.log('✅ Tipo de negocio llenado:', data.businessType);
          } else {
        console.warn('⚠️ Campo businessType no encontrado');
      }
    }
    
    // Llenar logo text
    if (data.logoText) {
      const logoInput = document.getElementById('logoText');
      if (logoInput) {
        logoInput.value = data.logoText;
        console.log('✅ Logo text llenado:', data.logoText);
      } else {
        console.warn('⚠️ Campo logoText no encontrado');
      }
    }
    
    // Llenar descripción principal
    if (data.mainDescription) {
      const descInput = document.getElementById('mainDescription');
      if (descInput) {
        descInput.value = data.mainDescription;
        console.log('✅ Descripción principal llenada');
        } else {
        console.warn('⚠️ Campo mainDescription no encontrado');
      }
    }
    
    // Llenar características especiales
    if (data.specialFeature1) {
      const feature1Input = document.getElementById('specialFeature1');
      if (feature1Input) {
        feature1Input.value = data.specialFeature1;
        console.log('✅ Característica 1 llenada:', data.specialFeature1);
      }
    }
    
    if (data.specialFeature2) {
      const feature2Input = document.getElementById('specialFeature2');
      if (feature2Input) {
        feature2Input.value = data.specialFeature2;
        console.log('✅ Característica 2 llenada:', data.specialFeature2);
      }
    }
    
    if (data.specialFeature3) {
      const feature3Input = document.getElementById('specialFeature3');
      if (feature3Input) {
        feature3Input.value = data.specialFeature3;
        console.log('✅ Característica 3 llenada:', data.specialFeature3);
      }
    }
    
    // Llenar horarios si están disponibles
    if (data.openingHours && data.openingHours.length > 0) {
      console.log('✅ Horarios disponibles:', data.openingHours);
      // Aquí puedes implementar la lógica para llenar los horarios en el editor
    }
    
    // Actualizar contadores de caracteres
    updateCharacterCounters();
    
    console.log('=== FORMULARIO LLENADO EXITOSAMENTE ===');
  } catch (error) {
    console.error('❌ Error al llenar formulario:', error);
  }
}

/**
 * Maneja la generación del sitio optimizada
 */
function handleGenerateSite() {
  console.log('Iniciando generación del sitio...');
  
  if (!appState.selectedTemplate) {
    showAppNotification('error', 'Error', 'Por favor, selecciona una plantilla primero');
    return;
  }
  
  try {
    showLoading(true);
    
    // Recopilar datos del formulario
    const formData = collectFormData();
    
    // Usar la función de generate.js para actualizar la vista previa
    if (typeof updateLivePreview === 'function') {
      updateLivePreview(formData);
    } else {
      // Fallback a la función local
      updatePreview(formData);
    }
    
    showAppNotification('success', 'Sitio generado', 'Tu sitio web ha sido generado exitosamente');
    
  } catch (error) {
    console.error('Error al generar sitio:', error);
    showAppNotification('error', 'Error', 'No se pudo generar el sitio web');
  } finally {
    showLoading(false);
  }
}

/**
 * Recopila todos los datos del formulario optimizado
 */
function collectFormData() {
  console.log('Recopilando datos del formulario...');
  
  return {
    template: appState.selectedTemplate,
    colorScheme: appState.selectedColorScheme,
    extractedData: appState.extractedData,
    business: {
      name: document.getElementById('businessName')?.value || '',
      type: document.getElementById('businessType')?.value || '',
      description: document.getElementById('businessDescription')?.value || '',
      slogan: document.getElementById('businessSlogan')?.value || ''
    },
    contact: {
      address: document.getElementById('businessAddress')?.value || '',
      phone: document.getElementById('businessPhone')?.value || '',
      email: document.getElementById('businessEmail')?.value || '',
      whatsapp: document.getElementById('businessWhatsapp')?.value || '',
      website: document.getElementById('businessWebsite')?.value || ''
    },
    social: {
      instagram: document.getElementById('socialInstagram')?.value || '',
      facebook: document.getElementById('socialFacebook')?.value || '',
      twitter: document.getElementById('socialTwitter')?.value || '',
      linkedin: document.getElementById('socialLinkedin')?.value || '',
      youtube: document.getElementById('socialYoutube')?.value || '',
      tiktok: document.getElementById('socialTiktok')?.value || ''
    },
    design: {
      primaryColor: document.getElementById('primaryColor')?.value || '#3b82f6',
      secondaryColor: document.getElementById('secondaryColor')?.value || '#f59e0b',
      accentColor: document.getElementById('accentColor')?.value || '#10b981',
      textColor: document.getElementById('textColor')?.value || '#1f2937'
    },
    advanced: {
      openingHours: collectOpeningHours(),
      features: collectSelectedFeatures(),
      customCSS: document.getElementById('customCSS')?.value || ''
    }
  };
}

/**
 * Recopila los horarios de apertura optimizado
 */
function collectOpeningHours() {
  const hours = [];
  const hourRows = document.querySelectorAll('.hour-row');
  
  hourRows.forEach(row => {
    const day = row.querySelector('.hour-day').textContent;
    const isOpen = row.querySelector('input[type="checkbox"]').checked;
    const times = row.querySelectorAll('input[type="time"]');
    
    if (isOpen && times.length >= 2) {
      hours.push({
        day,
        open: times[0].value,
        close: times[1].value
      });
    }
  });
  
  return hours;
}

/**
 * Recopila las características seleccionadas optimizado
 */
function collectSelectedFeatures() {
  const features = [];
  const selectedFeatures = document.querySelectorAll('.feature-item.selected input[type="checkbox"]');
  
  selectedFeatures.forEach(checkbox => {
    features.push(checkbox.id.replace('feature_', ''));
  });
  
  return features;
}

/**
 * Actualiza la vista previa optimizada
 */
function updatePreview(formData) {
  console.log('Actualizando vista previa con datos:', formData);
  
  const previewFrame = document.getElementById('previewFrame');
  if (!previewFrame) {
    console.error('Frame de vista previa no encontrado');
    return;
  }
  
  // Usar la función updateLivePreview de generate.js si está disponible
  if (typeof window.updateLivePreview === 'function') {
    console.log('Usando updateLivePreview de generate.js');
    window.updateLivePreview(formData);
          } else {
    console.log('updateLivePreview no disponible, usando fallback');
    // Fallback: mostrar placeholder con los datos
    previewFrame.innerHTML = `
      <div style="padding: 20px; text-align: center; color: #6b7280; font-family: Arial, sans-serif;">
        <h2 style="color: ${formData.design?.primaryColor || '#3b82f6'};">Vista Previa del Sitio</h2>
        <p><strong>Plantilla:</strong> ${formData.template?.name || 'No seleccionada'}</p>
        <p><strong>Negocio:</strong> ${formData.business?.name || 'Sin nombre'}</p>
        <p><strong>Colores:</strong> ${formData.design?.primaryColor || '#3b82f6'}, ${formData.design?.secondaryColor || '#f59e0b'}</p>
        <p><strong>Dirección:</strong> ${formData.contact?.address || 'No especificada'}</p>
        <p><strong>Teléfono:</strong> ${formData.contact?.phone || 'No especificado'}</p>
        <div style="margin-top: 20px; padding: 10px; background: ${formData.design?.primaryColor || '#3b82f6'}; color: white; border-radius: 5px;">
          Este es un ejemplo de cómo se verá tu sitio web
        </div>
      </div>
    `;
  }
  
  console.log('Vista previa actualizada');
}

/**
 * Maneja la descarga del ZIP optimizada
 */
async function handleDownloadZip() {
  console.log('Iniciando descarga del ZIP...');
  
  try {
    if (!appState.selectedTemplate) {
      showAppNotification('error', 'Error', 'Por favor, selecciona una plantilla primero');
      return;
    }
    
    showLoading(true);
    
    // Recopilar datos del formulario
    const formData = collectFormData();
    
    // Usar la función de generate.js
    if (typeof downloadWebsiteAsZip === 'function') {
      await downloadWebsiteAsZip(formData);
      showAppNotification('success', 'Descarga completada', 'Tu sitio web ha sido descargado exitosamente');
    } else {
      throw new Error('Función de descarga no disponible');
    }
    
  } catch (error) {
    console.error('Error al descargar ZIP:', error);
    showAppNotification('error', 'Error', 'No se pudo descargar el sitio web');
  } finally {
    showLoading(false);
  }
}

/**
 * Maneja la actualización de la vista previa optimizada
 */
function handleRefreshPreview() {
  console.log('Actualizando vista previa...');
  const formData = collectFormData();
  
  // Usar la función de generate.js si está disponible
  if (typeof updateLivePreview === 'function') {
    updateLivePreview(formData);
  } else {
    updatePreview(formData);
  }
  
  showAppNotification('success', 'Actualizado', 'Vista previa actualizada');
}

/**
 * Muestra una notificación optimizada
 */
function showAppNotification(type, title, message) {
  console.log(`Notificación [${type}]: ${title} - ${message}`);
  
  const container = document.getElementById('notificationContainer');
  if (!container) {
    console.error('Contenedor de notificaciones no encontrado');
    return;
  }
  
    const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  
    notification.innerHTML = `
    <div class="notification-header">
      <span class="notification-title">${title}</span>
      <button class="notification-close">&times;</button>
      </div>
    <div class="notification-message">${message}</div>
  `;
  
  container.appendChild(notification);
  
  // Auto-remover después de 5 segundos
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
    }, 5000);
    
  // Event listener para cerrar
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  });
}

/**
 * Muestra/oculta el overlay de carga optimizado
 */
function showLoading(show) {
  console.log('Mostrando/ocultando loading:', show);
  
  const overlay = document.getElementById('loadingOverlay');
  if (overlay) {
    if (show) {
      overlay.classList.remove('hidden');
    } else {
      overlay.classList.add('hidden');
    }
  } else {
    console.error('Overlay de loading no encontrado');
  }
}

/**
 * Configuración de esquemas de color optimizada
 */
function setupColorSchemes() {
  console.log('Configurando esquemas de color...');
  // Los esquemas se actualizan dinámicamente cuando se selecciona una plantilla
  // Esta función se mantiene para compatibilidad y futuras extensiones
}

/**
 * Muestra una notificación simple
 */
function showNotification(type, title, message) {
  console.log(`Notificación [${type}]: ${title} - ${message}`);
  
  // Crear una notificación simple si no hay contenedor
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px;
    border-radius: 5px;
    color: white;
    font-family: Arial, sans-serif;
    z-index: 10000;
    max-width: 300px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  `;
  
  // Estilos según el tipo
  if (type === 'error') {
    notification.style.backgroundColor = '#d32f2f';
  } else if (type === 'success') {
    notification.style.backgroundColor = '#388e3c';
  } else if (type === 'warning') {
    notification.style.backgroundColor = '#f57c00';
  } else {
    notification.style.backgroundColor = '#1976d2';
  }
  
  notification.innerHTML = `
    <div style="font-weight: bold; margin-bottom: 5px;">${title}</div>
    <div>${message}</div>
  `;
  
  document.body.appendChild(notification);
  
  // Auto-remover después de 5 segundos
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 5000);
}

/**
 * Actualiza los contadores de caracteres
 */
function updateCharacterCounters() {
  const descriptionInput = document.getElementById('businessDescription');
  const descriptionCounter = document.getElementById('descriptionCounter');
  
  if (descriptionInput && descriptionCounter) {
    const currentLength = descriptionInput.value.length;
    const maxLength = 300;
    descriptionCounter.textContent = currentLength;
    
    // Cambiar color si se excede el límite
    if (currentLength > maxLength) {
      descriptionCounter.style.color = '#d32f2f';
    } else {
      descriptionCounter.style.color = '#6b7280';
    }
  }
}

// Hacer las funciones disponibles globalmente
window.appState = appState;
window.templates = templates;
window.colorSchemes = colorSchemes;
window.showAppNotification = showAppNotification;
window.showLoading = showLoading;
window.collectFormData = collectFormData;

// Función de prueba simple
window.testEverything = function() {
  console.log('=== PRUEBA COMPLETA ===');
  console.log('1. Verificando configuraciones...');
  console.log('API Key:', !!window.GOOGLE_MAPS_CONFIG?.apiKey);
  console.log('Supabase:', !!window.SUPABASE_CONFIG?.functionUrl);
  
  console.log('2. Verificando funciones...');
  console.log('extractPlaceData:', typeof window.extractPlaceData);
  console.log('updateLivePreview:', typeof window.updateLivePreview);
  console.log('showNotification:', typeof showNotification);
  
  console.log('3. Verificando elementos...');
  console.log('googleMapsUrl:', !!document.getElementById('placeUrl'));
  console.log('businessName:', !!document.getElementById('businessName'));
  console.log('extractBtn:', !!document.getElementById('extractBtn'));
  
  console.log('4. Estado de la aplicación...');
  console.log('appState:', appState);
  
  console.log('=== PRUEBA COMPLETADA ===');
};

// Función de diagnóstico para verificar que todo funcione
window.diagnoseApp = function() {
  console.log('🔍 DIAGNÓSTICO DE LA APLICACIÓN');
  console.log('================================');
  
  // Verificar elementos críticos
  const criticalElements = [
    'placeUrl',
    'extractBtn',
    'extractedInfo',
    'previewFrame',
    'generateSiteBtn',
    'downloadZipBtn'
  ];
  
  console.log('📋 Verificando elementos críticos:');
  criticalElements.forEach(id => {
    const element = document.getElementById(id);
    console.log(`${element ? '✅' : '❌'} ${id}: ${element ? 'Encontrado' : 'NO ENCONTRADO'}`);
  });
  
  // Verificar funciones críticas
  const criticalFunctions = [
    'extractPlaceData',
    'updateLivePreview',
    'downloadWebsiteAsZip',
    'generateWebsite'
  ];
  
  console.log('🔧 Verificando funciones críticas:');
  criticalFunctions.forEach(funcName => {
    const func = window[funcName];
    console.log(`${func ? '✅' : '❌'} ${funcName}: ${func ? 'Disponible' : 'NO DISPONIBLE'}`);
  });
  
  // Verificar configuración
  console.log('⚙️ Verificando configuración:');
  console.log(`API Key configurada: ${window.GOOGLE_MAPS_CONFIG?.apiKey ? '✅ Sí' : '❌ No'}`);
  console.log(`Extractor disponible: ${typeof window.placesExtractor !== 'undefined' ? '✅ Sí' : '❌ No'}`);
  
  // Verificar estado de la aplicación
  console.log('📊 Estado de la aplicación:');
  console.log(`Pestaña actual: ${appState.currentTab}`);
  console.log(`Plantilla seleccionada: ${appState.selectedTemplate ? appState.selectedTemplate.name : 'Ninguna'}`);
  console.log(`Datos extraídos: ${appState.extractedData ? '✅ Sí' : '❌ No'}`);
  
  console.log('================================');
  console.log('🔍 DIAGNÓSTICO COMPLETADO');
};

// Función para probar la extracción
window.testExtraction = async function(url) {
  console.log('🧪 PROBANDO EXTRACCIÓN');
  console.log('URL:', url);
  
  try {
    const result = await window.extractPlaceData(url);
    console.log('✅ Extracción exitosa:', result);
    return result;
  } catch (error) {
    console.error('❌ Error en extracción:', error);
    throw error;
  }
};

// Función para probar la vista previa
window.testPreview = function() {
  console.log('🧪 PROBANDO VISTA PREVIA');
  
  const testData = {
    template: { id: 'restaurant', name: 'Restaurante' },
    business: {
      name: 'Restaurante de Prueba',
      type: 'restaurant',
      description: 'Un restaurante de prueba para verificar la funcionalidad'
    },
    contact: {
      address: 'Av. Test 123, Lima',
      phone: '+51 987 654 321',
      email: 'test@restaurant.com'
    },
    design: {
      primaryColor: '#d97706',
      secondaryColor: '#f59e0b'
    }
  };
  
  try {
    if (typeof window.updateLivePreview === 'function') {
      window.updateLivePreview(testData);
      console.log('✅ Vista previa actualizada');
    } else {
      console.error('❌ Función updateLivePreview no disponible');
    }
  } catch (error) {
    console.error('❌ Error en vista previa:', error);
  }
};

/**
 * Maneja la prueba de la API de Google Places
 */
async function handleTestAPI() {
  console.log('=== INICIANDO PRUEBA DE API ===');
  showNotification('info', 'Probando API', 'Realizando prueba de conexión a Google Maps API...');

  // Usar una Place ID conocida para la prueba (Ópera de Sídney)
  const testPlaceId = 'ChIJN1t_tDeuEmsRUsoyG83frY4'; 

  try {
    // Validar que la API Key esté configurada en CONFIG
    if (!window.CONFIG || !window.CONFIG.googleMaps || !window.CONFIG.googleMaps.apiKey || window.CONFIG.googleMaps.apiKey === 'TU_API_KEY_AQUI') {
      throw new Error('API Key de Google Maps no configurada. Por favor, revisa config.js');
    }

    // Validar que la función de extracción de Google Maps esté disponible
    if (typeof window.extractWithGoogleMaps !== 'function') {
      throw new Error('Función extractWithGoogleMaps no disponible. Asegúrate de que places.js esté cargado.');
    }

    // Realizar la prueba de extracción
    const testData = await window.extractWithGoogleMaps(testPlaceId);
    
    console.log('✅ Prueba de API exitosa:', testData);
    showNotification('success', 'Prueba de API Exitosa', 'Conexión a Google Maps API establecida. Datos de prueba obtenidos.');
    
    // Opcional: mostrar un resumen de los datos de prueba en el campo de texto
    document.getElementById('placeUrl').value = `Prueba exitosa para: ${testData.name || 'Lugar de Prueba'}`; 

  } catch (error) {
    console.error('❌ Error en llamada de prueba:', error);
    let errorMessage = error.message || 'Error desconocido';

    // Mensajes de error más amigables
    if (errorMessage.includes('API Key no configurada')) {
      errorMessage = 'API Key de Google Maps no configurada correctamente en config.js o en Google Cloud Console.';
    } else if (errorMessage.includes('REQUEST_DENIED')) {
      errorMessage = 'API Key de Google Maps denegada. Revisa restricciones de dominio, APIs habilitadas o facturación en Google Cloud Console.';
    } else if (errorMessage.includes('OVER_QUERY_LIMIT')) {
      errorMessage = 'Cuota de Google Maps API excedida. Por favor, espera o revisa tu uso en Google Cloud Console.';
    } else if (errorMessage.includes('Error al cargar script')) {
      errorMessage = 'No se pudo cargar el script de Google Places API. Verifica tu conexión a internet o el estado del servicio.';
    }

    showNotification('error', 'Error en Prueba de API', errorMessage);

  } finally {
    // Cualquier acción final, si es necesaria
    // showLoading(false);
  }
}

console.log('🔧 Funciones de diagnóstico disponibles:');
console.log('- diagnoseApp(): Diagnóstico completo de la aplicación');
console.log('- testExtraction(url): Probar extracción de datos');
console.log('- testPreview(): Probar vista previa'); 
