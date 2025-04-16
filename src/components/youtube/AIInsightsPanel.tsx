
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Lightbulb, TrendingUp, Users, Clock, ExternalLink } from 'lucide-react';
import { ConnectButton } from './ConnectButton';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const AIInsightsPanel = () => {
  const [loading, setLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [accessToken, setAccessToken] = useState('');
  const { toast } = useToast();
  
  const [insights, setInsights] = useState([
    {
      category: "Content Strategy",
      icon: TrendingUp,
      items: []
    },
    {
      category: "Audience Growth",
      icon: Users,
      items: []
    },
    {
      category: "Retention Optimization",
      icon: Clock,
      items: []
    }
  ]);

  useEffect(() => {
    // Check if YouTube channel is connected
    const channelInfo = JSON.parse(localStorage.getItem('youtubeChannel') || '{}');
    if (channelInfo.connected) {
      setIsConnected(true);
      
      if (channelInfo.accessToken) {
        setAccessToken(channelInfo.accessToken);
      }
      
      setLoading(true);
      
      // Fetch AI insights based on channel data
      fetchAIInsights(channelInfo.accessToken);
    }
  }, []);

  const fetchAIInsights = async (token) => {
    try {
      console.log('Fetching AI insights with token available:', !!token);
      
      const { data, error } = await supabase.functions.invoke('super-processor', {
        body: {
          action: 'channel-insights',
          accessToken: token
        }
      });
      
      if (error) {
        console.error('Error fetching insights:', error);
        throw error;
      }
      
      if (data && data.insights) {
        // Update the insights with personalized data
        setInsights(data.insights.map(category => ({
          ...category,
          items: category.items || []
        })));
        
        toast({
          title: "Insights Generated",
          description: "AI growth insights have been personalized for your channel.",
        });
      }
    } catch (error) {
      console.error('Error generating AI insights:', error);
      toast({
        title: "Error Generating Insights",
        description: error.message || "Could not generate personalized insights",
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
            Connect your YouTube channel to get AI-powered insights on how to grow your audience.
          </p>
        </div>
        <ConnectButton />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-gray-600">
        AI-powered insights based on your channel's performance data to help optimize your content strategy and grow your audience.
      </p>
      
      <Tabs defaultValue="content">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="content">Content Strategy</TabsTrigger>
          <TabsTrigger value="audience">Audience Growth</TabsTrigger>
          <TabsTrigger value="retention">Retention</TabsTrigger>
        </TabsList>
        
        {insights.map((category) => (
          <TabsContent key={category.category} value={category.category.toLowerCase().split(' ')[0]}>
            <div className="space-y-4">
              {category.items.length > 0 ? (
                category.items.map((insight, index) => (
                  <Card key={index} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4 flex items-start gap-3">
                      <Lightbulb className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-700">{insight}</p>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>Loading personalized insights for your channel...</p>
                </div>
              )}
              
              <div className="pt-3">
                <a 
                  href="#" 
                  className="text-blue-500 hover:text-blue-700 flex items-center text-sm font-medium"
                >
                  <span>View detailed analysis</span>
                  <ExternalLink className="h-4 w-4 ml-1" />
                </a>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
