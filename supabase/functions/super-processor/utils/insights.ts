
// Insights generation utility
export function generatePersonalizedInsights(channelData: any, videoStats: any) {
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
      const analyzedVideos = videoStats.items.map((video: any) => {
        const views = parseInt(video.statistics.viewCount || '0');
        const likes = parseInt(video.statistics.likeCount || '0');
        const comments = parseInt(video.statistics.commentCount || '0');
        const engagement = views > 0 ? (likes + comments) / views : 0;
        return { ...video, engagement };
      }).sort((a: any, b: any) => b.engagement - a.engagement);
      
      if (analyzedVideos.length > 0) {
        const topVideo = analyzedVideos[0];
        const topVideoViews = parseInt(topVideo.statistics.viewCount || '0');
        const topVideoLikes = parseInt(topVideo.statistics.likeCount || '0');
        
        if (analyzedVideos.length >= 2) {
          insights[0].items.push(
            `Your most engaging video has a ${(topVideoLikes / topVideoViews * 100).toFixed(1)}% like ratio. Consider creating similar content.`
          );
        }
        
        if (analyzedVideos.length >= 3) {
          // Analyze video durations
          const durations = videoStats.items.map((video: any) => {
            const duration = video.contentDetails?.duration || 'PT0S';
            const matches = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
            if (!matches) return 0;
            const hours = parseInt(matches[1] || '0');
            const minutes = parseInt(matches[2] || '0');
            const seconds = parseInt(matches[3] || '0');
            return hours * 3600 + minutes * 60 + seconds;
          });
          
          const avgDuration = durations.reduce((a: number, b: number) => a + b, 0) / durations.length;
          
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
