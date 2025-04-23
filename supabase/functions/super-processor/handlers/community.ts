
import { corsHeaders } from '../utils/cors.ts';

export async function handleCommunityPosts(accessToken: string | null, category?: string) {
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
      const YOUTUBE_API_KEY = Deno.env.get('YOUTUBE_API');
      
      if (!YOUTUBE_API_KEY) {
        console.error("YouTube API key not found in environment variables");
        throw new Error("YouTube API key not configured");
      }
      
      // Add category to the API query if specified
      const categoryParam = category ? `&videoCategoryId=${getCategoryId(category)}` : '';
      console.log(`Using category param: ${categoryParam}`);
      
      const trendingResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&chart=mostPopular${categoryParam}&maxResults=5&key=${YOUTUBE_API_KEY}`
      );

      if (!trendingResponse.ok) {
        throw new Error(`YouTube API error: ${trendingResponse.status}`);
      }

      const trendingData = await trendingResponse.json();
      console.log("YouTube category IDs in response:", trendingData.items.map((item: any) => item.snippet.categoryId));
      
      const trendingPosts = trendingData.items.map((item: any) => ({
        title: "Trending on YouTube",
        contentHtml: item.snippet.description,
        authorDisplayName: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt,
        likeCount: parseInt(item.statistics.likeCount) || 0,
        replyCount: parseInt(item.statistics.commentCount) || 0,
        thumbnail: item.snippet.thumbnails.medium.url,
        category: getCategoryName(item.snippet.categoryId)
      }));

      return { posts: trendingPosts };
    }
    
  } catch (error) {
    console.error("Error fetching community posts:", error);
    return { posts: [], error: error.message };
  }
}

// Helper function to map category names to YouTube category IDs
function getCategoryId(category: string): string {
  const categoryMap: Record<string, string> = {
    'business': '22',    // People & Blogs (for business content)
    'education': '27',   // Education
    'entertainment': '24', // Entertainment
    'gaming': '20',      // Gaming (proper category for gaming)
  };
  return categoryMap[category] || '';
}

// Helper function to map YouTube category IDs back to our category names
function getCategoryName(categoryId: string): string {
  const categoryMap: Record<string, string> = {
    '20': 'Gaming',      // Gaming (was incorrectly mapped to Business)
    '22': 'Business',    // People & Blogs (for business content)
    '27': 'Education',   // Education
    '24': 'Entertainment', // Entertainment
    '17': 'Sports',      // Adding Sports category
    '10': 'Music',       // Adding Music category
    '25': 'News',        // Adding News category
    '28': 'Science',     // Adding Science & Technology category
  };
  return categoryMap[categoryId] || 'Other';
}
