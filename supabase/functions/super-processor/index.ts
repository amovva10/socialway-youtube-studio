
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from './utils/cors.ts';
import { handleCommunityPosts } from './handlers/community.ts';
import { handleChannelAnalytics } from './handlers/analytics.ts';
import { handleChannelInsights } from './handlers/insights.ts';
import { handleSearch } from './handlers/search.ts';
import { handleVideoInsights } from './handlers/video.ts';

const YOUTUBE_API_KEY = Deno.env.get('YOUTUBE_API');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Parse the request body
  const requestData = await req.json();
  const { query, videoId, accessToken, action, useSimulatedData } = requestData;

  console.log("Request data:", requestData);

  try {
    switch (action) {
      case 'channel-insights':
        return new Response(
          JSON.stringify(await handleChannelInsights(accessToken)),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      case 'channel-analytics':
        return new Response(
          JSON.stringify(await handleChannelAnalytics(accessToken, useSimulatedData)),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      case 'fetch-community-posts':
        return new Response(
          JSON.stringify(await handleCommunityPosts(accessToken)),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

    if (videoId) {
      return new Response(
        JSON.stringify(await handleVideoInsights(videoId, YOUTUBE_API_KEY!)),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (query) {
      return new Response(
        JSON.stringify(await handleSearch(query, YOUTUBE_API_KEY!)),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Missing query, videoId, or action parameter' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
