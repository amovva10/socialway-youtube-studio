
import { Bell, ArrowLeft, UserRound } from 'lucide-react';
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
          <img 
            src="/lovable-uploads/4e36c889-4225-4412-ab72-909ae5c3978e.png" 
            alt="SocialWay.ai Logo" 
            className="h-8 w-auto"
          />
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-600 hover:text-gray-800 transition-colors">
            <Bell size={20} />
          </button>
          <Avatar>
            <AvatarFallback className="bg-gradient-to-r from-purple-400 to-purple-500 text-white flex items-center justify-center">
              <UserRound size={20} />
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};
