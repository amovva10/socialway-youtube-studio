
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Eye, MessageSquare, TrendingUp, Users } from "lucide-react";

interface SearchResult {
  videos: Array<{
    title: string;
    thumbnail: string;
    videoId: string;
  }>;
}

interface VideoInsights {
  views: number;
  comments: number;
  demographics: string;
  trend: 'up' | 'down' | 'stable';
}

export const SearchBox = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [videoInsights, setVideoInsights] = useState<VideoInsights | null>(null);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Empty search",
        description: "Please enter a search term",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log("Searching for:", searchQuery);
      const { data, error } = await supabase.functions.invoke('super-processor', {
        body: { query: searchQuery }
      });
      
      if (error) {
        console.error("Supabase function error:", error);
        throw error;
      }

      console.log("Search response:", data);
      setResults(data || null);
    } catch (error) {
      console.error("Search failed:", error);
      toast({
        title: "Search failed",
        description: "The search service is currently unavailable. Please try again later.",
        variant: "destructive",
      });
      setResults(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleViewInsights = async (videoId: string) => {
    setSelectedVideo(videoId);
    try {
      const { data, error } = await supabase.functions.invoke('super-processor', {
        body: { 
          action: 'get-video-insights',
          videoId 
        }
      });

      if (error) throw error;

      // For demo purposes, using mock data
      setVideoInsights({
        views: 12480,
        comments: 256,
        demographics: 'United States (45%), India (15%), UK (10%)',
        trend: 'up'
      });
    } catch (error) {
      console.error("Failed to fetch video insights:", error);
      toast({
        title: "Error",
        description: "Failed to load video insights. Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <Input
          type="text"
          placeholder="Search YouTube videos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1"
        />
        <Button 
          onClick={handleSearch}
          disabled={isLoading}
        >
          {isLoading ? "Searching..." : "Search"}
        </Button>
      </div>

      {results?.videos && results.videos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.videos.map((video, index) => (
            <Card key={index} className="overflow-hidden">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full aspect-video object-cover"
              />
              <div className="p-4">
                <h3 className="font-medium mb-2 line-clamp-2">{video.title}</h3>
                <div className="flex gap-2">
                  <a
                    href={`https://youtube.com/watch?v=${video.videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700 text-sm"
                  >
                    Watch on YouTube →
                  </a>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewInsights(video.videoId)}
                    className="ml-auto"
                  >
                    View Insights
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : results && (
        <div className="text-center py-8 text-gray-500">
          No videos found. Try a different search!
        </div>
      )}

      <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Video Insights</DialogTitle>
          </DialogHeader>
          {videoInsights && (
            <div className="grid gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Eye className="h-4 w-4 text-blue-500" />
                <span>Total Views:</span>
                <span className="font-semibold">{videoInsights.views.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MessageSquare className="h-4 w-4 text-green-500" />
                <span>Comments:</span>
                <span className="font-semibold">{videoInsights.comments.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-purple-500" />
                <span>Demographics:</span>
                <span className="font-semibold">{videoInsights.demographics}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="h-4 w-4 text-orange-500" />
                <span>Trend:</span>
                <span className="font-semibold capitalize">{videoInsights.trend}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
