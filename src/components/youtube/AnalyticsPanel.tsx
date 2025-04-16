
import { useState, useEffect } from 'react';
import { Eye, ThumbsUp, Clock, Users } from 'lucide-react';
import { ConnectButton } from './ConnectButton';
import { useToast } from "@/components/ui/use-toast";

export const AnalyticsPanel = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  
  // Stats state with real data structure
  const [stats, setStats] = useState([
    { icon: Eye, label: 'Total Views', value: '0', change: '0%' },
    { icon: ThumbsUp, label: 'Total Likes', value: '0', change: '0%' },
    { icon: Clock, label: 'Watch Time', value: '0hrs', change: '0%' },
    { icon: Users, label: 'Subscribers', value: '0', change: '0%' }
  ]);

  useEffect(() => {
    // Check if YouTube channel is connected
    const channelInfo = JSON.parse(localStorage.getItem('youtubeChannel') || '{}');
    if (channelInfo.connected) {
      setIsConnected(true);
      
      // Simulate fetching analytics data
      // In a real app, this would use the YouTube Analytics API
      setLoading(true);
      
      setTimeout(() => {
        // Simulate successful data retrieval
        toast({
          title: "Analytics Loaded",
          description: `Loaded analytics for channel: ${channelInfo.name}`,
        });
        
        setStats([
          { icon: Eye, label: 'Total Views', value: '1,234', change: '+12%' },
          { icon: ThumbsUp, label: 'Total Likes', value: '432', change: '+8%' },
          { icon: Clock, label: 'Watch Time', value: '213hrs', change: '+15%' },
          { icon: Users, label: 'Subscribers', value: '56', change: '+5%' }
        ]);
        
        setLoading(false);
      }, 1000);
    }
  }, [isConnected, toast]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center py-10 space-y-6">
        <div className="text-center max-w-md space-y-3">
          <h3 className="text-xl font-semibold text-gray-800">Connect Your YouTube Channel</h3>
          <p className="text-gray-600">
            Connect your YouTube channel to view analytics and upload videos directly from this dashboard.
          </p>
        </div>
        <ConnectButton />
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
                <span className={`text-sm ${stat.change.startsWith('+') ? 'text-green-500' : 'text-gray-500'}`}>
                  {stat.change}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
