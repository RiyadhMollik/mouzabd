import React from 'react';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-blue-50">
      {/* Header Section with Enhanced Design */}
      <div className="relative bg-gradient-to-r from-green-600 via-green-700 to-emerald-800 px-4 py-16 md:py-24 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-0 right-0 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{animationDelay: '4s'}}></div>
        </div>
        
        <div className="relative max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-in-up">
            আমাদের সম্পর্কে
          </h1>
          <p className="text-lg md:text-xl text-green-100 max-w-3xl mx-auto leading-relaxed animate-fade-in-up" style={{animationDelay: '0.3s'}}>
              বিডি মৌজা- বাংলাদেশের প্রথম ডিজিটাল মৌজা ম্যাপ প্ল্যাটফর্ম
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-12">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-8 mb-12 transition-all duration-300 transform ">
              <div className="flex items-center mb-6">
                <div className="w-1 h-12 bg-gradient-to-b from-green-500 to-emerald-600 rounded-full mr-4"></div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800">আমাদের পরিচয়</h2>
              </div>
              
              <p className="text-gray-700 leading-relaxed mb-6 text-lg md:text-xl font-light">
                bdmouza.com একটি আধুনিক ও নির্ভরযোগ্য অনলাইন প্ল্যাটফর্ম, যেখানে বাংলাদেশের যে কোনো জেলার মৌজা ম্যাপ এখন হাতের নাগালে। আমরা অত্যন্ত সহজ ও ব্যবহার-বান্ধব একটি ওয়েবসাইটের মাধ্যমে আপনাদেরকে মৌজা ম্যাপের PDF ও JPG ফাইল সরাসরি ডাউনলোড করার সুবিধা দিচ্ছি
              </p>

              <p className="text-gray-700 text-lg md:text-xl font-light leading-relaxed">
             আমাদের লক্ষ্য হচ্ছে বাংলাদেশের মৌজা ম্যাপ সম্পর্কিত তথ্যপ্রাপ্তিকে ডিজিটাল ও সবার জন্য সহজলভ্য করে তোলা। ভূমি মালিক, আইনজীবী, সার্ভেয়ার, রিয়েল এস্টেট ব্যবসায়ী কিংবা সাধারণ যে কেউ — bdMouza-তে খুব সহজে প্রয়োজনীয় মৌজা ম্যাপ খুঁজে পেতে পারেন।
              </p>
            </div>


