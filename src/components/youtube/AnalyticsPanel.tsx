
import { useState, useEffect } from 'react';
import { Eye, ThumbsUp, Clock, Users, TrendingUp, BarChart2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

export const AnalyticsPanel = () => {
  const [loading, setLoading] = useState(false);
  
  // Real applications would fetch this data from an API
  const [stats, setStats] = useState([
    { icon: Eye, label: 'Total Views', value: 'Loading...', change: '...' },
    { icon: ThumbsUp, label: 'Total Likes', value: 'Loading...', change: '...' },
    { icon: Clock, label: 'Watch Time', value: 'Loading...', change: '...' },
    { icon: Users, label: 'Subscribers', value: 'Loading...', change: '...' }
  ]);
  
  const [chartData, setChartData] = useState([]);
  const [topVideos, setTopVideos] = useState([]);

  useEffect(() => {
    // Simulating data loading
    setLoading(true);
    
    // In a real app, this would be an API call to get actual analytics data
    setTimeout(() => {
      setStats([
        { icon: Eye, label: 'Total Views', value: '0', change: '0%' },
        { icon: ThumbsUp, label: 'Total Likes', value: '0', change: '0%' },
        { icon: Clock, label: 'Watch Time', value: '0hrs', change: '0%' },
        { icon: Users, label: 'Subscribers', value: '0', change: '0%' }
      ]);
      
      setChartData([
        { name: 'Jan', views: 0, likes: 0 },
        { name: 'Feb', views: 0, likes: 0 },
        { name: 'Mar', views: 0, likes: 0 },
        { name: 'Apr', views: 0, likes: 0 },
        { name: 'May', views: 0, likes: 0 },
        { name: 'Jun', views: 0, likes: 0 },
        { name: 'Jul', views: 0, likes: 0 },
      ]);
      
      setTopVideos([]);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3 text-blue-500 mb-3">
              <stat.icon size={24} />
              <h3 className="font-medium">{stat.label}</h3>
            </div>
            <div className="flex items-end justify-between">
              <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              {stat.change && (
                <span className="text-sm text-gray-500">{stat.change}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center space-x-3 text-blue-500 mb-6">
          <TrendingUp size={24} />
          <h3 className="font-medium text-lg">Performance Trends</h3>
        </div>
        <div className="h-80">
          {chartData.length > 0 ? (
            <ChartContainer
              config={{
                views: {
                  label: "Views",
                  theme: {
                    light: "#3b82f6",
                    dark: "#60a5fa",
                  },
                },
                likes: {
                  label: "Likes",
                  theme: {
                    light: "#10b981",
                    dark: "#34d399",
                  },
                },
              }}
            >
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip
                  content={({ active, payload }) => (
                    <ChartTooltipContent active={active} payload={payload} />
                  )}
                />
                <Line
                  type="monotone"
                  dataKey="views"
                  stroke="var(--color-views)"
                  strokeWidth={2}
                  name="views"
                />
                <Line
                  type="monotone"
                  dataKey="likes"
                  stroke="var(--color-likes)"
                  strokeWidth={2}
                  name="likes"
                />
              </LineChart>
            </ChartContainer>
          ) : (
            <div className="flex justify-center items-center h-full bg-gray-50 rounded-lg">
              <p className="text-gray-500">No performance data available</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center space-x-3 text-blue-500 mb-5">
          <BarChart2 size={24} />
          <h3 className="font-medium text-lg">Top Performing Content</h3>
        </div>
        {topVideos.length > 0 ? (
          <div className="space-y-4">
            {topVideos.map((video, index) => (
              <div key={index} className="flex items-center justify-between border-b pb-3 last:border-0">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800 mb-1 line-clamp-1">{video.title}</h4>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="flex items-center mr-4">
                      <Eye size={14} className="mr-1" /> {video.views}
                    </span>
                    <span className="flex items-center">
                      <ThumbsUp size={14} className="mr-1" /> {video.engagement}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No video performance data available</p>
          </div>
        )}
      </div>
    </div>
  );
};
