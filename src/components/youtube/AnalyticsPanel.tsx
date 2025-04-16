
import { useState, useEffect } from 'react';
import { Eye, ThumbsUp, Clock, Users } from 'lucide-react';

export const AnalyticsPanel = () => {
  const [loading, setLoading] = useState(false);
  
  // Real applications would fetch this data from an API
  const [stats, setStats] = useState([
    { icon: Eye, label: 'Total Views', value: 'Loading...', change: '...' },
    { icon: ThumbsUp, label: 'Total Likes', value: 'Loading...', change: '...' },
    { icon: Clock, label: 'Watch Time', value: 'Loading...', change: '...' },
    { icon: Users, label: 'Subscribers', value: 'Loading...', change: '...' }
  ]);

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
    </div>
  );
};
