
// Deno edge function to provide YouTube client ID
Deno.serve(async (req) => {
  // Define CORS headers for browser requests
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  }

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Get client ID from environment variables
    const clientId = Deno.env.get("CLIENT_ID")
    
    if (!clientId) {
      console.error('Missing CLIENT_ID environment variable')
      return new Response(
        JSON.stringify({ error: 'Server configuration error: Missing CLIENT_ID' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Return client ID to frontend
    return new Response(
      JSON.stringify({ clientId }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    console.error('Error providing client ID:', error.message)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }
})
