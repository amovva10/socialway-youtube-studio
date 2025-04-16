
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { ConnectButton } from "@/components/youtube/ConnectButton";
import { UploadForm } from "@/components/youtube/UploadForm";
import { VideoGrid } from "@/components/youtube/VideoGrid";
import { AnalyticsPanel } from "@/components/youtube/AnalyticsPanel";

const Index = () => {
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-50 to-white font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 space-y-8 overflow-auto">
          <div className="flex justify-center">
            <ConnectButton />
          </div>
          
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
