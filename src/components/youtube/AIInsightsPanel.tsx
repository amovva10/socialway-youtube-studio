
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Lightbulb, TrendingUp, Users, Clock, ExternalLink } from 'lucide-react';
import { ConnectButton } from './ConnectButton';

export const AIInsightsPanel = () => {
  const [loading, setLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  
  // In a real app, these would come from an API call
  const insights = [
    {
      category: "Content Strategy",
      icon: TrendingUp,
      items: [
        "Your tutorial videos receive 42% more engagement than other content types. Consider creating a focused tutorial series.",
        "Videos posted on Tuesdays and Thursdays between 4-6pm have shown higher view rates.",
        "Videos that include 'How to' in the title have 35% higher click-through rates."
      ]
    },
    {
      category: "Audience Growth",
      icon: Users,
      items: [
        "Your channel is growing fastest among viewers aged 25-34. Consider tailoring content to this demographic.",
        "Viewers from tech and education sectors engage most with your content.",
        "Collaboration opportunities with channels in similar niches could expand your audience by an estimated 15-20%."
      ]
    },
    {
      category: "Retention Optimization",
      icon: Clock,
      items: [
        "Average view duration drops significantly after 8 minutes. Consider shorter, more focused content.",
        "Adding timestamps to longer videos could improve retention by up to 18%.",
        "Videos with calls-to-action in the first 30 seconds show 27% better subscriber conversion."
      ]
    }
  ];

  useEffect(() => {
    // Check if YouTube channel is connected
    const channelInfo = JSON.parse(localStorage.getItem('youtubeChannel') || '{}');
    if (channelInfo.connected) {
      setIsConnected(true);
      setLoading(true);
      
      // Simulate loading AI insights
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  }, []);

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
              {category.items.map((insight, index) => (
                <Card key={index} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4 flex items-start gap-3">
                    <Lightbulb className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-700">{insight}</p>
                  </CardContent>
                </Card>
              ))}
              
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
