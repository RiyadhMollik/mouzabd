import React, { useEffect, useState } from 'react';
import StatCard from './StatCard';
import { getToken } from '../../utils/api/CommonApi';
import { decodeToken } from '../../utils/TokenDecoder';

const StatsSection = () => {
  const [decodedToken, setDecodedToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null); // Clear previous errors
        
        const token = await getToken();
        
        if (!token) {
          setError('Could not retrieve token');
          return;
        }
        
        // Decode the token
        const decoded = decodeToken(token);
        
        if (!decoded) {
          setError('Could not decode token');
          return;
        }
        
        setDecodedToken(decoded);
      } catch (err) {
        console.error('Error fetching stats data:', err);
        setError(err.message || 'An error occurred while loading data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Show skeleton loading instead of spinner for better UX
  if (isLoading) {
    return (
      <div className="p-6 pb-8">
        <h2 className="text-3xl font-inter1 text-green-700 font-medium mb-4 text-center" data-aos="fade-right"
    data-aos-offset="20"
    data-aos-delay="20"
    data-aos-duration="1000"
    data-aos-easing="ease-in-out"
    data-aos-mirror="true"
    data-aos-once="false">
          তথ্যচিত্র
        </h2>
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-2 lg:gap-4"  data-aos="fade-up"
    data-aos-offset="20"
    data-aos-delay="20"
    data-aos-duration="1000"
    data-aos-easing="ease-in-out"
    data-aos-mirror="true"
    data-aos-once="false">
          {/* Skeleton loading cards */}
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white p-2 lg:p-6 rounded-lg shadow animate-pulse">
              <div className="flex items-center gap-1 lg:gap-4">
                <div className="w-8 h-8 lg:w-12 lg:h-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 lg:h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 lg:h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6 pb-8">
        <h2 className="text-3xl font-inter1 text-green-700 font-medium mb-4 text-center" data-aos="fade-right"
    data-aos-offset="20"
    data-aos-delay="20"
    data-aos-duration="1000"
    data-aos-easing="ease-in-out"
    data-aos-mirror="true"
    data-aos-once="false">
          তথ্যচিত্র
        </h2>
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg text-center">
          <p className="mb-2">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // No data state
  if (!decodedToken?.data?.[0]?.counter_item?.length) {
    return (
      <div className="p-6 pb-8">
        <h2 className="text-3xl font-inter1 text-green-700 font-medium mb-4 text-center"  data-aos="fade-right"
    data-aos-offset="20"
    data-aos-delay="20"
    data-aos-duration="1000"
    data-aos-easing="ease-in-out"
    data-aos-mirror="true"
    data-aos-once="false">
          তথ্যচিত্র
        </h2>
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-600 p-4 rounded-lg text-center">
          <p>No statistics data available</p>
        </div>
      </div>
    );
  }

  // Success state with data
  return (
    <div className="p-6 pb-8">
      <h2 className="text-3xl font-inter1 text-green-700 font-medium mb-4 text-center" data-aos="fade-right"
    data-aos-offset="20"
    data-aos-delay="20"
    data-aos-duration="1000"
    data-aos-easing="ease-in-out"
    data-aos-mirror="true"
    data-aos-once="false">
        তথ্যচিত্র
      </h2>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-4">
        {decodedToken.data[0].counter_item.map((stat, index) => {
          const colorClasses = [
            'bg-green-50 text-green-600',
            'bg-orange-50 text-orange-600',
            'bg-pink-50 text-pink-600',
            'bg-purple-50 text-purple-600'
          ];
          const colorClass = colorClasses[index % 4];
          
          return (
            <StatCard
              key={stat.id || index}
              icon={stat.icon}
              value={stat.number}
              label={stat.title}
              colorClass={colorClass}
            />
          );
        })}
      </div>
    </div>
  );
};

export default StatsSection;