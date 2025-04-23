
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ImagePlus, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";

interface CreatePostFormValues {
  title: string;
  content: string;
  image?: FileList;
}

interface CreatePostProps {
  onPostCreated: () => void;
}

export const CreateCommunityPost = ({ onPostCreated }: CreatePostProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const form = useForm<CreatePostFormValues>({
    defaultValues: {
      title: '',
      content: '',
    }
  });
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const onSubmit = async (values: CreatePostFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Get channel data from localStorage
      const channelData = JSON.parse(localStorage.getItem('youtubeChannel') || '{}');
      
      if (!channelData.accessToken) {
        toast({
          title: "Authentication Required",
          description: "Please connect your YouTube account to create posts",
          variant: "destructive"
        });
        return;
      }
      
      // For now we're just simulating a successful post creation
      // In a production app, we would send the data to the API
      
      console.log('Creating post with:', {
        title: values.title,
        content: values.content,
        hasImage: !!selectedImage
      });
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Post Created",
        description: "Your community post has been published successfully!",
      });
      
      // Reset form
      form.reset();
      setSelectedImage(null);
      onPostCreated();
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Create Community Post</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Post title" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Share something with your community..." 
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormItem>
              <FormLabel>Image (Optional)</FormLabel>
              <FormControl>
                <div className="flex flex-col items-center space-y-4">
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="imageUpload"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                    >
                      {selectedImage ? (
                        <img 
                          src={selectedImage} 
                          alt="Selected" 
                          className="h-full object-contain mx-auto" 
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <ImagePlus className="w-8 h-8 mb-2 text-gray-500" />
                          <p className="text-sm text-gray-500">Click to upload an image</p>
                        </div>
                      )}
                      <Input
                        id="imageUpload"
                        type="file"
                        className="hidden"
                        onChange={handleImageChange}
                        accept="image/*"
                      />
                    </label>
                  </div>
                  {selectedImage && (
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => setSelectedImage(null)}
                    >
                      Remove Image
                    </Button>
                  )}
                </div>
              </FormControl>
            </FormItem>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? (
                <>Processing...</>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" /> 
                  Publish Post
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};
