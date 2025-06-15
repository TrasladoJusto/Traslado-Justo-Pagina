/**
 * config.js - Configuración de la aplicación WebCreator Pro
 * Contiene URLs de APIs, configuraciones de Supabase y otras configuraciones globales
 */

// Configuración global
const CONFIG = {
    // Configuración de Supabase (Primera opción)
    supabase: {
        url: 'https://pyeqjvfxvjsjwetzosri.supabase.co',
        key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5ZXFqdmZ4dmpzandldHpvc3JpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2NTQ5MDQsImV4cCI6MjA2NDIzMDkwNH0.0xiEZiYzWmx9meH8KMDYKQ9ble7NDjQg7ei6VX4lVdQ',
        functionUrl: 'https://pyeqjvfxvjsjwetzosri.supabase.co/functions/v1/google-places-api'
    },
    
    // Configuración de Google Maps (Segunda opción)
    googleMaps: {
        apiKey: 'AIzaSyANkxE6o84dq1YHjYV1Ytl1xRlA2kNStSQ',
        libraries: ['places'],
        language: 'es',
        region: 'ES'
    },
    
    // Configuración de la aplicación
    app: {
        debug: false,
        useSupabase: true, // Priorizar Supabase
        fallbackToGoogle: true, // Permitir fallback a Google
        name: 'WebCreator Pro',
        version: '1.0.0',
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

// Verificar configuración al cargar
function verifyConfig() {
    if (CONFIG.app.useSupabase) {
        if (!CONFIG.supabase.url || !CONFIG.supabase.key) {
            console.warn('⚠️ Configuración de Supabase incompleta');
            if (CONFIG.app.fallbackToGoogle) {
                console.info('ℹ️ Usando Google Maps como respaldo');
            }
        } else {
            console.info('✅ Configuración de Supabase lista');
        }
    }
    
    if (CONFIG.app.fallbackToGoogle && CONFIG.googleMaps.apiKey) {
        console.info('✅ API Key de Google Maps configurada como respaldo');
    }
}

// Hacer la configuración disponible globalmente
window.CONFIG = CONFIG;

// Verificar al cargar
document.addEventListener('DOMContentLoaded', verifyConfig); 
