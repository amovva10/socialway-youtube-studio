
import { useState, useEffect } from 'react';

export const VideoGrid = () => {
  const [loading, setLoading] = useState(false);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    // Simulating data loading
    setLoading(true);
    
    // In a real app, this would be an API call to fetch user's videos
    const timer = setTimeout(() => {
      setVideos([]);  // Empty array as we don't have real data
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <p className="text-gray-600 mb-4">No videos found</p>
        <p className="text-sm text-gray-500">Search for videos or upload your own content</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {videos.map((video, index) => (
        <div key={index} className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full aspect-video object-cover"
          />
          <div className="p-4">
            <h3 className="font-medium text-gray-900 mb-1">{video.title}</h3>
            <div className="text-sm text-gray-500">
              {video.views} • {video.date}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
