
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const YoutubeConnected = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [timeLeft, setTimeLeft] = useState(4);

  const channelName = searchParams.get('channel') || 'Unknown';
  const channelId = searchParams.get('id') || 'Unknown';
  const thumbnailUrl = searchParams.get('thumbnail') || '';

  useEffect(() => {
    // Store channel info in localStorage
    if (channelName && channelId) {
      localStorage.setItem('youtubeChannel', JSON.stringify({
        name: channelName,
        id: channelId,
        thumbnail: thumbnailUrl,
        connected: true
      }));
    }
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    const redirect = setTimeout(() => {
      navigate('/');
    }, 4000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirect);
    };
  }, [navigate, channelName, channelId, thumbnailUrl]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-white p-6">
      <div className="text-center space-y-6 max-w-2xl bg-white p-8 rounded-xl shadow-sm border">
        <div className="flex items-center justify-center mb-4">
          {thumbnailUrl && (
            <img 
              src={thumbnailUrl} 
              alt={channelName} 
              className="w-16 h-16 rounded-full border-4 border-green-100"
            />
          )}
        </div>
        <h1 className="text-2xl font-semibold text-gray-800">
          🎉 Successfully Connected to YouTube
        </h1>
        <p className="text-lg text-gray-700">
          Channel: <span className="font-medium">{channelName}</span>
        </p>
        <p className="text-gray-500 text-sm">
          Channel ID: {channelId}
        </p>
        <p className="text-gray-600">
          Redirecting you to the dashboard in {timeLeft} seconds...
        </p>
        <Button 
          onClick={() => navigate('/')}
          className="mt-4"
          variant="outline"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Return to Dashboard Now
        </Button>
      </div>
    </div>
  );
};

export default YoutubeConnected;
