
import { Bell, ArrowLeft, UserRound, LogOut } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from 'react';

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const showBackButton = location.pathname !== '/';
  const [isYouTubeConnected, setIsYouTubeConnected] = useState(false);

  // Check if YouTube is connected
  useEffect(() => {
    const checkYouTubeConnection = () => {
      const youtubeData = localStorage.getItem('youtubeChannel');
      setIsYouTubeConnected(!!youtubeData);
    };
    
    // Check on initial load
    checkYouTubeConnection();
    
    // Set up event listener for storage changes
    window.addEventListener('storage', checkYouTubeConnection);
    
    // Custom event listener for when we update localStorage programmatically
    window.addEventListener('youtubeConnectionChanged', checkYouTubeConnection);
    
    return () => {
      window.removeEventListener('storage', checkYouTubeConnection);
      window.removeEventListener('youtubeConnectionChanged', checkYouTubeConnection);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      // Clear YouTube connection data from localStorage
      localStorage.removeItem('youtubeChannel');
      
      // Dispatch custom event to notify components about the change
      window.dispatchEvent(new Event('youtubeConnectionChanged'));
      
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
      });
      navigate('/');
    } catch (error) {
      toast({
        title: "Error logging out",
        description: "There was a problem logging out. Please try again.",
        variant: "destructive",
      });
    }
  };

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
          
          {isYouTubeConnected && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarFallback className="bg-gradient-to-r from-purple-400 to-purple-500 text-white flex items-center justify-center">
                    <UserRound size={20} />
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
};
