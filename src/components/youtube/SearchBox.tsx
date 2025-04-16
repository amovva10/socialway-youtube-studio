
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

interface SearchResult {
  title: string;
  thumbnail: string;
  youtubeUrl: string;
}

export const SearchBox = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('super-processor', {
        body: { query: searchQuery }
      });
      
      if (error) throw error;
      setResults(data || []);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsLoading(false);
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
          className="flex-1"
        />
        <Button 
          onClick={handleSearch}
          disabled={isLoading}
        >
          {isLoading ? "Searching..." : "Search"}
        </Button>
      </div>

      {results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map((result, index) => (
            <Card key={index} className="overflow-hidden">
              <img
                src={result.thumbnail}
                alt={result.title}
                className="w-full aspect-video object-cover"
              />
              <div className="p-4">
                <h3 className="font-medium mb-2 line-clamp-2">{result.title}</h3>
                <a
                  href={result.youtubeUrl}
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
      )}
    </div>
  );
};
