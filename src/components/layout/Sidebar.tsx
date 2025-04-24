
import { LayoutDashboard, Upload, BarChart3, Settings, Wand2, MessageSquare, Zap, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [channelConnected, setChannelConnected] = useState(false);
  
  useEffect(() => {
    // Check if YouTube channel is connected
    const storedChannel = localStorage.getItem('youtubeChannel');
    setChannelConnected(!!storedChannel);
    
    // Listen for changes in localStorage
    const handleStorageChange = () => {
      const channel = localStorage.getItem('youtubeChannel');
      setChannelConnected(!!channel);
    };
    
    window.addEventListener('storage', handleStorageChange);
    // Also listen for storage events from the same window
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function(key, value) {
      const event = new Event('storage');
      event.key = key;
      window.dispatchEvent(event);
      originalSetItem.apply(this, arguments);
    };
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      localStorage.setItem = originalSetItem;
    };
  }, []);

  // Define base menu items that are always shown
  const baseMenuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Wand2, label: 'Content Generator', path: '/generator' },
    { icon: MessageSquare, label: 'Community', path: '/community' }
  ];
  
  // Define menu items that require a connected channel
  const connectedMenuItems = [
    { icon: MessageCircle, label: 'Comments', path: '/comments', requiresChannel: true },
    { icon: Upload, label: 'Upload Video', path: '/upload' },
    { icon: BarChart3, label: 'Analytics', path: '/analytics' }
  ];
  
  // Settings is always shown
  const settingsItem = { icon: Settings, label: 'Settings', path: '/settings' };
  
  // Combine menu items based on connection status
  const menuItems = [
    ...baseMenuItems,
    ...(channelConnected ? connectedMenuItems : connectedMenuItems.filter(item => !item.requiresChannel)),
    settingsItem
  ];

  return (
    <aside className="w-64 border-r bg-white/50 backdrop-blur-sm h-screen flex flex-col">
      <div className="p-6 flex items-center justify-center">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-400 to-blue-500 flex items-center justify-center">
          <Zap size={20} color="white" />
        </div>
      </div>
      <nav className="flex-1 px-3">
        {menuItems.map((item) => (
          <button
            key={item.label}
            onClick={() => navigate(item.path)}
            className={cn(
              "w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-blue-50 transition-all",
              location.pathname === item.path && "bg-blue-50 text-blue-600"
            )}
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};
