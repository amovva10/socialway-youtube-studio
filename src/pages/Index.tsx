import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { VideoGrid } from "@/components/youtube/VideoGrid";
import { AnalyticsPanel } from "@/components/youtube/AnalyticsPanel";
import { SearchBox } from "@/components/youtube/SearchBox";
import { UploadForm } from "@/components/youtube/UploadForm";
import { useEffect, useState } from "react";

const Index = () => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Check for YouTube channel info in localStorage
    const storedInfo = localStorage.getItem('youtubeChannel');
    if (storedInfo) {
      try {
        const parsedInfo = JSON.parse(storedInfo);
        setIsConnected(parsedInfo.connected);
      } catch (e) {
        console.error("Error parsing channel info:", e);
      }
    }
  }, []);

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-50 to-white font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 space-y-8 overflow-auto">
          {!isConnected && (
            <div className="flex justify-center">
            </div>
          )}
          
          <section>
            <h2 className="text-xl font-semibold mb-6">Search YouTube</h2>
            <SearchBox />
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-6">Analytics Overview</h2>
            <AnalyticsPanel />
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-6">Upload Video</h2>
            <UploadForm />
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-6">Recent Videos</h2>
            <VideoGrid />
          </section>
        </main>
      </div>
    </div>
  );
};

export default Index;
