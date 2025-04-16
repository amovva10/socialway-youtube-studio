
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

    // Upload the video using the resumable upload protocol
    
    // Step 1: Initiate the resumable upload session
    const initResponse = await fetch(
      'https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'X-Upload-Content-Type': videoFile.type,
          'X-Upload-Content-Length': String(videoFile.size)
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

    if (!initResponse.ok) {
      const errorText = await initResponse.text();
      console.error('YouTube API error (init):', errorText);
      throw new Error(`YouTube API init error: ${initResponse.status}`);
    }

    // Get the upload URL from the Location header
    const uploadUrl = initResponse.headers.get('Location');
    if (!uploadUrl) {
      throw new Error('No upload URL returned from YouTube API');
    }

    console.log('Upload URL obtained:', uploadUrl);

    // Step 2: Upload the video content to the session URL
    const uploadResponse = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': videoFile.type,
        'Content-Length': String(videoFile.size)
      },
      body: await videoFile.arrayBuffer()
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error('YouTube API error (upload):', errorText);
      throw new Error(`YouTube API upload error: ${uploadResponse.status}`);
    }

    // Get the video ID from the upload response
    let videoId = '';
    let videoData;
    
    try {
      videoData = await uploadResponse.json();
      videoId = videoData.id;
    } catch (e) {
      // If the response is not JSON or doesn't have an ID, try to get it from the response
      if (uploadResponse.status === 200) {
        // Try to fetch the video details to get the ID
        const videoInfoResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=id&mine=true&maxResults=1`,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          }
        );
        
        if (videoInfoResponse.ok) {
          const videoList = await videoInfoResponse.json();
          if (videoList.items && videoList.items.length > 0) {
            videoId = videoList.items[0].id;
          }
        }
      }
    }

    if (!videoId) {
      console.log('Upload was successful but could not determine video ID');
      // Return success even without ID
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Video uploaded successfully, but could not determine video ID',
        }),
        { 
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
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
