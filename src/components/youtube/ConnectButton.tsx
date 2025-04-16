
import { Youtube } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export const ConnectButton = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = async () => {
    setIsLoading(true);
    try {
      // The client ID must exactly match what's configured in Google Cloud Console
      // This client ID must be registered in Google Cloud Console with the correct redirect URI
      const CLIENT_ID = "458582647832-g8r7pislak878j333hdl0uhei73hbqbq.apps.googleusercontent.com";
      
      // Build the OAuth URL with the properly encoded parameters
      const redirectUri = encodeURIComponent("https://fhoydbjcneodbgepfyho.supabase.co/functions/v1/youtube-oauth-callback");
      const scopes = encodeURIComponent([
        "https://www.googleapis.com/auth/youtube.readonly",
        "https://www.googleapis.com/auth/youtube",
        "https://www.googleapis.com/auth/youtube.upload",
        "https://www.googleapis.com/auth/youtube.force-ssl"
      ].join(" "));

      // Use state parameter to improve security
      const state = Math.random().toString(36).substring(2);
      // Store state in localStorage to verify when the callback returns
      localStorage.setItem('oauthState', state);

      const oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&scope=${scopes}&access_type=offline&prompt=consent&include_granted_scopes=true&state=${state}`;
      
      console.log("Opening OAuth URL with client ID:", CLIENT_ID);
      console.log("Using redirect URI:", redirectUri);
      window.open(oauthUrl, '_blank');
      
      toast({
        title: "Authorization Started",
        description: "Please complete authorization in the new window",
      });
    } catch (error) {
      console.error("Error initiating YouTube connection:", error);
      toast({
        title: "Connection Error",
        description: "Unable to connect to YouTube. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleConnect}
      disabled={isLoading}
      className="inline-flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-lg hover:shadow-blue-200 transition-all duration-200 transform hover:-translate-y-0.5"
    >
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Youtube size={24} className="mr-2" />
      )}
      <span className="font-semibold">Connect YouTube Channel</span>
    </Button>
  );
};
