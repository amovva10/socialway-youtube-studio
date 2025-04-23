
// Channel insights handler
import { corsHeaders } from '../utils/cors.ts';
import { generatePersonalizedInsights } from '../utils/insights.ts';

export async function handleChannelInsights(accessToken: string) {
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
        const videoIds = videosInfo.items.map((item: any) => item.id.videoId).join(',');
        
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
    }
  }
  
  // Generate personalized insights based on the fetched data
  insightsData = generatePersonalizedInsights(channelData, videoStats);
  
  console.log("Generated insights:", insightsData ? insightsData.length : 0);
  
  return { insights: insightsData };
}
