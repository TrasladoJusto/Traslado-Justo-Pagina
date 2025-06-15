/**
 * config.js - Configuración de la aplicación WebCreator Pro
 * Contiene URLs de APIs, configuraciones de Supabase y otras configuraciones globales
 */

// Configuración global de la aplicación
const CONFIG = {
    // Configuración de Google Maps
    GOOGLE_MAPS: {
        apiKey: 'AIzaSyANkxE6o84dq1YHjYV1Ytl1xRlA2kNStSQ',
        libraries: ['places'],
        language: 'es',
        region: 'PE'
    },

    // Configuración de Supabase (fallback)
    SUPABASE: {
        url: 'https://tu-proyecto.supabase.co',
        key: 'tu-api-key-supabase',
        functionUrl: 'https://tu-proyecto.supabase.co/functions/v1/extract-place-data'
    },

    // Configuración de la aplicación
    APP: {
        name: 'WebCreator Pro',
        version: '1.0.0',
        debug: false,
        defaultTemplate: 'restaurant',
        maxFileSize: 5 * 1024 * 1024, // 5MB
        supportedImageTypes: ['image/jpeg', 'image/png', 'image/webp'],
        maxImages: 10
    },

    // Configuración de templates
    TEMPLATES: {
        defaultColors: {
            primary: '#d97706',
            secondary: '#f59e0b',
            accent: '#fbbf24'
        }
    }
};

// Hacer la configuración disponible globalmente
window.CONFIG = CONFIG;
window.GOOGLE_MAPS_CONFIG = CONFIG.GOOGLE_MAPS;
window.SUPABASE_CONFIG = CONFIG.SUPABASE;

// Función para verificar la configuración
function verifyConfig() {
    console.log('🔧 Verificando configuración...');
    
    // Verificar Google Maps
    const googleMapsConfig = window.GOOGLE_MAPS_CONFIG;
    if (!googleMapsConfig?.apiKey || googleMapsConfig.apiKey === 'TU_API_KEY_AQUI') {
        console.error('❌ API Key de Google Maps no configurada');
        return false;
    }
    
    // Verificar Supabase (opcional)
    const supabaseConfig = window.SUPABASE_CONFIG;
    if (!supabaseConfig?.url || !supabaseConfig?.key) {
        console.warn('⚠️ Configuración de Supabase incompleta - Se usará Google Maps API directamente');
    }
    
    console.log('✅ Configuración verificada correctamente');
    return true;
}

// Verificar configuración al cargar
document.addEventListener('DOMContentLoaded', verifyConfig);

// Exportar configuración
export default CONFIG; 