
import { Bell, ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export const Header = () => {
  const [channelInfo, setChannelInfo] = useState<{
    name: string;
    id: string;
    thumbnail: string;
    connected: boolean;
  } | null>(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  const showBackButton = location.pathname !== '/';

  useEffect(() => {
    // Check for YouTube channel info in localStorage
    const storedInfo = localStorage.getItem('youtubeChannel');
    if (storedInfo) {
      try {
        const parsedInfo = JSON.parse(storedInfo);
        setChannelInfo(parsedInfo);
      } catch (e) {
        console.error("Error parsing channel info:", e);
      }
    }
  }, []);

  return (
    <header className="border-b bg-white/50 backdrop-blur-sm">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          {showBackButton && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/')}
              className="mr-2"
            >
              <ArrowLeft size={20} />
            </Button>
          )}
          <h1 className="text-2xl font-semibold text-gray-800 font-display">
            SocialWay.ai – YouTube Integration
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-600 hover:text-gray-800 transition-colors">
            <Bell size={20} />
          </button>
          <Avatar>
            {channelInfo?.thumbnail ? (
              <AvatarImage src={channelInfo.thumbnail} alt={channelInfo.name} />
            ) : (
              <AvatarFallback className="bg-gradient-to-r from-blue-400 to-blue-500">
                {channelInfo?.name?.charAt(0) || 'U'}
              </AvatarFallback>
            )}
          </Avatar>
        </div>
      </div>
    </header>
  );
};
