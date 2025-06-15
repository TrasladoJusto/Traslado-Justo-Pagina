// Función de Supabase para extraer datos de Google Places
// Este código debe ser subido a Supabase Functions

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Max-Age': '86400'
}

serve(async (req) => {
  // Manejar CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { 
      headers: corsHeaders,
      status: 200
    })
  }

  try {
    // Verificar que sea POST
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Método no permitido. Use POST.' }),
        { 
          status: 405,
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json'
          } 
        }
      )
    }

    const { action, place_id, fields, photo_reference } = await req.json()

    // API Key de Google Maps (hardcodeada para evitar problemas de variables de entorno)
    const GOOGLE_API_KEY = 'AIzaSyC8YZvA_1E8cFLFixMsxxdbg73bDBIq4Ak'

    if (action === 'get_place_details') {
      // Extraer datos de un lugar
      const apiUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(place_id)}&fields=${fields || 'name,formatted_address,formatted_phone_number,website,rating,user_ratings_total,opening_hours,reviews,types,geometry,photos'}&key=${GOOGLE_API_KEY}`
      
      console.log('Llamando a Google Places API:', apiUrl)
      
      const response = await fetch(apiUrl)
      const data = await response.json()
      
      return new Response(
        JSON.stringify(data),
        { 
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json'
          } 
        }
      )
    }
    
    else if (action === 'get_photo') {
      // Obtener foto de un lugar
      if (!photo_reference) {
        throw new Error('photo_reference es requerido')
      }
      
      const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${encodeURIComponent(photo_reference)}&key=${GOOGLE_API_KEY}`
      
      const response = await fetch(photoUrl)
      const imageBlob = await response.blob()
      
      return new Response(
        imageBlob,
        { 
          headers: { 
            ...corsHeaders,
            'Content-Type': response.headers.get('content-type') || 'image/jpeg'
          } 
        }
      )
    }
    
    else {
      throw new Error('Acción no válida. Use "get_place_details" o "get_photo"')
    }

  } catch (error) {
    console.error('Error en función Supabase:', error)
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        status: 'ERROR'
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    )
  }
}) 