<div className="bg-white p-8 rounded-2xl  transition-all duration-300 mb-10 transform">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl flex items-center justify-center mr-4">
                  <span className="text-white text-xl">🎯</span>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-800">আমাদের লক্ষ্য</h3>
              </div>
              
              <p className="text-gray-700 leading-relaxed mb-6 text-lg md:text-xl font-light">
                সাধারণ জনগণকে সহজে ও নির্ভরযোগ্য মৌজা ম্যাপের সেবা প্রদান, জমি ব্যবস্থাপনায় ডিজিটাল 
                রূপান্তর আনা এবং তথ্যপ্রযুক্তির ক্ষেত্রে এগিয়ে রাখার জন্য সহায়তা করা।
              </p>
            </div>

            {/* Why Choose bdmouza.com Section */}
            <div className="bg-white rounded-2xl p-8 mb-12 transition-all duration-300 transform ">
              <div className="flex items-center mb-6">
                <div className="w-1 h-12 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full mr-4"></div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800">কেন <strong>bdmouza.com</strong> কে বেছে নেবেন?</h2>
              </div>

              <div className="space-y-6">
                <div className="flex items-start group hover:bg-gradient-to-r hover:from-green-50 hover:to-blue-50 p-4 rounded-lg transition-all duration-300">
                  <div className="text-2xl mr-4 mt-1 group-hover:scale-110 transition-transform duration-300">✅</div>
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2">সারা দেশের ম্যাপ এক জায়গায়</h3>
                    <p className="text-gray-700 leading-relaxed text-base md:text-xl font-light">
                      আমরা নিয়ে এসেছি বাংলাদেশের প্রতিটি জেলার আপডেটেড মৌজা ম্যাপ — একদম সহজভাবে খুঁজে পাওয়া যায়।
                    </p>
                  </div>
                </div>

                <div className="flex items-start group hover:bg-gradient-to-r hover:from-green-50 hover:to-blue-50 p-4 rounded-lg transition-all duration-300">
                  <div className="text-2xl mr-4 mt-1 group-hover:scale-110 transition-transform duration-300">🔍</div>
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2">স্মার্ট সার্চ ও ফিল্টার</h3>
                    <p className="text-gray-700 leading-relaxed text-base md:text-xl font-light">
                      থানাভিত্তিক, জেলা, মৌজা নাম বা খতিয়ান নম্বর দিয়ে মাত্র এক ক্লিকে খুঁজে পান আপনার প্রয়োজনীয় ম্যাপ — সময় বাঁচান, ঝামেলা কমান।
                    </p>
                  </div>
                </div>

                <div className="flex items-start group hover:bg-gradient-to-r hover:from-green-50 hover:to-blue-50 p-4 rounded-lg transition-all duration-300">
                  <div className="text-2xl mr-4 mt-1 group-hover:scale-110 transition-transform duration-300">⚡</div>
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2">আল্ট্রা-ফাস্ট ডাউনলোড</h3>
                    <p className="text-gray-700 leading-relaxed text-base md:text-xl font-light">
                      ডাউনলোড করুন দ্রুততম সময়ে, একদম সহজভাবে। এছাড়া ডাউনলোড করা ফাইলগুলো আপনার ড্যাশবোর্ডে থাকবে।
                    </p>
                  </div>
                </div>

                <div className="flex items-start group hover:bg-gradient-to-r hover:from-green-50 hover:to-blue-50 p-4 rounded-lg transition-all duration-300">
                  <div className="text-2xl mr-4 mt-1 group-hover:scale-110 transition-transform duration-300">🛡️</div>
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2">নিরাপদ ও নির্ভরযোগ্য</h3>
                    <p className="text-gray-700 leading-relaxed text-base md:text-xl font-light">
                      আপনার কেনাকাটা এবং তথ্য সম্পূর্ণ নিরাপদ। আমরা ব্যবহার করি SSL এনক্রিপশন ও সিকিউরড পেমেন্ট গেটওয়ে।
                    </p>
                  </div>
                </div>

                <div className="flex items-start group hover:bg-gradient-to-r hover:from-green-50 hover:to-blue-50 p-4 rounded-lg transition-all duration-300">
                  <div className="text-2xl mr-4 mt-1 group-hover:scale-110 transition-transform duration-300">🖨️</div>
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2">প্রিন্ট-রেডি ফাইল</h3>
                    <p className="text-gray-700 leading-relaxed text-base md:text-xl font-light">
                      যে ফাইল আপনি পাবেন তা প্রিন্টের জন্য সম্পূর্ণ প্রস্তুত — ঝকঝকে কোয়ালিটি, স্পষ্ট লেখা।
                    </p>
                  </div>
                </div>

                <div className="flex items-start group hover:bg-gradient-to-r hover:from-green-50 hover:to-blue-50 p-4 rounded-lg transition-all duration-300">
                  <div className="text-2xl mr-4 mt-1 group-hover:scale-110 transition-transform duration-300">🔁</div>
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2">নিয়মিত আপডেট</h3>
                    <p className="text-gray-700 leading-relaxed text-base md:text-xl font-light">
                      আমরা নিয়মিত নতুন ম্যাপ যোগ করি এবং পুরাতন ফাইল আপডেট করে থাকি।
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          {/* <div className="lg:col-span-1 space-y-8">
           
           
          </div> */}
        </div>
      </div>

      {/* Bottom CTA Section */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-700 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            আজই শুরু করুন
          </h2>
          <p className="text-green-100 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            বাংলাদেশের সবচেয়ে নির্ভরযোগ্য মৌজা ম্যাপ সেবা ব্যবহার করুন
          </p>
          <button 
            className="bg-white text-green-700 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 "
            onClick={() => window.location.href = '/'}
          >
            ম্যাপ খুঁজুন
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default AboutUs;