
import { Eye, ThumbsUp, Clock, Users } from 'lucide-react';

export const AnalyticsPanel = () => {
  // Mock statistics for display
  const stats = [
    { icon: Eye, label: 'Total Views', value: '0', change: '+0%' },
    { icon: ThumbsUp, label: 'Total Likes', value: '0', change: '+0%' },
    { icon: Clock, label: 'Watch Time', value: '0hrs', change: '+0%' },
    { icon: Users, label: 'Demographics', value: '---', change: '' }
  ];

  return (
    <div className="space-y-4">
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
    </div>
  );
};
