
import { useState, useEffect } from 'react';
import { Eye, ThumbsUp, Clock, Users } from 'lucide-react';
import { ConnectButton } from './ConnectButton';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const AnalyticsPanel = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [accessToken, setAccessToken] = useState('');
  
  // Stats state with initial empty values
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
      
      // Fetch real analytics data from YouTube API
      fetchAnalytics();
    }
  }, [isConnected]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchAnalytics = async () => {
    setLoading(true);
    
    try {
      // In a real app, we would store the access token securely
      // For now, we'll simulate the analytics using the Supabase function
      const { data, error } = await supabase.functions.invoke('super-processor', {
        body: {
          action: 'channel-analytics',
          accessToken: 'SIMULATED_ACCESS_TOKEN' // In a real-world app, use an actual access token
        }
      });
      
      if (error) {
        throw error;
      }
      
      if (data) {
        // Update the stats with real data
        setStats([
          { icon: Eye, label: 'Total Views', value: data.views.value, change: data.views.change },
          { icon: ThumbsUp, label: 'Total Videos', value: data.videos.value, change: data.videos.change },
          { icon: Clock, label: 'Watch Time', value: data.watchTime.value, change: data.watchTime.change },
          { icon: Users, label: 'Subscribers', value: data.subscribers.value, change: data.subscribers.change }
        ]);
        
        toast({
          title: "Analytics Loaded",
          description: "Your channel analytics have been loaded successfully",
        });
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast({
        title: "Error Loading Analytics",
        description: error.message || "Could not load your YouTube analytics",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

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
