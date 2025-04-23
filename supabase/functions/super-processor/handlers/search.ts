
// Search handler
import { corsHeaders } from '../utils/cors.ts';

export async function handleSearch(query: string, YOUTUBE_API_KEY: string) {
  console.log(`Searching YouTube for: ${query}`);
  
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&maxResults=5&type=video&key=${YOUTUBE_API_KEY}`
  );
  
  if (!response.ok) {
    throw new Error(`YouTube API error: ${response.status}`);
  }
  
  const data = await response.json();
  
  const videos = data.items.map((item: any) => ({
    title: item.snippet.title,
    thumbnail: item.snippet.thumbnails.medium.url,
    videoId: item.id.videoId
  }));
  
  return { videos };
}
