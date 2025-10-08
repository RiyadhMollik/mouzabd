import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, User, MessageSquare } from 'lucide-react';
import {  Facebook } from 'lucide-react';
import { Link } from 'react-router-dom';
export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setSubmitMessage('আপনার বার্তা সফলভাবে পাঠানো হয়েছে! আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      setIsSubmitting(false);
      
      setTimeout(() => {
        setSubmitMessage('');
      }, 5000);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-blue-50">
      {/* Header Section */}

      <div className="relative bg-gradient-to-r from-green-600 via-green-700 to-emerald-800 px-4 py-16 md:py-24 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-0 right-0 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{animationDelay: '4s'}}></div>
        </div>
        
        <div className="relative max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-in-up">
           যোগাযোগ করুন
          </h1>
          <p className="text-lg md:text-xl text-green-100 max-w-3xl mx-auto leading-relaxed animate-fade-in-up" style={{animationDelay: '0.3s'}}>
              আমাদের সাথে যোগাযোগ করতে দ্বিধা করবেন না
          </p>
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



      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-1 gap-8">
          {/* Contact Information */}
        
<div className="max-w-6xl mx-auto py-29">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Phone Card */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
                <Phone className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">ফোন করুন</h3>
              <p className="text-gray-600 text-base leading-relaxed">
                সবারার কথা বলতে চান? কল করুন আমাদের দেয়া নাম্বারে।
              </p>
              <div className="mt-4">
                <a 
                  href="tel:+880 1337-874935"
                  className="text-green-600 font-bold text-lg hover:text-green-700 transition-colors"
                >
                 +880 1337-874935
                </a>
                <p className="text-gray-500 text-sm mt-1">সকাল ৮টা - রাত ১১টা</p>
              </div>
            </div>
          </div>

          {/* Facebook Card */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <Facebook className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">ফেসবুক</h3>
              <p className="text-gray-600 text-base leading-relaxed">
               বিডি মৌজা  সম্পর্কে নিয়মিত আপডেট পেতে চুরে আসুন..
              </p>
              <div className="mt-4">
                <a href="https://www.facebook.com/bdmouzaa/" target='_blank'  className="bg-green-100 text-yellow-800 px-4 py-2 rounded-lg font-medium">
                  বিডি মৌজা 
                </a>
                <p className="text-gray-500 text-sm mt-3">সকল আপডেট জানতে ফলো করুন</p>
              </div>
            </div>
          </div>

          {/* Email Card */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300 md:col-span-2 lg:col-span-1">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                <Mail className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">ইমেইল করুন</h3>
              <p className="text-gray-600 text-base leading-relaxed">
                যেকোনো সমস্যা বিস্তারিত লিখে পাঠান আমাদের ইমেইলে - ২৪ ঘন্টার মধ্যে উত্তর পাবেন।
              </p>
              <div className="mt-4">
                <a 
                  href="mailto:support@bdmouza.io"
                  className="text-green-600 font-bold text-lg hover:text-green-700 transition-colors break-all"
                >
                  support@bdmouza.io
                </a>
                <p className="text-gray-500 text-sm mt-1">২৪ ঘন্টার মধ্যে উত্তর</p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional responsive section for mobile */}
        {/* <div className="mt-12 bg-white rounded-2xl p-6 shadow-lg border border-gray-100 lg:hidden">
          <h4 className="text-lg font-bold text-gray-800 mb-4 text-center">যোগাযোগের সময়</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-gray-50 rounded-lg">
              <Phone className="w-5 h-5 text-yellow-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">সকাল ৮টা - রাত ১১টা</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <Facebook className="w-5 h-5 text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">২৪/৭ অনলাইন</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <Mail className="w-5 h-5 text-orange-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">২৪ ঘন্টার মধ্যে</p>
            </div>
          </div>
        </div> */}
      </div>
 
          {/* Contact Form */}
          {/* <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl  p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">আমাদের সাথে যোগাযোগ করুন</h2>
              <p className="text-gray-600 mb-8">আপনার যেকোনো প্রশ্ন বা মতামত আমাদের কাছে পাঠান। আমরা ২৪ ঘন্টার মধ্যে উত্তর দেওয়ার চেষ্টা করব।</p>

              {submitMessage && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6">
                  {submitMessage}
                </div>
              )}

              <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        <User className="w-4 h-4 inline mr-2" />
                        পূর্ণ নাম *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="আপনার নাম লিখুন"
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        <Phone className="w-4 h-4 inline mr-2" />
                        ফোন নম্বর
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="০১৭৭৭১২৩৪৫৬"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      <Mail className="w-4 h-4 inline mr-2" />
                      ইমেইল ঠিকানা *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      <MessageSquare className="w-4 h-4 inline mr-2" />
                      বিষয় *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="আপনার বার্তার বিষয়"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      বার্তা *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                      placeholder="আপনার বিস্তারিত বার্তা এখানে লিখুন..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:ring-blue-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>পাঠানো হচ্ছে...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>বার্তা পাঠান</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
          </div> */}
        </div>

        {/* Map Section */}
        
      </div>
    </div>
  );
}