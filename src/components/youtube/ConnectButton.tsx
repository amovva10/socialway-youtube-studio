
import { Youtube } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";

export const ConnectButton = () => {
  const handleConnect = async () => {
    const { data: { CLIENT_ID } } = await supabase.functions.invoke('get-secret', {
      body: { secretName: 'CLIENT_ID' }
    });

    const oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=https://fhoydbjcneodbgepfyho.supabase.co/functions/v1/youtube-oauth-callback&response_type=code&scope=https://www.googleapis.com/auth/youtube https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube.force-ssl https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/youtube.channel-memberships.creator&access_type=offline&prompt=consent`;
    
    window.open(oauthUrl, '_blank');
  };

  return (
    <button 
      onClick={handleConnect}
      className="inline-flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-lg hover:shadow-blue-200 transition-all duration-200 transform hover:-translate-y-0.5"
    >
      <Youtube size={24} />
      <span className="font-semibold">Connect YouTube Channel</span>
    </button>
  );
};
