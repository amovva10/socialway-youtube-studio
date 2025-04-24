
// Comments handler
import { corsHeaders } from '../utils/cors.ts';

export async function fetchComments(filter = 'all', accessToken: string | null = null) {
  console.log(`Fetching comments with filter: ${filter}, token present: ${accessToken ? 'yes' : 'no'}`);
  
  if (!accessToken) {
    // Return mock data if no access token is provided
    return {
      comments: generateMockComments(filter),
    };
  }
  
  // In a real implementation, we'd use the accessToken to fetch real comments
  // For now, we'll return mock data
  return {
    comments: generateMockComments(filter),
  };
}

function generateMockComments(filter = 'all') {
  const allComments = [
    {
      id: '1',
      videoId: 'abc123',
      authorDisplayName: 'Viewer One',
      authorProfileImageUrl: '',
      textDisplay: 'Love this content! Keep it up.',
      likeCount: 24,
      publishedAt: new Date(Date.now() - 86400000).toISOString(),
      status: 'published',
      videoTitle: 'How to Grow on YouTube in 2025',
      replied: false
    },
    {
      id: '2',
      videoId: 'def456',
      authorDisplayName: 'Viewer Two',
      authorProfileImageUrl: '',
      textDisplay: 'Could you do a tutorial on editing software?',
      likeCount: 8,
      publishedAt: new Date(Date.now() - 172800000).toISOString(),
      status: 'published',
      videoTitle: 'Camera Setup Tour 2025',
      replied: true
    },
    {
      id: '3',
      videoId: 'ghi789',
      authorDisplayName: 'Viewer Three',
      authorProfileImageUrl: '',
      textDisplay: 'The audio seems a bit low in this one.',
      likeCount: 3,
      publishedAt: new Date(Date.now() - 259200000).toISOString(),
      status: 'published',
      videoTitle: 'My YouTube Studio Tour',
      replied: false
    }
  ];

  if (filter === 'all') {
    return allComments;
  } else if (filter === 'replied') {
    return allComments.filter(comment => comment.replied);
  } else if (filter === 'pending') {
    return allComments.filter(comment => !comment.replied);
  }
  
  return allComments;
}
