
import { Bell } from 'lucide-react';

export const Header = () => {
  return (
    <header className="border-b bg-white/50 backdrop-blur-sm">
      <div className="flex items-center justify-between px-6 py-4">
        <h1 className="text-2xl font-semibold text-gray-800 font-display">
          SocialWay.ai – YouTube Integration
        </h1>
        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-600 hover:text-gray-800 transition-colors">
            <Bell size={20} />
          </button>
          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-400 to-blue-500" />
        </div>
      </div>
    </header>
  );
};
