import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause, Eye } from 'lucide-react';
import { decodeToken } from '../../utils/TokenDecoder';
import { getBlog } from '../../utils/api/CommonApi';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';

const HomeCard = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [slidesToShow, setSlidesToShow] = useState(3);
  const [selectedCard, setSelectedCard] = useState(null);

  // Responsive slidesToShow
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setSlidesToShow(1);
      } else if (width < 1224) {
        setSlidesToShow(2);
      } else {
        setSlidesToShow(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch blog data
  const { data: apiData } = useQuery({
    queryKey: ['Blog'],
    queryFn: async () => {
      const token = await getBlog();
      if (!token) throw new Error('Could not retrieve token');
      const decoded = decodeToken(token);
      if (!decoded) throw new Error('Could not decode token');
      return decoded;
    },
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });

  // Extract cards safely
  const getBlogData = () => {
    if (!apiData) return [];
    if (Array.isArray(apiData)) return apiData;
    if (apiData.data && Array.isArray(apiData.data)) return apiData.data;
    if (apiData.faqs && Array.isArray(apiData.faqs)) return apiData.faqs;
    if (apiData.items && Array.isArray(apiData.items)) return apiData.items;
    return [];
  };

  const cards = getBlogData();
  const maxSlide = Math.max(0, cards.length - slidesToShow);

  // Autoplay
  useEffect(() => {
    if (!isAutoPlaying || isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev >= maxSlide ? 0 : prev + 1));
    }, 7000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, isPaused, maxSlide]);

  return (
    <div className="py-8 px-4">
      <div className="container mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12" data-aos="fade-down">
          <h1 className="text-2xl md:text-3xl xl:text-4xl font-bold text-gray-800 mb-4">
            <span className="text-green-600">BD Mouza</span>
          </h1>
          <p className="text-gray-600 text-base md:text-lg max-w-4xl mx-auto leading-relaxed">
            অরিজিনাল মৌজা ম্যাপের পিডিএফ বা জেপিজি ফাইল ডাউনলোড করুন bdmouza.com থেকে।
          </p>
        </div>

        {/* Slider Section */}
        <div className="relative max-w-6xl mx-auto">
          <div
            className="relative overflow-hidden rounded-xl"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${(100 / slidesToShow) * currentSlide}%)`,
              }}
            >
              {cards.map((card, index) => (
                <div
                  key={card.id || index}
                  className="flex-shrink-0 px-2"
                  style={{ width: `${100 / slidesToShow}%` }}
                >
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all overflow-hidden"
                  >
                    <div className="relative aspect-square overflow-hidden">
                      <img
                        className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                        src={card.image}
                        alt={card.title}
                      />
                    </div>
                    <div className="p-5">
                      <h3
                        className="text-lg lg:text-xl font-bold text-gray-800 mb-3 line-clamp-2"
                        title={card.title}
                      >
                        {card.title}
                      </h3>
                      <button
                        onClick={() => setSelectedCard(card)}
                        className="flex items-center space-x-2 text-sm text-green-600 hover:text-green-700 font-semibold transition-colors"
                      >
                        <Eye size={18} />
                        <span>Preview</span>
                      </button>
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex xl:hidden justify-center mt-6 space-x-4">
            <button
              onClick={() =>
                setCurrentSlide((prev) => (prev <= 0 ? maxSlide : prev - 1))
              }
              className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
            >
              <ChevronLeft />
            </button>
            <button
              onClick={() =>
                setCurrentSlide((prev) => (prev >= maxSlide ? 0 : prev + 1))
              }
              className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
            >
              <ChevronRight />
            </button>
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="hidden p-2 bg-gray-100 rounded-full hover:bg-gray-200"
            >
              {isAutoPlaying ? <Pause /> : <Play />}
            </button>
          </div>
        </div>
      </div>

      {/* Popup Modal */}
      <AnimatePresence>
        {selectedCard && (
          <motion.div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 relative"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <button
                onClick={() => setSelectedCard(null)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
              >
                ✕
              </button>
              <h2 className="text-xl font-bold text-gray-800 mb-4">{selectedCard.title}</h2>
              <img
                src={selectedCard.image}
                alt={selectedCard.title}
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
              <div
                className="text-gray-600 text-base leading-relaxed"
                dangerouslySetInnerHTML={{ __html: selectedCard.content }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HomeCard;
