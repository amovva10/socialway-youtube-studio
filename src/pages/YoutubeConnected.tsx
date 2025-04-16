
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const YoutubeConnected = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [timeLeft, setTimeLeft] = useState(4);

  const channelName = searchParams.get('channel') || 'Unknown';
  const channelId = searchParams.get('id') || 'Unknown';

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    const redirect = setTimeout(() => {
      navigate('/');
    }, 4000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirect);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-white p-6">
      <div className="text-center space-y-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          🎉 Connected to YouTube channel: {channelName} (ID: {channelId})
        </h1>
        <p className="text-gray-600">
          Redirecting you to the dashboard in {timeLeft} seconds...
        </p>
      </div>
    </div>
  );
};

export default YoutubeConnected;
