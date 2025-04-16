
import { LayoutDashboard, Upload, BarChart3, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', active: true },
  { icon: Upload, label: 'Upload Video' },
  { icon: BarChart3, label: 'Analytics' },
  { icon: Settings, label: 'Settings' }
];

export const Sidebar = () => {
  return (
    <aside className="w-64 border-r bg-white/50 backdrop-blur-sm h-screen flex flex-col">
      <div className="p-6">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-400 to-blue-500" />
      </div>
      <nav className="flex-1 px-3">
        {menuItems.map((item) => (
          <button
            key={item.label}
            className={cn(
              "w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-blue-50 transition-all",
              item.active && "bg-blue-50 text-blue-600"
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
