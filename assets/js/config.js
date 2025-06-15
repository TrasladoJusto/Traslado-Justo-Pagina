/**
 * config.js - Configuración de la aplicación WebCreator Pro
 * Contiene URLs de APIs, configuraciones de Supabase y otras configuraciones globales
 */

// Configuración global
window.CONFIG = {
    supabase: {
        url: 'https://pyeqjvfxvjsjwetzosri.supabase.co',
        key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5ZXFqdmZ4dmpzandldHpvc3JpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2NTQ5MDQsImV4cCI6MjA2NDIzMDkwNH0.0xiEZiYzWmx9meH8KMDYKQ9ble7NDjQg7ei6VX4lVdQ',
        functionUrl: 'https://pyeqjvfxvjsjwetzosri.supabase.co/functions/v1/google-places-api'
    },
    googleMaps: {
        apiKey: 'AIzaSyANkxE6o84dq1YHjYV1Ytl1xRlA2kNStSQ',
        libraries: ['places'],
        language: 'es',
        region: 'ES'
    },
    app: {
        debug: false,
        useSupabase: true,
        fallbackToGoogle: true,
        name: 'WebCreator Pro',
        version: '1.0.0',
        defaultTemplate: 'restaurant',
        maxFileSize: 5242880,
        supportedImageTypes: ['image/jpeg', 'image/png', 'image/webp'],
        maxImages: 10
    },
    TEMPLATES: {
        defaultColors: {
            primary: '#d97706',
            secondary: '#f59e0b',
            accent: '#fbbf24'
        }
    }
};

// Verificar configuración
(function() {
    console.log('Verificando configuración...');
    
    if (window.CONFIG.app.useSupabase && window.CONFIG.supabase.url && window.CONFIG.supabase.key) {
        console.log('✅ Supabase configurado');
    }
    
    if (window.CONFIG.app.fallbackToGoogle && window.CONFIG.googleMaps.apiKey) {
        console.log('✅ Google Maps configurado');
    }
})(); 
