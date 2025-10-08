import React from "react";
import { FaDownload, FaSearchLocation, FaFileAlt, FaCheckCircle, FaMapMarkedAlt, FaCreditCard, FaUserCheck, FaUnlockAlt } from "react-icons/fa";
import Hero from "../component/HomeComponents/Hero";
import HomeTab from "../component/HomeComponents/HomeTab";
import Heros from "../component/HomeComponents/Hero2";
import FAQSection from "../component/HomeComponents/FAQSection";
import HomeCard from "../component/HomeComponents/HomeCard";


// নতুন সেকশন: ডাউনলোড প্রসেস
const DownloadProcess = () => {
  const steps = [
  {
    title: "মৌজা খুঁজুন",
    icon: <FaSearchLocation className="text-4xl text-blue-500 mb-4 mx-auto" />,
    desc: "আপনার প্রয়োজনীয় মৌজা খুঁজে বের করুন আমাদের সার্চ ফিচার ব্যবহার করে।"
  },
  {
    title: "ফাইল প্রিভিউ",
    icon: <FaFileAlt className="text-4xl text-green-500 mb-4 mx-auto" />,
    desc: "ফাইলের প্রিভিউ দেখে নিশ্চিত হন, তারপর পরবর্তী ধাপে যান।"
  },
  {
    title: "একাউন্ট যাচাই",
    icon: <FaUserCheck className="text-4xl text-indigo-500 mb-4 mx-auto" />,
    desc: "যদি আগের একাউন্ট থাকে তবে লগইন করুন, না থাকলে নতুন একাউন্ট রেজিস্ট্রেশন করুন।"
  },
  {
    title: "পারচেজ করুন",
    icon: <FaCreditCard className="text-4xl text-purple-500 mb-4 mx-auto" />,
    desc: "পেমেন্ট গেটওয়ের মাধ্যমে নিরাপদে আপনার ফাইল ক্রয় সম্পন্ন করুন।"
  },
  {
    title: "অ্যাক্সেস পান",
    icon: <FaUnlockAlt className="text-4xl text-yellow-500 mb-4 mx-auto" />,
    desc: "সফল পারচেজের পর আপনার জন্য ডাউনলোড অপশন আনলক হয়ে যাবে।"
  },
  {
    title: "ম্যাপ ডাউনলোড",
    icon: <FaMapMarkedAlt className="text-4xl text-red-500 mb-4 mx-auto" />,
    desc: "মাই ম্যাপস অপশন থেকে সহজেই আপনার ফাইল ডাউনলোড করুন।"
  }
];


  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 via-green-50 to-blue-50">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-12">ডাউনলোড প্রসেস</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {steps.map((step, idx) => (
            <div key={idx} className="bg-white p-8 rounded-lg shadow-lg hover:shadow-2xl transition-transform transform hover:-translate-y-2">
              {step.icon}
              <h3 className="text-xl font-semibold text-gray-700 mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// নতুন সেকশন: কেন BD Mouza?
const WhyBDMouza = () => {
  const features = [
    { title: "মৌজা ম্যাপ সংগ্রহ", desc: "আমাদের প্ল্যাটফর্মে ২.৫ লক্ষাধিক মৌজা ম্যাপ পাওয়া যায়।" },
    { title: "সহজ সার্চ", desc: "সহজ সার্চ ফিচার দিয়ে দ্রুত মৌজা খুঁজে বের করুন।" },
    { title: "ফাইল প্রিভিউ", desc: "ফাইল ডাউনলোডের আগে প্রিভিউ দেখে নিন।" },
    { title: "আপডেটেড তথ্য", desc: "নিয়মিত আপডেটেড তথ্য দিয়ে সর্বশেষ মৌজা ম্যাপ পেয়ে যান।" },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-12">কেন BD Mouza?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <div key={idx} className="bg-gray-50 p-6 rounded-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-1">
              <FaCheckCircle className="text-3xl text-green-500 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const HomePage = () => {
  return (
    <div className="w-full bg-gradient-to-br from-gray-50 via-green-50 to-blue-50">
      {/* <Hero /> */}
      <Heros />
      {/* <HomeTab /> */}
      <HomeCard />
      <DownloadProcess />
      <WhyBDMouza />
      <FAQSection />
    </div>
  );
};

export default HomePage;
