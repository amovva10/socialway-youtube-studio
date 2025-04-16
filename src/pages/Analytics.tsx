
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { AnalyticsPanel } from "@/components/youtube/AnalyticsPanel";
import { AIInsightsPanel } from "@/components/youtube/AIInsightsPanel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart2, Lightbulb } from "lucide-react";

const Analytics = () => {
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
                    <h1 className="text-2xl font-bold mb-2">Analytics Dashboard</h1>
                    <p className="opacity-90">Track your channel performance and discover growth opportunities</p>
                  </div>
                  <BarChart2 size={48} className="opacity-75" />
                </div>
              </CardContent>
            </Card>
          </div>
          
          <section>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                  <BarChart2 className="h-5 w-5" />
                  Channel Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AnalyticsPanel />
              </CardContent>
            </Card>
          </section>
          
          <section>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  AI Growth Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AIInsightsPanel />
              </CardContent>
            </Card>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Analytics;
