
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

    console.log('Received callback with code:', code ? 'present' : 'missing')
    console.log('State parameter:', state || 'missing')
    
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

    // Use verified client ID and secret - these must match what's configured in Google Cloud Console
    const clientId = "458582647832-g8r7pislak878j333hdl0uhei73hbqbq.apps.googleusercontent.com"
    const clientSecret = "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"
    
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

    console.log('Using client ID:', clientId)
    
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

    const channel = channelData.items?.[0]?.snippet?.title || 'Unknown'
    const channelId = channelData.items?.[0]?.id || 'Unknown'
    const thumbnailUrl = channelData.items?.[0]?.snippet?.thumbnails?.default?.url || ''

    console.log('Successfully retrieved channel info:', {
      channel,
      channelId,
      hasThumbnail: !!thumbnailUrl
    })

    // Redirect to the success page with channel information
    const redirectUrl = new URL('/youtube-connected', req.url)
    redirectUrl.searchParams.set('channel', channel)
    redirectUrl.searchParams.set('id', channelId)
    redirectUrl.searchParams.set('thumbnail', thumbnailUrl)

    return new Response(null, {
      status: 302,
      headers: {
        ...corsHeaders,
        'Location': redirectUrl.toString(),
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
