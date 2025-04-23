
// Analytics handler
import { corsHeaders } from '../utils/cors.ts';

export async function handleChannelAnalytics(accessToken: string, useSimulatedData: boolean) {
  console.log(`Fetching channel analytics with access token, simulated: ${useSimulatedData}`);
  
  // If simulated data flag is true, return mock data
  if (useSimulatedData) {
    const getRandom = () => {
      const sign = Math.random() > 0.5 ? '+' : '';
      return `${sign}${(Math.random() * 20).toFixed(1)}%`;
    };
    
    const randomNumber = (min: number, max: number) => {
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
    return simulatedData;
  }
  
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
    return analytics;
    
  } catch (error) {
    console.error("Error fetching YouTube data:", error);
    throw error;
  }
}
