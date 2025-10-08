import React from 'react';
import { Shield, CreditCard, RefreshCw, Lock, Calendar, ShoppingBag } from 'lucide-react';

const TermsConditionsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white ">
        <div className="relative bg-gradient-to-r from-green-600 via-green-700 to-emerald-800 px-4 py-16 md:py-24 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-0 right-0 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{animationDelay: '4s'}}></div>
        </div>
        
        <div className="relative max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-in-up">
            শর্তাবলী
          </h1>
          <p className="text-lg md:text-xl text-green-100 max-w-3xl mx-auto leading-relaxed animate-fade-in-up" style={{animationDelay: '0.3s'}}>
              এই ওয়েবসাইটটি ব্যবহার করার মাধ্যমে আপনি নিচের সকল শর্তাবলীতে সম্মত হচ্ছেন। অনুগ্রহ করে আমাদের সাইট ব্যবহার করার পূর্বে এই শর্তাবলী মনোযোগ সহকারে পড়ুন।
          </p>
        </div>
      </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="bg-white rounded-2xl  overflow-hidden">
          {/* Title Section */}
          

          {/* Terms Content */}
          <div className="px-6 md:px-8 py-8 space-y-8">
            
            {/* Service Section */}
            <div className="border-l-4 border-blue-500 pl-6">
              <div className="flex items-center mb-4">
                <ShoppingBag className="w-6 h-6 text-blue-600 mr-3" />
                <h3 className="text-xl md:text-2xl font-bold text-gray-800">
                  ১. 🛍️ সেবা সম্পর্কে
                </h3>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 md:p-6">
                <p className="text-gray-700 leading-relaxed">
                  <span className="font-semibold">bdmouza.com</span> একটি অনলাইন প্ল্যাটফর্ম যা নির্দিষ্ট ফি এর বিনিময়ে 
                  বাংলাদেশের বিভিন্ন জেলার <span className="font-semibold text-blue-700">মৌজা ম্যাপের PDF/JPG ফাইল</span> ডাউনলোডের সুযোগ প্রদান করে।
                </p>
              </div>
            </div>

            {/* Payment Section */}
            <div className="border-l-4 border-green-500 pl-6">
              <div className="flex items-center mb-4">
                <CreditCard className="w-6 h-6 text-green-600 mr-3" />
                <h3 className="text-xl md:text-2xl font-bold text-gray-800">
                  ২. 💳 পেমেন্ট ও মূল্য
                </h3>
              </div>
              <div className="bg-green-50 rounded-lg p-4 md:p-6 space-y-3">
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <p className="text-gray-700">আমাদের ওয়েবসাইটে দেওয়া প্রতিটি ফাইলের নির্ধারিত মূল্য রয়েছে।</p>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <p className="text-gray-700">আপনি মোবাইল ব্যাংকিং (Bkash) পেমেন্টের মাধ্যমে পেমেন্ট করতে পারবেন।</p>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <p className="text-gray-700">পেমেন্ট সম্পন্ন হওয়ার পর ফাইল তাৎক্ষণিকভাবে ডাউনলোডের জন্য প্রস্তুত থাকবে।</p>
                </div>
              </div>
            </div>

            {/* Refund Section */}
            <div className="border-l-4 border-red-500 pl-6">
              <div className="flex items-center mb-4">
                <RefreshCw className="w-6 h-6 text-red-600 mr-3" />
                <h3 className="text-xl md:text-2xl font-bold text-gray-800">
                  ৩. 🔄 রিফান্ড নীতি
                </h3>
              </div>
              <div className="bg-red-50 rounded-lg p-4 md:p-6 space-y-3">
                <div className="bg-red-100 border border-red-200 rounded-lg p-3">
                  <p className="text-red-800 font-semibold">
                    একবার ক্রয়কৃত ম্যাপ ফাইলের <span className="underline">কোনো রিফান্ড প্রদান করা হয় না</span>।
                  </p>
                </div>
                <p className="text-gray-700">
                  যদি আপনি ভুল ফাইল পেয়ে থাকেন বা ডাউনলোডে কোনো সমস্যা হয়, তাহলে আমাদের সাপোর্ট টিমের সাথে যোগাযোগ করুন।
                </p>
              </div>
            </div>

            {/* Privacy Section */}
            <div className="border-l-4 border-purple-500 pl-6">
              <div className="flex items-center mb-4">
                <Lock className="w-6 h-6 text-purple-600 mr-3" />
                <h3 className="text-xl md:text-2xl font-bold text-gray-800">
                  ৫. 🔐 গোপনীয়তা
                </h3>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 md:p-6">
                <p className="text-gray-700 leading-relaxed">
                  আপনার ব্যক্তিগত তথ্য সম্পূর্ণ নিরাপদ এবং আমরা তৃতীয় পক্ষের সাথে কোনোভাবেই শেয়ার করি না।
                </p>
              </div>
            </div>

            {/* Terms Update Section */}
            <div className="border-l-4 border-yellow-500 pl-6">
              <div className="flex items-center mb-4">
                <Calendar className="w-6 h-6 text-yellow-600 mr-3" />
                <h3 className="text-xl md:text-2xl font-bold text-gray-800">
                  ৬. 📅 শর্তাবলীর পরিবর্তন
                </h3>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4 md:p-6">
                <p className="text-gray-700 leading-relaxed">
                  আমরা সময়ে সময়ে আমাদের শর্তাবলী পরিবর্তন করতে পারি। নতুন আপডেট হলে তা আমাদের ওয়েবসাইটে প্রকাশ করা হবে।
                </p>
              </div>
            </div>

          </div>

        
        </div>

     
      </main>

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

export default TermsConditionsPage;