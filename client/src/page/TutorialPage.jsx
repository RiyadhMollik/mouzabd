import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { tutorialApi } from '../utils/api/CommonApi';
import { decodeToken } from '../utils/TokenDecoder';

// Custom hook for tutorial data
const useTutorialData = () => {
  return useQuery({
    queryKey: ['tutorials'],
    queryFn: async () => {
      const token = await tutorialApi();
      
      if (!token) {
        throw new Error('Could not retrieve token');
      }
      
      const decoded = decodeToken(token);
      
      if (!decoded) {
        throw new Error('Could not decode token');
      }
      
      return decoded;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// Loading skeleton component
const VideoListSkeleton = () => (
  <div className="space-y-4">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="p-3 rounded-lg animate-pulse">
        <div className="h-6 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>
    ))}
  </div>
);

const VideoPlayerSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-8 bg-gray-200 rounded mb-4 w-3/4"></div>
    <div className="aspect-video bg-gray-200 rounded-lg"></div>
  </div>
);

export default function TutorialPage() {
  const [selectedVideo, setSelectedVideo] = useState(null);
  
  const { data: decodedToken, isLoading, error, isError } = useTutorialData();
  
  // Memoize videos array to prevent unnecessary re-renders
  const videos = useMemo(() => decodedToken?.data || [], [decodedToken]);
  
  // Memoize current video to prevent unnecessary calculations
  const currentVideo = useMemo(() => {
    if (!videos.length) return null;
    return videos.find(video => video.id === selectedVideo) || videos[0];
  }, [videos, selectedVideo]);
  
  // Auto-select first video when data loads
  useMemo(() => {
    if (videos.length > 0 && !selectedVideo) {
      setSelectedVideo(videos[0].id);
    }
  }, [videos, selectedVideo]);

  // Early return for error state
  if (isError) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="text-xl text-red-500 mb-2">Error loading tutorials</div>
          <div className="text-gray-600">{error?.message}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 via-green-50 to-blue-50">
      <main className="container mx-auto p-4">
        <div className="flex flex-col-reverse lg:flex-row gap-6">
          {/* Video List */}
          <div className="lg:w-1/3 lg:h-[61vh] bg-white rounded-lg  p-4">
            <h2 className="text-xl font-bold mb-4">Available Videos</h2>
            <div className="space-y-4 max-h-[50vh] overflow-y-auto">
              {isLoading ? (
                <VideoListSkeleton />
              ) : (
                videos.map((video) => (
                  <VideoListItem
                    key={video.id}
                    video={video}
                    isSelected={selectedVideo === video.id}
                    onSelect={() => setSelectedVideo(video.id)}
                  />
                ))
              )}
            </div>
          </div>
          
          {/* Video Player */}
          <div className="lg:w-2/3 bg-white rounded-lg  p-4">
            {isLoading ? (
              <VideoPlayerSkeleton />
            ) : currentVideo ? (
              <VideoPlayer video={currentVideo} />
            ) : (
              <EmptyVideoState />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

// Memoized video list item component
const VideoListItem = ({ video, isSelected, onSelect }) => {
  // Strip HTML tags from description
  const cleanDescription = video.descriptions?.replace(/<[^>]+>/g, '') || '';
  console.log(video);
  
  return (
    <div
      className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
        isSelected
          ? 'bg-green-100 border-l-4 border-green-600'
          : 'hover:bg-gray-100'
      }`}
      onClick={onSelect}
    >
      <div className="flex flex-col sm:flex-row gap-3">
        <div>
          <h3 className="font-inter1 text-lg lg:text-2xl font-medium">
            {video.title}
          </h3>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
            {cleanDescription}
          </p>
        </div>
      </div>
    </div>
  );
};

// Memoized video player component
const VideoPlayer = ({ video }) => {
  // Convert YouTube URL to embed format
  const getEmbedUrl = (url) => {
    if (!url) return '';
    
    try {
      // Handle various YouTube URL formats
      let videoId = null;
      
      // Format: https://www.youtube.com/watch?v=VIDEO_ID
      if (url.includes('youtube.com/watch?v=')) {
        videoId = url.split('v=')[1]?.split('&')[0];
      }
      // Format: https://youtu.be/VIDEO_ID
      else if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1]?.split('?')[0];
      }
      // Format: https://www.youtube.com/shorts/VIDEO_ID
      else if (url.includes('youtube.com/shorts/')) {
        videoId = url.split('youtube.com/shorts/')[1]?.split('?')[0];
      }
      // Format: https://www.youtube.com/embed/VIDEO_ID
      else if (url.includes('youtube.com/embed/')) {
        return url; // Already in embed format
      }
      
      // If we found a video ID, return embed URL
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
      
      // Fallback: return original URL
      return url;
    } catch (error) {
      console.error('Error parsing video URL:', error);
      return url;
    }
  };

  const embedUrl = getEmbedUrl(video.video_url);
  
  return (
    <>
      <div className="mt-4">
        <h2 className="text-xl lg:text-2xl font-inter1 mb-2 font-bold">
          {video.title}
        </h2>
      </div>
      <div className="aspect-video bg-black rounded-lg mb-4 flex items-center justify-center">
        <iframe
          src={embedUrl}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full rounded-xl"
          loading="lazy"
        />
      </div>
    </>
  );
};

// Empty state component
const EmptyVideoState = () => (
  <div className="flex items-center justify-center h-64">
    <p className="text-gray-500 font-inter1">No videos available</p>
  </div>
);