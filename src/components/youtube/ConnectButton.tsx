
import { Youtube } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

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
    <Button 
      onClick={handleConnect}
      className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
    >
      <Youtube className="mr-2" size={20} />
      Connect YouTube Channel
    </Button>
  );
};
