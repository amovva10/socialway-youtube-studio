
import { LayoutDashboard, Upload, BarChart3, Settings, Wand2, MessageSquare, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate, useLocation } from 'react-router-dom';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Wand2, label: 'Content Generator', path: '/generator' },
  { icon: MessageSquare, label: 'Community', path: '/community' },
  { icon: Upload, label: 'Upload Video', path: '/upload' },
  { icon: BarChart3, label: 'Analytics', path: '/analytics' },
  { icon: Settings, label: 'Settings', path: '/settings' }
];

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className="w-64 border-r bg-white/50 backdrop-blur-sm h-screen flex flex-col">
      <div className="p-6 flex items-center justify-center">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-400 to-blue-500 flex items-center justify-center">
          <User size={20} color="white" />
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
