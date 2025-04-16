
export const VideoGrid = () => {
  // Placeholder videos
  const videos = Array(6).fill({
    thumbnail: "https://picsum.photos/320/180",
    title: "Sample YouTube Video",
    views: "1.2K views",
    date: "2 days ago"
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {videos.map((video, index) => (
        <div key={index} className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full aspect-video object-cover"
          />
          <div className="p-4">
            <h3 className="font-medium text-gray-900 mb-1">{video.title}</h3>
            <div className="text-sm text-gray-500">
              {video.views} • {video.date}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
