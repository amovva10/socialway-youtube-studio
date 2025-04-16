// Deno edge function to handle YouTube search and video insights
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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
    // Handle channel analytics request
    if (action === 'channel-analytics') {
      console.log(`Fetching channel analytics with access token, simulated: ${useSimulatedData}`);
      
      // If simulated data flag is true, return mock data
      if (useSimulatedData) {
        // Generate simulated data for testing the UI
        const getRandom = () => {
          const sign = Math.random() > 0.5 ? '+' : '';
          return `${sign}${(Math.random() * 20).toFixed(1)}%`;
        };
        
        const randomNumber = (min, max) => {
          return Math.floor(Math.random() * (max - min + 1) + min);
        };
        
        const simulatedData = {
          views: {
            value: randomNumber(10000, 100000).toLocaleString(),
            change: getRandom()
          },
          likes: {
            value: randomNumber(500, 5000).toLocaleString(),
            change: getRandom()
          },
          subscribers: {
            value: randomNumber(1000, 10000).toLocaleString(),
            change: getRandom()
          },
          watchTime: {
            value: `${randomNumber(100, 500)}hrs`,
            change: getRandom()
          }
        };
        
        console.log("Returning simulated analytics:", simulatedData);
        
        return new Response(JSON.stringify(simulatedData), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      // Get channel statistics with real token (for future implementation)
      if (!accessToken) {
        throw new Error('No access token provided');
      }
      
      try {
        const channelResponse = await fetch(
          'https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet&mine=true',
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          }
        );
        
        if (!channelResponse.ok) {
          console.error(`YouTube API error: ${channelResponse.status}`);
          throw new Error(`YouTube API error: ${channelResponse.status}`);
        }
        
        const channelData = await channelResponse.json();
        
        if (!channelData.items || channelData.items.length === 0) {
          throw new Error('Channel not found');
        }
        
        const channel = channelData.items[0];
        const stats = channel.statistics;
        
        // For comparison data, we'll simulate a percentage change
        const getRandom = () => {
          const sign = Math.random() > 0.5 ? '+' : '';
          return `${sign}${(Math.random() * 20).toFixed(1)}%`;
        };
        
        const analytics = {
          views: {
            value: parseInt(stats.viewCount).toLocaleString(),
            change: getRandom()
          },
          subscribers: {
            value: parseInt(stats.subscriberCount).toLocaleString(),
            change: getRandom()
          },
          likes: {
            value: parseInt(stats.videoCount).toLocaleString(), 
            change: getRandom()
          },
          watchTime: {
            value: `${Math.floor(parseInt(stats.viewCount) * 0.05 / 60)}hrs`,
            change: getRandom()
          }
        };
        
        console.log("Returning analytics:", analytics);
        
        return new Response(JSON.stringify(analytics), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      } catch (error) {
        console.error("Error fetching YouTube data:", error);
        throw error;
      }
    }
    
    // Handle video insights request
    if (videoId) {
      console.log(`Fetching insights for video: ${videoId}`);
      
      // Fetch video statistics
      const statsResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet&id=${videoId}&key=${YOUTUBE_API_KEY}`
      );
      
      if (!statsResponse.ok) {
        throw new Error(`YouTube API error: ${statsResponse.status}`);
      }
      
      const statsData = await statsResponse.json();
      
      if (!statsData.items || statsData.items.length === 0) {
        throw new Error('Video not found');
      }
      
      const videoStats = statsData.items[0].statistics;
      const videoSnippet = statsData.items[0].snippet;
      
      // Get video comments for sentiment analysis
      const commentsResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&maxResults=100&key=${YOUTUBE_API_KEY}`
      );
      
      let commentsData = { items: [] };
      let demographics = '';
      let trend = 'stable';
      
      if (commentsResponse.ok) {
        commentsData = await commentsResponse.json();
        
        // Simple trend analysis based on comment sentiment
        const commentCount = commentsData.items.length;
        const positiveComments = commentsData.items.filter(comment => {
          const text = comment.snippet.topLevelComment.snippet.textDisplay.toLowerCase();
          return text.includes('great') || text.includes('good') || text.includes('love') || 
                 text.includes('amazing') || text.includes('awesome') || text.includes('like');
        }).length;
        
        const positiveRatio = positiveComments / (commentCount || 1);
        
        if (positiveRatio > 0.7) {
          trend = 'up';
        } else if (positiveRatio < 0.3) {
          trend = 'down';
        }
        
        // Simplified demographics estimation based on publish date and view count
        const viewCount = parseInt(videoStats.viewCount || '0');
        
        if (viewCount > 5000000) {
          demographics = 'Global (45%), United States (20%), Europe (15%), Asia (12%)';
        } else if (viewCount > 1000000) {
          demographics = 'United States (35%), UK (18%), Canada (12%), Global (25%)';
        } else if (viewCount > 100000) {
          demographics = 'United States (40%), UK (15%), Canada (10%), Australia (8%)';
        } else {
          demographics = 'United States (30%), Niche audience (70%)';
        }
      } else {
        demographics = 'Data unavailable';
      }
      
      // Calculate engagement rate
      const views = parseInt(videoStats.viewCount || '0');
      const likes = parseInt(videoStats.likeCount || '0');
      const comments = parseInt(videoStats.commentCount || '0');
      const engagementRate = views > 0 ? ((likes + comments) / views * 100).toFixed(2) + '%' : '0%';
      
      const insights = {
        views,
        comments,
        likes,
        demographics,
        trend,
        publishDate: new Date(videoSnippet.publishedAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }),
        engagementRate,
        title: videoSnippet.title
      };
      
      console.log("Returning insights:", insights);
      
      return new Response(JSON.stringify(insights), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // Handle search request
    if (query) {
      console.log(`Searching YouTube for: ${query}`);
      
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&maxResults=5&type=video&key=${YOUTUBE_API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`YouTube API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      const videos = data.items.map((item) => ({
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.medium.url,
        videoId: item.id.videoId
      }));
      
      return new Response(JSON.stringify({ videos }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify({ error: 'Missing query, videoId, or action parameter' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
