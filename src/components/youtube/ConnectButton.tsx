
import { Youtube } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const ConnectButton = () => {
  const { toast } = useToast();

  const handleConnect = async () => {
    try {
      const { data: { CLIENT_ID }, error: secretError } = await supabase.functions.invoke('get-secret', {
        body: { secretName: 'CLIENT_ID' }
      });

      if (secretError) {
        throw new Error(`Error fetching client ID: ${secretError.message}`);
      }

      if (!CLIENT_ID) {
        toast({
          title: "Configuration Error",
          description: "YouTube client ID is not configured properly.",
          variant: "destructive"
        });
        return;
      }

      // Build the OAuth URL with the retrieved client ID
      const redirectUri = "https://fhoydbjcneodbgepfyho.supabase.co/functions/v1/youtube-oauth-callback";
      const scopes = [
        "https://www.googleapis.com/auth/youtube",
        "https://www.googleapis.com/auth/youtube.upload",
        "https://www.googleapis.com/auth/youtube.force-ssl",
        "https://www.googleapis.com/auth/youtube.readonly",
        "https://www.googleapis.com/auth/youtube.channel-memberships.creator"
      ].join(" ");

      const oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scopes)}&access_type=offline&prompt=consent`;
      
      console.log("Opening OAuth URL with client ID:", CLIENT_ID.substring(0, 5) + "...");
      window.open(oauthUrl, '_blank');
    } catch (error) {
      console.error("Error initiating YouTube connection:", error);
      toast({
        title: "Connection Error",
        description: "Unable to connect to YouTube. Please try again.",
        variant: "destructive"
      });
    }
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
