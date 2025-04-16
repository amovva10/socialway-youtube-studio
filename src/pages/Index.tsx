
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { AnalyticsPanel } from "@/components/youtube/AnalyticsPanel";
import { SearchBox } from "@/components/youtube/SearchBox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, BarChart2, Rocket } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-50 to-white font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 space-y-8 overflow-auto">
          <div className="grid grid-cols-1 gap-6">
            <Card className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h1 className="text-2xl font-bold mb-2">YouTube Dashboard</h1>
                    <p className="opacity-90">Search and analyze YouTube videos with AI-powered insights</p>
                  </div>
                  <Rocket size={48} className="opacity-75" />
                </div>
              </CardContent>
            </Card>
          </div>
          
          <section>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Search YouTube
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SearchBox />
              </CardContent>
            </Card>
          </section>
          
          <section>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                  <BarChart2 className="h-5 w-5" />
                  Quick Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AnalyticsPanel />
              </CardContent>
            </Card>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Index;
