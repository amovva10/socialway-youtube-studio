
import { Layout } from "@/components/layout/Layout";
import { CommentManagement } from "@/components/youtube/CommentManagement";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { ConnectButton } from "@/components/youtube/ConnectButton";

const Comments = () => {
  const [channelConnected, setChannelConnected] = useState(false);
  const [channelData, setChannelData] = useState<any>(null);

  useEffect(() => {
    const storedChannel = localStorage.getItem('youtubeChannel');
    if (storedChannel) {
      setChannelConnected(true);
      setChannelData(JSON.parse(storedChannel));
    }
  }, []);

  return (
    <Layout>
      <div className="container mx-auto py-6 px-4">
        <div className="grid grid-cols-1 gap-6 mb-6">
          <Card className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold mb-2">Comment Management</h1>
                  <p className="opacity-90">Engage with your audience by responding to comments</p>
                </div>
                <MessageSquare size={48} className="opacity-75" />
              </div>
            </CardContent>
          </Card>
        </div>
        
        {channelConnected ? (
          <CommentManagement />
        ) : (
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center space-y-4 py-8">
                <div className="p-4 rounded-full bg-amber-100">
                  <AlertCircle size={32} className="text-amber-600" />
                </div>
                <h2 className="text-xl font-semibold">YouTube Channel Not Connected</h2>
                <p className="text-gray-500 max-w-md">
                  Connect your YouTube channel to access comment management features 
                  and interact with your audience.
                </p>
                <div className="mt-4">
                  <ConnectButton />
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Comments;
