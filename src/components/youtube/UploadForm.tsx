
import { Upload } from 'lucide-react';

export const UploadForm = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h2 className="text-xl font-semibold mb-6">Upload New Video</h2>
      <form className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Video Title
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all"
            placeholder="Enter video title..."
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            rows={4}
            className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all"
            placeholder="Enter video description..."
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all"
            placeholder="gaming, tutorial, vlog..."
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Privacy Setting
          </label>
          <select className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all">
            <option value="public">Public</option>
            <option value="unlisted">Unlisted</option>
            <option value="private">Private</option>
          </select>
        </div>
        
        <button
          type="submit"
          className="w-full inline-flex items-center justify-center space-x-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Upload size={20} />
          <span>Upload Video</span>
        </button>
      </form>
    </div>
  );
};
