import React from "react";

import { Home } from "lucide-react";
import FAQSection from "../component/HomeComponents/FAQSection";

const FaqPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-500 py-10 sm:py-16 text-center text-white shadow-md">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
          প্রায় জিজ্ঞাসিত প্রশ্নাবলী
        </h1>
        <p className="text-lg sm:text-xl opacity-90 max-w-2xl mx-auto">
          আপনার সাধারণ প্রশ্নের উত্তরগুলো এখানে পাবেন।
        </p>

        {/* Breadcrumb */}
        <div className="flex items-center justify-center mt-4 text-sm">
          <Home className="w-4 h-4 mr-1" />
          <a href="/" className="hover:underline">
            হোম
          </a>
          <span className="mx-2">/</span>
          <span className="font-semibold">FAQ</span>
        </div>
      </div>

      {/* FAQ Section */}
      <main className="flex-1">
        <FAQSection></FAQSection>
      </main>

      
    </div>
  );
};

export default FaqPage;
