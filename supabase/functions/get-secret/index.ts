
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { secretName } = await req.json()
    
    // Fetch the requested secret
    const secret = Deno.env.get(secretName)
    if (!secret) {
      throw new Error(`Secret ${secretName} not found`)
    }

    // Return the secret with CORS headers
    return new Response(
      JSON.stringify({ [secretName]: secret }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  }
})
