import React, { useState } from 'react';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';

const StatCard = ({ icon, value, label, colorClass }) => {
  const [imgError, setImgError] = useState(false);

  // Detect visibility
  const { ref, inView } = useInView({
    triggerOnce: true, // only trigger the animation once
    threshold: 0.3, // 30% visible = trigger
  });

  return (
    <div ref={ref} className="bg-white p-2 lg:p-6 rounded-lg shadow-md transition-shadow duration-200">
      <div className="flex items-center gap-1 lg:gap-4">
        <div className={`p-2 lg:p-3 rounded-full ${colorClass}`}>
          {!imgError ? (
            <img
              src={icon}
              alt={label}
              className="w-4 h-4 lg:w-8 lg:h-8 object-contain"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-4 h-4 lg:w-8 lg:h-8 bg-gray-400 rounded flex items-center justify-center text-xs lg:text-sm text-white">
              ?
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-bold font-inter1 text-sm lg:text-xl text-gray-800 truncate">
            {inView && <CountUp end={parseInt(value || 0)} duration={5} />}
          </div>
          <div className="text-gray-600 font-inter1 text-xs lg:text-lg leading-tight">
            {label || 'No Label'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
