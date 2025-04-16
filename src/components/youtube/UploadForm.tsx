
import { useState, useEffect } from 'react';
import { Upload, AlertTriangle, ExternalLink } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ConnectButton } from './ConnectButton';
import { supabase } from "@/integrations/supabase/client";

export const UploadForm = () => {
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [accessToken, setAccessToken] = useState('');
  const [uploadedVideoId, setUploadedVideoId] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: '',
    privacy: 'public'
  });

  useEffect(() => {
    // Check if YouTube channel is connected
    const channelInfo = JSON.parse(localStorage.getItem('youtubeChannel') || '{}');
    if (channelInfo.connected) {
      setIsConnected(true);
      if (channelInfo.accessToken) {
        setAccessToken(channelInfo.accessToken);
        console.log('Found access token for uploads');
      }
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!videoFile) {
      toast({
        title: "No Video Selected",
        description: "Please select a video file to upload",
        variant: "destructive"
      });
      return;
    }

    if (!accessToken) {
      toast({
        title: "Authentication Error",
        description: "No access token found. Please reconnect your YouTube account.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    setUploadProgress(10); // Start progress
    
    try {
      // Create form data for the upload
      const form = new FormData();
      form.append('videoFile', videoFile);
      form.append('title', formData.title);
      form.append('description', formData.description);
      form.append('tags', formData.tags);
      form.append('privacy', formData.privacy);
      form.append('accessToken', accessToken);
      
      // Update progress to show we're starting the upload
      setUploadProgress(25);
      
      console.log('Starting YouTube upload...');
      const { data, error } = await supabase.functions.invoke('youtube-upload', {
        body: form,
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (!data.success) {
        throw new Error(data.error || 'Upload failed');
      }
      
      setUploadProgress(100);
      setUploadedVideoId(data.videoId);
      
      toast({
        title: "Upload Successful",
        description: `Your video "${formData.title}" has been uploaded to YouTube`,
      });
      
      // Reset form after successful upload
      setFormData({
        title: '',
        description: '',
        tags: '',
        privacy: 'public'
      });
      setVideoFile(null);
      
      // Reset file input
      const fileInput = document.getElementById('video-file') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
    } catch (error) {
      console.error("Error uploading video:", error);
      toast({
        title: "Upload Failed",
        description: error.message || "There was an error uploading your video. Please try again.",
        variant: "destructive"
      });
      setUploadProgress(0);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex flex-col items-center justify-center py-10 space-y-6">
          <div className="text-center max-w-md space-y-3">
            <h3 className="text-xl font-semibold text-gray-800">Connect Your YouTube Channel</h3>
            <p className="text-gray-600">
              You need to connect your YouTube channel before you can upload videos.
            </p>
          </div>
          <ConnectButton />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h2 className="text-xl font-semibold mb-6">Upload New Video</h2>
      
      {uploadedVideoId && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 bg-green-100 p-1 rounded-full">
              <Upload className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-medium text-green-800">Video Successfully Uploaded!</h3>
              <p className="text-green-700 text-sm mt-1">
                Your video has been uploaded to YouTube with ID: {uploadedVideoId}
              </p>
              <a 
                href={`https://www.youtube.com/watch?v=${uploadedVideoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm text-green-700 hover:text-green-800 mt-2"
              >
                View on YouTube <ExternalLink className="ml-1 h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      )}
      
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="video-file">
            Select Video File
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            {videoFile ? (
              <div className="space-y-2">
                <p className="text-green-600 font-medium">File selected: {videoFile.name}</p>
                <p className="text-gray-500 text-sm">
                  {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setVideoFile(null)}
                >
                  Select Different File
                </Button>
              </div>
            ) : (
              <>
                <input
                  id="video-file"
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <label
                  htmlFor="video-file"
                  className="cursor-pointer block space-y-2"
                >
                  <div className="mx-auto w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                    <Upload className="text-blue-500" />
                  </div>
                  <p className="text-gray-700">
                    <span className="text-blue-500 font-medium">Click to select</span> or drag and drop
                  </p>
                  <p className="text-gray-500 text-sm">
                    MP4, MOV, AVI up to 2GB
                  </p>
                </label>
              </>
            )}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="title">
            Video Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all"
            placeholder="Enter video title..."
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all"
            placeholder="Enter video description..."
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="tags">
            Tags (comma-separated)
          </label>
          <input
            id="tags"
            name="tags"
            type="text"
            value={formData.tags}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all"
            placeholder="gaming, tutorial, vlog..."
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="privacy">
            Privacy Setting
          </label>
          <select
            id="privacy"
            name="privacy"
            value={formData.privacy}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all"
          >
            <option value="public">Public</option>
            <option value="unlisted">Unlisted</option>
            <option value="private">Private</option>
          </select>
        </div>
        
        {isSubmitting && uploadProgress > 0 && (
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
              style={{ width: `${uploadProgress}%` }}
            ></div>
            <p className="text-sm text-gray-500 mt-1 text-right">{uploadProgress}% Complete</p>
          </div>
        )}
        
        <Button
          type="submit"
          disabled={isSubmitting || !videoFile}
          className="w-full inline-flex items-center justify-center space-x-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Uploading to YouTube...</span>
            </>
          ) : (
            <>
              <Upload size={20} />
              <span>Upload to YouTube</span>
            </>
          )}
        </Button>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-800 text-sm">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <p>
              This upload uses the YouTube Data API v3. Please make sure your OAuth credentials have the correct scopes enabled,
              including <code className="bg-blue-100 px-1 py-0.5 rounded text-xs">https://www.googleapis.com/auth/youtube.upload</code>.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};
