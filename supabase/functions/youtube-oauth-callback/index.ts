
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

// Define CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Deno edge function to handle YouTube OAuth callback
Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Get query parameters from the request URL
    const url = new URL(req.url)
    const code = url.searchParams.get('code')
    const error = url.searchParams.get('error')

    console.log('Received callback with code:', code ? 'present' : 'missing')
    
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

    // Get the client ID and client secret from environment variables
    const clientId = Deno.env.get('CLIENT_ID')
    const clientSecret = Deno.env.get('CLIENT_SECRET')
    
    if (!clientId || !clientSecret) {
      console.error('Missing OAuth credentials')
      console.error('Client ID present:', !!clientId)
      console.error('Client Secret present:', !!clientSecret)
      return new Response(
        JSON.stringify({ error: 'Server configuration error: Missing OAuth credentials' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log('Using client ID:', clientId.substring(0, 5) + '...')
    console.log('Client secret is defined:', !!clientSecret)
    
    const redirectUri = 'https://fhoydbjcneodbgepfyho.supabase.co/functions/v1/youtube-oauth-callback'
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

    // Now we have successfully authenticated with YouTube
    // Return success page with appropriate HTML
    const htmlResponse = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>YouTube Connected</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              height: 100vh;
              margin: 0;
              background-color: #f9fafb;
              color: #111827;
            }
            .container {
              text-align: center;
              padding: 2rem;
              max-width: 28rem;
              background-color: white;
              border-radius: 0.5rem;
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            }
            h1 {
              color: #4f46e5;
              font-size: 1.5rem;
              margin-bottom: 1rem;
            }
            p {
              margin-bottom: 1.5rem;
              color: #4b5563;
            }
            button {
              background-color: #4f46e5;
              color: white;
              font-weight: 500;
              padding: 0.625rem 1.25rem;
              border-radius: 0.375rem;
              border: none;
              cursor: pointer;
              transition: background-color 0.2s;
            }
            button:hover {
              background-color: #4338ca;
            }
          </style>
          <script>
            function closeWindow() {
              window.close();
            }
          </script>
        </head>
        <body>
          <div class="container">
            <h1>YouTube Channel Connected!</h1>
            <p>You have successfully connected your YouTube channel. You can now close this window and return to the application.</p>
            <button onclick="closeWindow()">Close Window</button>
          </div>
        </body>
      </html>
    `

    // Store the token data in the database or session for later use
    // This part depends on your application's architecture

    return new Response(htmlResponse, {
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
