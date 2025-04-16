
import { Eye, ThumbsUp, Clock, Users, TrendingUp, BarChart2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock chart data for demo
const chartData = [
  { name: 'Jan', views: 1000, likes: 500 },
  { name: 'Feb', views: 2000, likes: 700 },
  { name: 'Mar', views: 1500, likes: 600 },
  { name: 'Apr', views: 3000, likes: 1200 },
  { name: 'May', views: 2500, likes: 900 },
  { name: 'Jun', views: 4000, likes: 1800 },
  { name: 'Jul', views: 3500, likes: 1500 },
];

export const AnalyticsPanel = () => {
  // More realistic statistics
  const stats = [
    { icon: Eye, label: 'Total Views', value: '12,546', change: '+12.5%' },
    { icon: ThumbsUp, label: 'Total Likes', value: '3,128', change: '+8.2%' },
    { icon: Clock, label: 'Watch Time', value: '425hrs', change: '+15.3%' },
    { icon: Users, label: 'Subscribers', value: '1,236', change: '+5.7%' }
  ];

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
                <span className="text-sm text-green-500">{stat.change}</span>
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
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="views" stroke="#3b82f6" strokeWidth={2} />
              <Line type="monotone" dataKey="likes" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center space-x-3 text-blue-500 mb-5">
            <BarChart2 size={24} />
            <h3 className="font-medium text-lg">Top Performing Content</h3>
          </div>
          <div className="space-y-4">
            {[
              { title: 'How to Master YouTube SEO', views: '4.2K', engagement: '9.8%' },
              { title: 'Advanced Video Editing Tutorial', views: '3.5K', engagement: '8.7%' },
              { title: '10 Tips for Growing Your Channel', views: '2.8K', engagement: '7.5%' }
            ].map((video, index) => (
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
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center space-x-3 text-blue-500 mb-5">
            <Users size={24} />
            <h3 className="font-medium text-lg">Audience Demographics</h3>
          </div>
          <div className="grid grid-cols-2 gap-y-4">
            <div>
              <h4 className="text-sm text-gray-500 mb-1">Age Range</h4>
              <p className="font-medium">18-34 (65%)</p>
            </div>
            <div>
              <h4 className="text-sm text-gray-500 mb-1">Gender</h4>
              <p className="font-medium">Male: 58% | Female: 42%</p>
            </div>
            <div>
              <h4 className="text-sm text-gray-500 mb-1">Top Country</h4>
              <p className="font-medium">United States (42%)</p>
            </div>
            <div>
              <h4 className="text-sm text-gray-500 mb-1">Language</h4>
              <p className="font-medium">English (85%)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
