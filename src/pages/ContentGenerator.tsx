
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { Header } from "@/components/layout/Header"
import { Sidebar } from "@/components/layout/Sidebar"
import { Sparkles, FilmIcon, Image, Type } from "lucide-react"

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

  const TabIcon = ({ type }: { type: string }) => {
    switch(type) {
      case 'script':
        return <FilmIcon className="w-4 h-4 mr-2" />
      case 'title':
        return <Type className="w-4 h-4 mr-2" />
      case 'thumbnail':
        return <Image className="w-4 h-4 mr-2" />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-50 to-white font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 overflow-auto">
          <div className="container mx-auto max-w-4xl">
            <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
              <h1 className="text-2xl font-bold mb-2 flex items-center">
                <Sparkles className="h-6 w-6 mr-2 text-blue-500" />
                Content Generator
              </h1>
              <p className="text-gray-500 mb-6">Generate high-quality YouTube content with AI assistance</p>
              
              <Tabs defaultValue="script" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="script" className="flex items-center justify-center">
                    <TabIcon type="script" />
                    Script
                  </TabsTrigger>
                  <TabsTrigger value="title" className="flex items-center justify-center">
                    <TabIcon type="title" />
                    Title
                  </TabsTrigger>
                  <TabsTrigger value="thumbnail" className="flex items-center justify-center">
                    <TabIcon type="thumbnail" />
                    Thumbnail
                  </TabsTrigger>
                </TabsList>

                <div className="mt-6">
                  <div className="mb-4">
                    <label htmlFor="prompt" className="text-sm font-medium text-gray-700 block mb-2">
                      Enter your video topic or idea:
                    </label>
                    <Textarea
                      id="prompt"
                      placeholder="Enter your video topic or idea..."
                      className="min-h-[100px] mb-4"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                    />
                  </div>
                </div>

                <TabsContent value="script">
                  <Button 
                    onClick={() => generateContent('script')} 
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600"
                  >
                    {loading ? "Generating Script..." : "Generate Script"}
                  </Button>
                </TabsContent>

                <TabsContent value="title">
                  <Button 
                    onClick={() => generateContent('title')} 
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600"
                  >
                    {loading ? "Generating Title..." : "Generate Title"}
                  </Button>
                </TabsContent>

                <TabsContent value="thumbnail">
                  <Button 
                    onClick={() => generateContent('thumbnail')} 
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600"
                  >
                    {loading ? "Generating Thumbnail Ideas..." : "Generate Thumbnail Ideas"}
                  </Button>
                </TabsContent>

                {result && (
                  <div className="mt-6 p-4 bg-white rounded-lg border">
                    <h3 className="font-semibold mb-2">Generated Content:</h3>
                    <div className="whitespace-pre-wrap bg-gray-50 p-4 rounded-md border">{result}</div>
                  </div>
                )}
              </Tabs>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default ContentGenerator
