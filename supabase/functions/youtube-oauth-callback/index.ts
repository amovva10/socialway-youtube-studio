
// Deno edge function to handle YouTube OAuth callback
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
    // Get query parameters from the request URL
    const url = new URL(req.url)
    const code = url.searchParams.get('code')
    const error = url.searchParams.get('error')
    const state = url.searchParams.get('state')
    const origin = req.headers.get('origin') || url.origin

    console.log('Received callback with code:', code ? 'present' : 'missing')
    console.log('State parameter:', state || 'missing')
    console.log('Origin:', origin)
    
    // Check if there's an error in the callback
    if (error) {
      console.error('Error from Google OAuth:', error)
      return new Response(
        JSON.stringify({ error: `Authentication failed: ${error}` }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // If no code was received, return an error
    if (!code) {
      console.error('No authorization code received')
      return new Response(
        JSON.stringify({ error: 'No authorization code received' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Get client ID and secret from environment variables
    const clientId = Deno.env.get("CLIENT_ID")
    const clientSecret = Deno.env.get("CLIENT_SECRET")
    
    if (!clientId || !clientSecret) {
      console.error('Missing OAuth credentials')
      return new Response(
        JSON.stringify({ error: 'Server configuration error: Missing OAuth credentials' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log('Using client ID from environment variable')
    
    // Use the exact same redirect URI that was used in the frontend
    const redirectUri = "https://fhoydbjcneodbgepfyho.supabase.co/functions/v1/youtube-oauth-callback"
    console.log('Using redirect URI:', redirectUri)

    // Create the token exchange request body
    const tokenRequestBody = new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }).toString()

    console.log('Token request prepared')

    // Exchange the authorization code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: tokenRequestBody,
    })

    const tokenData = await tokenResponse.json()
    console.log('Token exchange response status:', tokenResponse.status)

    // Check if the token exchange was successful
    if (!tokenResponse.ok) {
      console.error('Failed to exchange code for token. Response status:', tokenResponse.status)
      console.error('Error details:', JSON.stringify(tokenData))
      return new Response(
        JSON.stringify({ 
          error: 'Failed to retrieve access token', 
          details: tokenData 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Get user info from YouTube API
    const youtubeResponse = await fetch('https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    })

    const channelData = await youtubeResponse.json()
    console.log('YouTube API response status:', youtubeResponse.status)

    const channel = channelData.items?.[0]?.snippet?.title || 'Unknown'
    const channelId = channelData.items?.[0]?.id || 'Unknown'
    const thumbnailUrl = channelData.items?.[0]?.snippet?.thumbnails?.default?.url || ''

    console.log('Successfully retrieved channel info:', {
      channel,
      channelId,
      hasThumbnail: !!thumbnailUrl
    })

    // Determine the base URL for the redirect based on referer or other headers
    const referer = req.headers.get('referer')
    const host = req.headers.get('host')
    
    // Log headers for debugging
    console.log('Referer:', referer || 'not set')
    console.log('Host:', host || 'not set')
    
    // Extract the domain from the request URL
    let baseUrl = new URL(req.url).origin
    
    // If the URL contains localhost or a preview domain, use that
    if (referer) {
      try {
        const refererUrl = new URL(referer)
        baseUrl = refererUrl.origin
      } catch (e) {
        console.error('Could not parse referer URL:', e)
      }
    }
    
    console.log('Redirecting to:', baseUrl + '/youtube-connected')
    
    // Create an HTML page that will redirect to our app
    const redirectPage = `
      <html>
        <head>
          <title>Redirecting...</title>
          <meta http-equiv="refresh" content="0;url=${baseUrl}/youtube-connected?channel=${encodeURIComponent(channel)}&id=${encodeURIComponent(channelId)}&thumbnail=${encodeURIComponent(thumbnailUrl)}&access_token=${encodeURIComponent(tokenData.access_token)}">
        </head>
        <body>
          <h1>Authentication Successful</h1>
          <p>Redirecting you back to the application...</p>
          <script>
            window.location.href = "${baseUrl}/youtube-connected?channel=${encodeURIComponent(channel)}&id=${encodeURIComponent(channelId)}&thumbnail=${encodeURIComponent(thumbnailUrl)}&access_token=${encodeURIComponent(tokenData.access_token)}";
          </script>
        </body>
      </html>
    `

    return new Response(redirectPage, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/html',
      },
    })

  } catch (error) {
    console.error('Error in OAuth callback:', error.message)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
