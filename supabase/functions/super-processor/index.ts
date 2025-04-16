
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
    // Handle AI channel insights request
    if (action === 'channel-insights') {
      console.log(`Generating AI insights for channel with token available: ${!!accessToken}`);
      
      let channelData = null;
      let videoStats = null;
      let insightsData = null;
      
      // If we have an access token, fetch real channel data
      if (accessToken) {
        try {
          // Fetch channel details first
          const channelResponse = await fetch(
            'https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet,contentDetails&mine=true',
            {
              headers: {
                'Authorization': `Bearer ${accessToken}`
              }
            }
          );
          
          if (!channelResponse.ok) {
            console.error(`YouTube API error fetching channel: ${channelResponse.status}`);
            throw new Error(`YouTube API error: ${channelResponse.status}`);
          }
          
          const channelInfo = await channelResponse.json();
          
          if (!channelInfo.items || channelInfo.items.length === 0) {
            throw new Error('Channel not found');
          }
          
          channelData = channelInfo.items[0];
          console.log("Retrieved channel data:", channelData.id);
          
          // Fetch the channel's videos
          const videosResponse = await fetch(
            `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelData.id}&maxResults=10&order=date&type=video`,
            {
              headers: {
                'Authorization': `Bearer ${accessToken}`
              }
            }
          );
          
          if (!videosResponse.ok) {
            console.error(`YouTube API error fetching videos: ${videosResponse.status}`);
            throw new Error(`YouTube API error: ${videosResponse.status}`);
          }
          
          const videosInfo = await videosResponse.json();
          
          if (videosInfo.items && videosInfo.items.length > 0) {
            // Get video IDs
            const videoIds = videosInfo.items.map(item => item.id.videoId).join(',');
            
            // Fetch video statistics
            const videoStatsResponse = await fetch(
              `https://www.googleapis.com/youtube/v3/videos?part=statistics,contentDetails&id=${videoIds}`,
              {
                headers: {
                  'Authorization': `Bearer ${accessToken}`
                }
              }
            );
            
            if (videoStatsResponse.ok) {
              videoStats = await videoStatsResponse.json();
              console.log(`Retrieved stats for ${videoStats.items?.length || 0} videos`);
            }
          }
        } catch (error) {
          console.error("Error fetching YouTube data:", error);
          // Fall back to simulated data
          console.log("Falling back to simulated insights due to error");
        }
      }
      
      // Generate personalized insights based on the fetched data
      insightsData = generatePersonalizedInsights(channelData, videoStats);
      
      console.log("Generated insights:", insightsData ? insightsData.length : 0);
      
      return new Response(JSON.stringify({ insights: insightsData }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
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
      
      // Get channel statistics with real token
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
        
        console.log("Retrieved real channel stats:", stats);
        
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
        
        console.log("Returning real analytics:", analytics);
        
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

// Generate personalized insights based on channel data
function generatePersonalizedInsights(channelData, videoStats) {
  const insights = [
    {
      category: "Content Strategy",
      icon: "TrendingUp",
      items: []
    },
    {
      category: "Audience Growth",
      icon: "Users",
      items: []
    },
    {
      category: "Retention Optimization",
      icon: "Clock",
      items: []
    }
  ];
  
  // If we have real channel data
  if (channelData) {
    const stats = channelData.statistics;
    const details = channelData.snippet;
    const viewCount = parseInt(stats.viewCount || '0');
    const subscriberCount = parseInt(stats.subscriberCount || '0');
    const videoCount = parseInt(stats.videoCount || '0');
    
    // Content Strategy insights
    insights[0].items = [
      `Your channel has ${videoCount} videos with a total of ${viewCount.toLocaleString()} views. Consider posting more consistently to boost engagement.`,
      `Channel name "${details.title}" is ${details.title.length} characters long. Shorter, memorable names can help with brand recognition.`,
      `Your channel description is ${details.description ? details.description.length : 0} characters. Expand it with keywords to improve discoverability.`
    ];
    
    // Audience Growth insights
    insights[1].items = [
      `You currently have ${subscriberCount.toLocaleString()} subscribers. Creating a content series could help boost subscriber growth.`,
      `With an average of ${(viewCount / (videoCount || 1)).toFixed(0)} views per video, focus on cross-promoting your videos to increase watch time.`,
      `Adding end screens and cards to your videos can increase channel navigation and subscriber conversion.`
    ];
    
    // Analyze video stats if available
    if (videoStats && videoStats.items && videoStats.items.length > 0) {
      // Find the most engaging videos (highest like-to-view ratio)
      const analyzedVideos = videoStats.items.map(video => {
        const views = parseInt(video.statistics.viewCount || '0');
        const likes = parseInt(video.statistics.likeCount || '0');
        const comments = parseInt(video.statistics.commentCount || '0');
        const engagement = views > 0 ? (likes + comments) / views : 0;
        return { ...video, engagement };
      }).sort((a, b) => b.engagement - a.engagement);
      
      if (analyzedVideos.length > 0) {
        const topVideo = analyzedVideos[0];
        const topVideoViews = parseInt(topVideo.statistics.viewCount || '0');
        const topVideoLikes = parseInt(topVideo.statistics.likeCount || '0');
        const topVideoComments = parseInt(topVideo.statistics.commentCount || '0');
        
        // Add video-specific insights
        if (analyzedVideos.length >= 2) {
          insights[0].items.push(
            `Your most engaging video has a ${(topVideoLikes / topVideoViews * 100).toFixed(1)}% like ratio. Consider creating similar content.`
          );
        }
        
        if (analyzedVideos.length >= 3) {
          // Analyze video durations
          const durations = videoStats.items.map(video => {
            const duration = video.contentDetails?.duration || 'PT0S';
            const matches = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
            if (!matches) return 0;
            const hours = parseInt(matches[1] || '0');
            const minutes = parseInt(matches[2] || '0');
            const seconds = parseInt(matches[3] || '0');
            return hours * 3600 + minutes * 60 + seconds;
          });
          
          const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
          
          insights[2].items.push(
            `Your videos are averaging ${Math.floor(avgDuration / 60)} minutes in length. ${avgDuration > 600 ? 'Consider creating shorter, more focused content.' : 'This is a good length for engagement.'}`
          );
        }
      }
    }
    
    // Add more retention insights
    insights[2].items.push(
      `Adding timestamps to longer videos could improve retention by up to 18%.`,
      `Using a consistent intro that's less than 10 seconds can help establish your brand without losing viewer attention.`
    );
    
    // If the channel is very small, add more specific advice
    if (subscriberCount < 100) {
      insights[1].items.push(
        `For channels under 100 subscribers, focus on sharing your content on social media to gain initial traction.`
      );
    } else if (subscriberCount < 1000) {
      insights[1].items.push(
        `Channels with ${subscriberCount} subscribers should focus on a consistent upload schedule to build viewer habits.`
      );
    }
  } else {
    // Fallback insights if no channel data
    insights[0].items = [
      "Focus on creating content that answers specific questions in your niche to attract search traffic.",
      "Analyze your competition by looking at their most popular videos and identify content gaps you can fill.",
      "Create a content calendar to help maintain a consistent posting schedule (at least once a week recommended)."
    ];
    
    insights[1].items = [
      "Collaborate with other YouTubers in similar niches to tap into each other's audiences.",
      "Share your content on relevant social media platforms and communities where your target audience gathers.",
      "Respond to all comments on your videos within 24 hours to boost engagement and build community."
    ];
    
    insights[2].items = [
      "Keep your intro short (less than 10 seconds) to prevent viewers from clicking away.",
      "Use pattern interrupts every 60-90 seconds to maintain viewer attention (change scenes, graphics, etc).",
      "Create a strong call-to-action at the end of each video to encourage likes, comments and subscriptions."
    ];
  }
  
  return insights;
}
