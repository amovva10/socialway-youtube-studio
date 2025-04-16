
import { Eye, ThumbsUp, Clock, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

export const AnalyticsPanel = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [channelInfo, setChannelInfo] = useState<{
    name: string;
    id: string;
  } | null>(null);

  useEffect(() => {
    // Check for YouTube channel info in localStorage
    const storedInfo = localStorage.getItem('youtubeChannel');
    if (storedInfo) {
      try {
        const parsedInfo = JSON.parse(storedInfo);
        setIsConnected(parsedInfo.connected);
        setChannelInfo({
          name: parsedInfo.name,
          id: parsedInfo.id
        });
      } catch (e) {
        console.error("Error parsing channel info:", e);
      }
    }
  }, []);

  // Mock statistics that would be shown when connected
  const connectedStats = [
    { icon: Eye, label: 'Total Views', value: '12,480', change: '+14%' },
    { icon: ThumbsUp, label: 'Total Likes', value: '1,024', change: '+8%' },
    { icon: Clock, label: 'Watch Time', value: '380hrs', change: '+12%' },
    { icon: Users, label: 'Demographics', value: 'United States', change: '' }
  ];

  // Default placeholder stats when not connected
  const defaultStats = [
    { icon: Eye, label: 'Total Views', value: '0', change: '+0%' },
    { icon: ThumbsUp, label: 'Total Likes', value: '0', change: '+0%' },
    { icon: Clock, label: 'Watch Time', value: '0hrs', change: '+0%' },
    { icon: Users, label: 'Demographics', value: '---', change: '' }
  ];

  const stats = isConnected ? connectedStats : defaultStats;

  return (
    <div className="space-y-4">
      {isConnected && channelInfo && (
        <div className="mb-4 p-4 rounded-lg bg-green-50 border border-green-100 text-green-800">
          <p className="font-medium">Connected to channel: {channelInfo.name}</p>
          <p className="text-sm text-green-700">Showing analytics for your YouTube channel</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3 text-blue-500 mb-3">
              <stat.icon size={24} />
              <h3 className="font-medium">{stat.label}</h3>
            </div>
            <div className="flex items-end justify-between">
              <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              {stat.change && (
                <span className="text-sm text-green-500">{stat.change}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
