
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

    // Get the app_origin parameter from the URL and use it exactly as provided
    const appOrigin = url.searchParams.get('app_origin') || origin
    
    console.log('Detected app origin:', appOrigin)
    
    // Instead of redirecting, return a page with HTML that will handle the redirect client-side
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>YouTube Connection Successful</title>
          <meta charset="utf-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 500px;
              margin: 0 auto;
              padding: 20px;
              text-align: center;
            }
            h1 { color: #4285f4; }
            .card {
              background: white;
              border-radius: 8px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
              padding: 20px;
              margin-top: 20px;
            }
            .success-icon {
              color: #34a853;
              font-size: 48px;
              margin-bottom: 16px;
            }
            .redirect-message {
              color: #666;
              font-size: 14px;
              margin-top: 16px;
            }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="success-icon">✓</div>
            <h1>Connection Successful</h1>
            <p>Your YouTube channel "${channel}" has been connected successfully.</p>
            <p class="redirect-message">Redirecting you back to the application...</p>
          </div>
          
          <script>
            // The parameters to pass back to the application
            const params = {
              channel: "${channel}",
              id: "${channelId}",
              thumbnail: "${thumbnailUrl}",
              access_token: "${tokenData.access_token}"
            };
            
            // Build the redirect URL with parameters
            const redirectURL = new URL("/youtube-connected", "${appOrigin}");
            Object.keys(params).forEach(key => {
              redirectURL.searchParams.append(key, params[key]);
            });
            
            // Log the redirect URL (for debugging)
            console.log("Redirecting to:", redirectURL.toString());
            
            // Redirect after a short delay (to show the success message)
            setTimeout(() => {
              window.location.href = redirectURL.toString();
            }, 1500);
          </script>
        </body>
      </html>
    `;
    
    return new Response(html, {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/html'
      }
    });

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
