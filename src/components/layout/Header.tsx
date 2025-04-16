
import { Bell, ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const showBackButton = location.pathname !== '/';

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
            <AvatarFallback className="bg-gradient-to-r from-blue-400 to-blue-500">
              U
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};
