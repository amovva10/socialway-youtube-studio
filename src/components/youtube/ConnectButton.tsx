
import { Youtube } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const ConnectButton = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = async () => {
    setIsLoading(true);
    try {
      // Clear previous YouTube connection data
      localStorage.removeItem('youtubeChannel');
      
      // Get client ID from Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('get-youtube-client-id');
      
      if (error) {
        throw new Error(`Error getting client ID: ${error.message}`);
      }
      
      const CLIENT_ID = data.clientId;
      
      if (!CLIENT_ID) {
        throw new Error("No client ID returned from server");
      }
      
      // Get current application origin
      const appOrigin = window.location.origin;
      console.log('Current application origin:', appOrigin);
      
      // Build the OAuth URL with the properly encoded parameters
      // The redirect URI must match exactly what's registered in Google Cloud Console
      const redirectUri = `https://fhoydbjcneodbgepfyho.supabase.co/functions/v1/youtube-oauth-callback`;
      const encodedRedirectUri = encodeURIComponent(redirectUri);
      
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

      // Add app_origin as a query parameter to help with the redirect back
      const oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${encodedRedirectUri}&response_type=code&scope=${scopes}&access_type=offline&prompt=consent&include_granted_scopes=true&state=${state}&app_origin=${encodeURIComponent(appOrigin)}`;
      
      console.log("Opening OAuth URL with client ID:", CLIENT_ID);
      console.log("Using redirect URI:", redirectUri);
      console.log("Current app origin:", appOrigin);
      
      // Update toast to be more informative
      toast({
        title: "Opening YouTube Authorization",
        description: "Please complete the authorization in the new window. You'll be redirected back when finished.",
      });
      
      // Open in a new window
      window.open(oauthUrl, '_blank');
    } catch (error) {
      console.error("Error initiating YouTube connection:", error);
      toast({
        title: "Connection Error",
        description: error.message || "Unable to connect to YouTube. Please try again.",
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
