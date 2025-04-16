import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"

const ContentGenerator = () => {
  const [prompt, setPrompt] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState("")
  const { toast } = useToast()

  const generateContent = async (type: string) => {
    if (!prompt) {
      toast({
        title: "Error",
        description: "Please enter a prompt first",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const { data, error } = await supabase.functions.invoke('generate', {
        body: {
          prompt: prompt,
          systemPrompt: getSystemPrompt(type)
        },
      })

      if (error) throw new Error(error.message)
      
      setResult(data.generatedText)
      toast({
        title: "Success",
        description: `${type.charAt(0).toUpperCase() + type.slice(1)} generated successfully!`,
      })
    } catch (error) {
      console.error("Generation error:", error)
      toast({
        title: "Error",
        description: "Failed to generate content. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getSystemPrompt = (type: string) => {
    switch(type) {
      case 'script':
        return 'You are a professional video script writer. Write an engaging YouTube video script based on the topic.'
      case 'title':
        return 'You are a YouTube title optimization expert. Create an engaging, clickable title that follows best practices.'
      case 'thumbnail':
        return 'You are a YouTube thumbnail expert. Describe an eye-catching thumbnail design that will attract viewers.'
      default:
        return ''
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Content Generator</h1>
      
      <Tabs defaultValue="script" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="script">Script</TabsTrigger>
          <TabsTrigger value="title">Title</TabsTrigger>
          <TabsTrigger value="thumbnail">Thumbnail</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <Textarea
            placeholder="Enter your video topic or idea..."
            className="min-h-[100px] mb-4"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>

        <TabsContent value="script">
          <Button 
            onClick={() => generateContent('script')} 
            disabled={loading}
            className="w-full"
          >
            {loading ? "Generating Script..." : "Generate Script"}
          </Button>
        </TabsContent>

        <TabsContent value="title">
          <Button 
            onClick={() => generateContent('title')} 
            disabled={loading}
            className="w-full"
          >
            {loading ? "Generating Title..." : "Generate Title"}
          </Button>
        </TabsContent>

        <TabsContent value="thumbnail">
          <Button 
            onClick={() => generateContent('thumbnail')} 
            disabled={loading}
            className="w-full"
          >
            {loading ? "Generating Thumbnail Ideas..." : "Generate Thumbnail Ideas"}
          </Button>
        </TabsContent>

        {result && (
          <div className="mt-6 p-4 bg-white rounded-lg border">
            <h3 className="font-semibold mb-2">Generated Content:</h3>
            <p className="whitespace-pre-wrap">{result}</p>
          </div>
        )}
      </Tabs>
    </div>
  )
}

export default ContentGenerator
