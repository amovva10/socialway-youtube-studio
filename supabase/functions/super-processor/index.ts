
// Main entry point for the Super Processor Edge Function
import { corsHeaders } from './utils/cors.ts';
import { handleVideoInsights } from './handlers/video.ts';
import { handleSearchQuery } from './handlers/search.ts';
import { generateContentInsights } from './handlers/insights.ts';
import { handleCommunityAction } from './handlers/community.ts';
import { fetchAnalytics } from './handlers/analytics.ts';
import { fetchComments } from './handlers/comments.ts';

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  
  try {
    const { action, query, videoId, accessToken, filter, postType, postContent, postTitle, mediaUrls } = await req.json();
    
    console.log('Request data:', { action, query, videoId });
    
    if (action === 'video-insights' && videoId) {
      const YOUTUBE_API_KEY = Deno.env.get('YOUTUBE_API_KEY') || '';
      const insights = await handleVideoInsights(videoId, YOUTUBE_API_KEY);
      return new Response(JSON.stringify(insights), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } 
    
    else if (action === 'search' && query) {
      const YOUTUBE_API_KEY = Deno.env.get('YOUTUBE_API_KEY') || '';
      const searchResults = await handleSearchQuery(query, YOUTUBE_API_KEY);
      return new Response(JSON.stringify(searchResults), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    else if (action === 'generate-insights' && videoId) {
      const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY') || '';
      const YOUTUBE_API_KEY = Deno.env.get('YOUTUBE_API_KEY') || '';
      
      const insights = await generateContentInsights(videoId, YOUTUBE_API_KEY, OPENAI_API_KEY);
      return new Response(JSON.stringify(insights), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    else if (action === 'create-community-post') {
      const result = await handleCommunityAction('create', {
        type: postType,
        content: postContent,
        title: postTitle,
        mediaUrls: mediaUrls,
        accessToken
      });
      
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    else if (action === 'fetch-analytics') {
      const result = await fetchAnalytics(accessToken);
      
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    else if (action === 'fetch-comments') {
      const result = await fetchComments(filter, accessToken);
      
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    else {
      return new Response(
        JSON.stringify({ error: 'Missing query, videoId, or action parameter' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
