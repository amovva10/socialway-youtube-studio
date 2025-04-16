
// YouTube video upload edge function
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get request details
    const formData = await req.formData();
    const accessToken = formData.get('accessToken');
    const title = formData.get('title');
    const description = formData.get('description');
    const tags = formData.get('tags');
    const videoFile = formData.get('videoFile');
    const privacy = formData.get('privacy');

    console.log("Received upload request:", { 
      title,
      hasAccessToken: !!accessToken,
      hasVideoFile: !!videoFile,
      privacy
    });

    if (!accessToken) {
      throw new Error('No access token provided');
    }

    if (!videoFile || !(videoFile instanceof File)) {
      throw new Error('No video file provided');
    }

    // Step 1: Create the video resource with metadata
    const createVideoResponse = await fetch(
      'https://www.googleapis.com/youtube/v3/videos?part=snippet,status',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          snippet: {
            title: title || 'Untitled Video',
            description: description || '',
            tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
            categoryId: '22' // People & Blogs category
          },
          status: {
            privacyStatus: privacy || 'private',
            selfDeclaredMadeForKids: false
          }
        })
      }
    );

    if (!createVideoResponse.ok) {
      const errorData = await createVideoResponse.json();
      console.error('YouTube API error (create):', errorData);
      throw new Error(`YouTube API error: ${createVideoResponse.status}`);
    }

    const videoData = await createVideoResponse.json();
    const videoId = videoData.id;

    console.log(`Successfully created video with ID: ${videoId}`);

    // Step 2: Upload the video file
    const uploadResponse = await fetch(
      `https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status&videoId=${videoId}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': videoFile.type,
          'Content-Length': String(videoFile.size),
          'X-Upload-Content-Type': videoFile.type
        },
        body: await videoFile.arrayBuffer()
      }
    );

    if (!uploadResponse.ok) {
      const errorData = await uploadResponse.text();
      console.error('YouTube API error (upload):', errorData);
      throw new Error(`YouTube API upload error: ${uploadResponse.status}`);
    }

    // Return success response with video ID
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Video uploaded successfully', 
        videoId,
        videoUrl: `https://www.youtube.com/watch?v=${videoId}`
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
    
  } catch (error) {
    console.error('Error uploading video:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
