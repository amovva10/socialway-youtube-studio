
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { UploadForm } from "@/components/youtube/UploadForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload as UploadIcon } from "lucide-react";

const Upload = () => {
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-50 to-white font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 space-y-6 overflow-auto">
          <div className="max-w-4xl mx-auto w-full">
            <Card className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white mb-6">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h1 className="text-2xl font-bold mb-2">Upload Video</h1>
                    <p className="opacity-90">Upload new content to your YouTube channel</p>
                  </div>
                  <UploadIcon size={48} className="opacity-75" />
                </div>
              </CardContent>
            </Card>
            
            <UploadForm />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Upload;
