import React from 'react';

function FeeNotice() {
  const newsString =
    "🌍আপনাদের আরও ভালো সেবা দিতে BD Mouza সাইটে কিছু আপডেট চলছে, ফলে কিছু ফিচারে সাময়িক অসুবিধা হতে পারে। যেকোনো সমস্যা হলে WhatsApp বা কল করুন: +8801337874935 – BD Mouza টিম";

  return (
    <>
      <div className="px-4 sm:px-6 lg:px-8 bg-white ">
        <div className="flex items-center justify-between h-16">

          {/* Breaking News Ticker (Always Animating) */}
          <div className="relative overflow-hidden w-full mx-4">
            <div className="whitespace-nowrap ticker-slide text-green-500 font-semibold text-xl">
              {newsString}
            </div>
          </div>

          {/* Right Placeholder */}
          <div className="flex items-center space-x-3">{/* Add right content if needed */}</div>
        </div>
      </div>

      {/* CSS for sliding animation */}
      <style>{`
        @keyframes slide {
          0% {
            transform: translate3d(100%, 0, 0);
          }
          100% {
            transform: translate3d(-100%, 0, 0);
          }
        }

        .ticker-slide {
          display: inline-block;
          animation: slide 25s linear infinite;
        }
      `}</style>
    </>
  );
}

export default FeeNotice;
