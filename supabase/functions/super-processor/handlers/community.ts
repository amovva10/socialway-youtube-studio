
import { corsHeaders } from '../utils/cors.ts';

export async function handleCommunityPosts(accessToken: string | null) {
  try {
    if (accessToken) {
      // Get authenticated user's channel posts
      const channelResponse = await fetch(
        'https://www.googleapis.com/youtube/v3/channels?part=contentDetails&mine=true',
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

      // For now return simulated community posts until the Community Posts API is available
      const simulatedPosts = [
        {
          title: "New Video Coming Soon!",
          contentHtml: "Hey everyone! 🎉 Working on something special for next week. Can't wait to share it with you all!",
          authorDisplayName: "Your Channel",
          publishedAt: new Date().toISOString(),
          likeCount: 156,
          replyCount: 23
        },
        {
          title: "Community Update",
          contentHtml: "What kind of content would you like to see more of? Let me know in the comments! 🤔",
          authorDisplayName: "Your Channel",
          publishedAt: new Date(Date.now() - 86400000).toISOString(),
          likeCount: 342,
          replyCount: 89
        }
      ];
      
      return { posts: simulatedPosts };
    } else {
      // Get trending YouTube creators and their recent community engagement
      const YOUTUBE_API_KEY = Deno.env.get('YOUTUBE_API');
      
      // Get trending gaming channels as an example
      const trendingResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&chart=mostPopular&maxResults=5&key=${YOUTUBE_API_KEY}`
      );

      if (!trendingResponse.ok) {
        throw new Error(`YouTube API error: ${trendingResponse.status}`);
      }

      const trendingData = await trendingResponse.json();
      
      // Transform the data into our post format
      const trendingPosts = trendingData.items.map((item: any) => ({
        title: "Trending on YouTube",
        contentHtml: item.snippet.description,
        authorDisplayName: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt,
        likeCount: parseInt(item.statistics.likeCount) || 0,
        replyCount: parseInt(item.statistics.commentCount) || 0,
        thumbnail: item.snippet.thumbnails.medium.url
      }));

      return { posts: trendingPosts };
    }
    
  } catch (error) {
    console.error("Error fetching community posts:", error);
    throw error;
  }
}
