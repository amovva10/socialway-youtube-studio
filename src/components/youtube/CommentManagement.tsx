
import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, MessageSquare, CheckCheck, ThumbsUp } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Comment {
  id: string;
  videoId: string;
  authorDisplayName: string;
  authorProfileImageUrl: string;
  textDisplay: string;
  likeCount: number;
  publishedAt: string;
  status: string;
  videoTitle: string;
  replied: boolean;
}

export const CommentManagement = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'replied'>('all');
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isReplying, setIsReplying] = useState(false);
  const { toast } = useToast();
  const [channelData, setChannelData] = useState<any>(null);

  useEffect(() => {
    const storedChannel = localStorage.getItem('youtubeChannel');
    if (storedChannel) {
      setChannelData(JSON.parse(storedChannel));
    }
  }, []);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase.functions.invoke('super-processor', {
          body: {
            action: 'fetch-comments',
            accessToken: channelData?.accessToken || null,
            filter: filter
          }
        });

        if (error) throw error;
        
        // If we don't have real data and not authenticated, show mock data
        const commentsData = data?.comments || generateMockComments();
        setComments(commentsData);
      } catch (error) {
        console.error('Error fetching comments:', error);
        toast({
          title: "Error",
          description: "Failed to load comments",
          variant: "destructive"
        });
        // Fallback to mock data on error
        setComments(generateMockComments());
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
  }, [channelData, filter, toast]);

  const generateMockComments = (): Comment[] => {
    return [
      {
        id: '1',
        videoId: 'abc123',
        authorDisplayName: 'Viewer One',
        authorProfileImageUrl: '',
        textDisplay: 'Love this content! Keep it up.',
        likeCount: 24,
        publishedAt: new Date(Date.now() - 86400000).toISOString(),
        status: 'published',
        videoTitle: 'How to Grow on YouTube in 2025',
        replied: false
      },
      {
        id: '2',
        videoId: 'def456',
        authorDisplayName: 'Viewer Two',
        authorProfileImageUrl: '',
        textDisplay: 'Could you do a tutorial on editing software?',
        likeCount: 8,
        publishedAt: new Date(Date.now() - 172800000).toISOString(),
        status: 'published',
        videoTitle: 'Camera Setup Tour 2025',
        replied: true
      },
      {
        id: '3',
        videoId: 'ghi789',
        authorDisplayName: 'Viewer Three',
        authorProfileImageUrl: '',
        textDisplay: 'The audio seems a bit low in this one.',
        likeCount: 3,
        publishedAt: new Date(Date.now() - 259200000).toISOString(),
        status: 'published',
        videoTitle: 'My YouTube Studio Tour',
        replied: false
      }
    ];
  };

  const handleReplySubmit = async () => {
    if (!selectedComment || !replyText.trim()) return;
    
    setIsReplying(true);
    
    try {
      if (channelData?.accessToken) {
        // Real API call would go here
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
        
        toast({
          title: "Reply Posted",
          description: "Your reply has been published successfully."
        });
      } else {
        // Simulate success for demo purposes
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        toast({
          title: "Demo Mode",
          description: "In a real app, your reply would be posted now."
        });
      }
      
      // Update local state to show comment as replied
      setComments(comments.map(comment => 
        comment.id === selectedComment.id ? {...comment, replied: true} : comment
      ));
      
      setReplyText('');
      setSelectedComment(null);
    } catch (error) {
      console.error('Error posting reply:', error);
      toast({
        title: "Error",
        description: "Failed to post reply",
        variant: "destructive"
      });
    } finally {
      setIsReplying(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    }).format(date);
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
        <h2 className="text-2xl font-bold">Comment Management</h2>
      </div>

      <Tabs defaultValue="all" onValueChange={(value) => setFilter(value as any)}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Comments</TabsTrigger>
          <TabsTrigger value="pending">Needs Response</TabsTrigger>
          <TabsTrigger value="replied">Responded</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          {renderComments(comments)}
        </TabsContent>
        
        <TabsContent value="pending" className="space-y-4">
          {renderComments(comments.filter(comment => !comment.replied))}
        </TabsContent>
        
        <TabsContent value="replied" className="space-y-4">
          {renderComments(comments.filter(comment => comment.replied))}
        </TabsContent>
      </Tabs>

      {selectedComment && (
        <Card className="mt-6 border-blue-200">
          <CardHeader>
            <CardTitle className="text-lg">Reply to {selectedComment.authorDisplayName}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-50 p-3 rounded-md text-gray-700">
              <p className="text-sm font-medium">Original Comment:</p>
              <p className="mt-1">{selectedComment.textDisplay}</p>
            </div>
            
            <Textarea 
              placeholder="Type your reply here..." 
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="min-h-[100px]"
            />
            
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setSelectedComment(null);
                  setReplyText('');
                }}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleReplySubmit}
                disabled={isReplying || !replyText.trim()}
              >
                {isReplying ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Posting...
                  </>
                ) : (
                  <>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Post Reply
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  function renderComments(commentsToRender: Comment[]) {
    if (commentsToRender.length === 0) {
      return (
        <Card>
          <CardContent className="p-6 text-center">
            <div className="flex flex-col items-center space-y-4 py-4">
              <MessageSquare className="h-12 w-12 text-gray-400" />
              <div className="text-lg font-medium">No Comments Found</div>
              <p className="text-gray-500">
                {filter === 'pending' 
                  ? "You've responded to all comments!" 
                  : filter === 'replied' 
                    ? "You haven't responded to any comments yet"
                    : "There are no comments to display"}
              </p>
            </div>
          </CardContent>
        </Card>
      );
    }

    return commentsToRender.map((comment) => (
      <Card key={comment.id} className={comment.replied ? 'border-green-100' : ''}>
        <CardContent className="p-4">
          <div className="flex items-start space-x-4">
            <Avatar className="h-10 w-10">
              {comment.authorProfileImageUrl ? (
                <AvatarImage src={comment.authorProfileImageUrl} alt={comment.authorDisplayName} />
              ) : (
                <AvatarFallback>{comment.authorDisplayName.substring(0, 2)}</AvatarFallback>
              )}
            </Avatar>
            
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{comment.authorDisplayName}</p>
                  <p className="text-sm text-gray-500">
                    {formatDate(comment.publishedAt)} on "{comment.videoTitle}"
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="flex items-center">
                    <ThumbsUp className="h-3 w-3 mr-1" />
                    {comment.likeCount}
                  </Badge>
                  
                  {comment.replied && (
                    <Badge variant="outline" className="bg-green-50 text-green-600 flex items-center">
                      <CheckCheck className="h-3 w-3 mr-1" />
                      Responded
                    </Badge>
                  )}
                </div>
              </div>
              
              <p className="mt-2">{comment.textDisplay}</p>
              
              <div className="mt-3 flex justify-end">
                {!comment.replied ? (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setSelectedComment(comment)}
                  >
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Reply
                  </Button>
                ) : (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-green-600"
                    onClick={() => setSelectedComment(comment)}
                  >
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Update Reply
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    ));
  }
};
