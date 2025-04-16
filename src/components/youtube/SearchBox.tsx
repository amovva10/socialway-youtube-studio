
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface SearchResult {
  videos: Array<{
    title: string;
    thumbnail: string;
    videoId: string;
  }>;
}

export const SearchBox = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
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
                <a
                  href={`https://youtube.com/watch?v=${video.videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-700 text-sm"
                >
                  Watch on YouTube →
                </a>
              </div>
            </Card>
          ))}
        </div>
      ) : results && (
        <div className="text-center py-8 text-gray-500">
          No videos found. Try a different search!
        </div>
      )}
    </div>
  );
};
