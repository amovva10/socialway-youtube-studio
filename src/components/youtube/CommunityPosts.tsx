
import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, TrendingUp, MessageSquare, Share, Globe, Briefcase, Book, Video, Gamepad } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ConnectButton } from "./ConnectButton";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Badge } from "@/components/ui/badge";
import { CreateCommunityPost } from "./CreateCommunityPost";

interface CommunityPost {
  title: string;
  contentHtml: string;
  authorDisplayName: string;
  publishedAt: string;
  likeCount: number;
  replyCount: number;
  thumbnail?: string;
  category?: string;
}

const categories = [
  { id: 'all', label: 'All', icon: Globe },
  { id: 'business', label: 'Business', icon: Briefcase },
  { id: 'education', label: 'Education', icon: Book },
  { id: 'entertainment', label: 'Entertainment', icon: Video },
  { id: 'gaming', label: 'Gaming', icon: Gamepad },
];

export const CommunityPosts = () => {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { toast } = useToast();
  const [channelData, setChannelData] = useState<any>(null);
  const [showPostForm, setShowPostForm] = useState(false);

  useEffect(() => {
    const storedChannel = localStorage.getItem('youtubeChannel');
    if (storedChannel) {
      setChannelData(JSON.parse(storedChannel));
      // Automatically show post form when user is connected
      setShowPostForm(true);
    }
  }, []);

  useEffect(() => {
    const fetchCommunityPosts = async () => {
      try {
        setIsLoading(true);
        console.log(`Fetching posts with category: ${selectedCategory}`);
        
        const { data, error } = await supabase.functions.invoke('super-processor', {
          body: {
            action: 'fetch-community-posts',
            accessToken: channelData?.accessToken || null,
            category: selectedCategory !== 'all' ? selectedCategory : undefined
          }
        });

        if (error) throw error;
        
        console.log("Received posts:", data.posts);
        setPosts(data.posts || []);
      } catch (error) {
        console.error('Error fetching community posts:', error);
        toast({
          title: "Error",
          description: "Failed to load community posts",
          variant: "destructive"
        });
        // Set empty posts array to prevent showing loader indefinitely
        setPosts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCommunityPosts();
  }, [channelData, selectedCategory, toast]);

  const handleCategoryChange = (value: string) => {
    if (value) {
      console.log(`Category changed to: ${value}`);
      setSelectedCategory(value);
      // Posts will be fetched by the useEffect that depends on selectedCategory
    }
  };

  const handleCreatePost = () => {
    if (!channelData?.accessToken) {
      toast({
        title: "Authentication Required",
        description: "Please connect your YouTube account to create posts",
        variant: "destructive"
      });
      return;
    }
    setShowPostForm(!showPostForm);
  };

  const handlePostCreated = () => {
    setShowPostForm(true); // Keep form visible after posting
    const newPost = {
      title: "New Post",
      contentHtml: "Your post has been created and will be visible to your community!",
      authorDisplayName: channelData?.channelName || "Your Channel",
      publishedAt: new Date().toISOString(),
      likeCount: 0,
      replyCount: 0
    };
    setPosts([newPost, ...posts]);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">YouTube Community</h2>
        {channelData?.accessToken ? (
          <Button onClick={handleCreatePost}>
            <MessageSquare className="mr-2 h-4 w-4" />
            {showPostForm ? "Cancel" : "Create Post"}
          </Button>
        ) : (
          <ConnectButton />
        )}
      </div>

      {/* Show post form if user is connected */}
      {channelData?.accessToken && showPostForm && (
        <CreateCommunityPost onPostCreated={handlePostCreated} />
      )}

      {/* Categories and Posts section */}
      {!channelData?.accessToken && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Trending Categories</h3>
          <ToggleGroup 
            type="single" 
            value={selectedCategory}
            onValueChange={handleCategoryChange}
            className="justify-start"
          >
            {categories.map((category) => (
              <ToggleGroupItem 
                key={category.id} 
                value={category.id}
                aria-label={category.label}
                className="flex items-center gap-2"
              >
                <category.icon className="h-4 w-4" />
                <span>{category.label}</span>
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      )}

      {/* Display posts */}
      {posts.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <div className="flex flex-col items-center space-y-4">
              <MessageSquare className="h-12 w-12 text-gray-400" />
              <div className="text-lg font-medium">No Posts Found</div>
              {!channelData?.accessToken && (
                <p className="text-gray-500">
                  Connect your YouTube account to create and view your community posts
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {posts.map((post, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader>
                <CardTitle className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500">{post.authorDisplayName}</p>
                    <h3 className="text-lg font-semibold mt-1">{post.title}</h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    {post.category && (
                      <Badge variant="outline" className="text-xs">
                        {post.category}
                      </Badge>
                    )}
                    {post.likeCount > 100 && (
                      <span className="flex items-center text-green-600">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        Trending
                      </span>
                    )}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {post.thumbnail && (
                  <img 
                    src={post.thumbnail} 
                    alt={post.title}
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />
                )}
                <div 
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: post.contentHtml }}
                />
                <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <span>{post.likeCount.toLocaleString()} likes</span>
                    <span>{post.replyCount.toLocaleString()} comments</span>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Share className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
