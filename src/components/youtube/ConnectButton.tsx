
import { Youtube } from 'lucide-react';

export const ConnectButton = () => {
  return (
    <button className="inline-flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-lg hover:shadow-blue-200 transition-all duration-200 transform hover:-translate-y-0.5">
      <Youtube size={24} />
      <span className="font-semibold">Connect YouTube Channel</span>
    </button>
  );
};
