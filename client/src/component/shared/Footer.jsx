// import React from 'react';
// import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
// import img from "../../assets/emouja.jpg"
// import { Link } from 'react-router-dom';
// const Footer = () => {
//   return (
//     <footer className="bg-gradient-to-br from-[#E4FFE2] to-[#D4F4D1] pt-16 pb-4 px-4 sm:px-6 lg:px-8">
//       <div className="container mx-auto">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
//           {/* Left Section - Logo and Description */}
//           <div className="lg:col-span-1">
//             <div className="flex items-center mb-6">
//               <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
//                 <img src={img} alt="" srcset="" />
//               </div>
//               <div className="ml-4">
//                 <h2 className="text-xl  lg:text-2xl font-bold text-gray-800 font-inter1">বিডি মৌজা</h2>
//                 <p className="text-sm lg:text-base text-gray-700 font-inter1">ম্যাপ সমাধান</p>
//               </div>
//             </div>
            
//             <p className="text-gray-700 leading-relaxed text-sm sm:text-base font-inter1 mb-6">
//              bdmouza.com একটি আধুনিক ও নির্ভরযোগ্য অনলাইন প্ল্যাটফর্ম, যেখানে বাংলাদেশের যে কোনো জেলার মৌজা ম্যাপ এখন হাতের নাগালে। আমরা অত্যন্ত সহজ ও ব্যবহার-বান্ধব একটি ওয়েবসাইটের মাধ্যমে আপনাদেরকে মৌজা ম্যাপের PDF ও JPG ফাইল সরাসরি ডাউনলোড করার সুবিধা দিচ্ছি এছাড়াও কাগজে প্রিন্ট হাডকপি নকশাগুলো সংগ্রাহ করতে পারবেন।
//             </p>
            
//             <div className="flex items-center gap-4 text-sm text-gray-600">
//               <div className="flex items-center gap-1">
//                 <div className="w-2 h-2 bg-green-500 rounded-full"></div>
//                 <span className='text-base lg:text-lg'>প্রিন্ট হাডকপির ফাইল</span>
//               </div>
//               <div className="flex items-center gap-1">
//                 <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
//                 <span className='text-base lg:text-lg'>পিডিএফ/জেপিজি ফাইল</span>
//               </div>
//             </div>
//           </div>

//           {/* Middle Section - Menu */}
//           <div className="lg:col-span-1">
//             <h3 className="text-lg lg:text-xl font-semibold text-gray-800 mb-6 relative">
//               মেনু
//               <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-green-400 to-blue-500 rounded-full"></div>
//             </h3>
//            <ul className="space-y-4">
//   {[
//     { name: 'সম্পর্কে', path: '/about' },
//     { name: 'যোগাযোগ', path: '/contactus' },
  
//     { name: 'সেবার শর্তাবলী', path: '/শর্তাবলী' },
//   ].map((item) => (
//     <li key={item.name}>
//       <Link
//         to={item.path}
//         className="text-gray-600 hover:text-gray-800 transition-all duration-300 hover:translate-x-2 inline-block relative group"
//       >
//         <span className="absolute left-0 top-1/2 w-0 h-0.5 bg-green-500 transform -translate-y-1/2 group-hover:w-4 transition-all duration-300"></span>
//         <span className="group-hover:ml-6 text-base lg:text-lg transition-all duration-300">{item.name}</span>
//       </Link>
//     </li>
//   ))}
// </ul>

//           </div>
          

//           {/* Right Section - Social Media and App Download */}
//           <div className="lg:col-span-1">
//             <h3 className="text-lg  lg:text-xl font-semibold text-gray-800 mb-6 relative">
//               আমাদের সাথে যুক্ত হোন
//               <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-green-400 to-blue-500 rounded-full"></div>
//             </h3>
            
//             {/* Social Media Icons */}
//             <div className="flex gap-4 mb-8">
//               <a 
//                 href="https://www.facebook.com/bdmouzaa" 
//                 className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-gray-400 hover:text-blue-600 hover:shadow-lg transition-all duration-300 hover:scale-110"
//               >
//                 <Facebook size={20} />
//               </a>
//               <a 
//                 href="#" 
//                 className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-gray-400 hover:text-blue-400 hover:shadow-lg transition-all duration-300 hover:scale-110"
//               >
//                 <Twitter size={20} />
//               </a>
//               <a 
//                 href="#" 
//                 className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-gray-400 hover:text-pink-600 hover:shadow-lg transition-all duration-300 hover:scale-110"
//               >
//                 <Instagram size={20} />
//               </a>
//               <a 
//                 href="#" 
//                 className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-gray-400 hover:text-blue-700 hover:shadow-lg transition-all duration-300 hover:scale-110"
//               >
//                 <Linkedin size={20} />
//               </a>
//             </div>

//             {/* Google Play Badge */}
//             {/* <div className="inline-block mb-6">
//               <a 
//                 href="#" 
//                 className="inline-block hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-xl"
//               >
//                 <div className="bg-black text-white px-6 py-3 rounded-lg flex items-center gap-3">
//                   <div className="w-8 h-8 bg-gradient-to-r from-blue-400 via-green-400 to-yellow-400 rounded-md flex items-center justify-center relative">
//                     <div className="w-4 h-4 bg-white rounded-sm transform rotate-45"></div>
//                   </div>
//                   <div>
//                     <div className="text-xs text-gray-300">ডাউনলোড করুন</div>
//                     <div className="text-sm font-semibold">গুগল প্লে</div>
//                   </div>
//                 </div>
//               </a>
//             </div> */}

//             {/* Contact Info */}
//             <div className="text-sm text-gray-600 space-y-2">
//               <div className="flex items-center gap-2">
//                 <div className="w-2 h-2 bg-green-500 rounded-full"></div>
//                 <span className='text-base lg:text-lg'>বাংলাদেশের ম্যাপ সমাধান</span>
//               </div>
              
//             </div>
//           </div>
//         </div>

//         {/* Copyright */}
//         <div className="mt-10 pt-8 border-t border-gray-300/50">
//           <div className="flex flex-col md:flex-row justify-between items-center gap-4">
//             <p className="text-gray-600 text-base text-center ">
//               © কপিরাইট ২০২৫ <Link to="/" className='text-green-700'>BDMouza</Link> সকল অধিকার সংরক্ষিত।
//             </p>
//             <div className="flex items-center gap-4 text-sm text-gray-500">
//               <span className='text-base ' >ভালোবাসা দিয়ে তৈরি</span>
//               <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
//               <span className='text-base'>বাংলাদেশে</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;
import React from "react";
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";
import { Link } from "react-router-dom";
import img from "../../assets/emouja.jpg";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* About Section */}
          <div>
            <div className="flex items-center mb-6">
              <div className="w-14 h-14 rounded-full overflow-hidden shadow-md border-2 border-green-500">
                <img src={img} alt="BD Mouza" className="w-full h-full object-cover" />
              </div>
              <div className="ml-3">
                <h2 className="text-xl font-bold">বিডি মৌজা</h2>
                <p className="text-sm text-gray-400">ম্যাপ সমাধান</p>
              </div>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed text-sm">
              bdmouza.com একটি আধুনিক ও নির্ভরযোগ্য অনলাইন প্ল্যাটফর্ম, যেখানে বাংলাদেশের যে কোনো জেলার মৌজা ম্যাপ হাতের নাগালে। 
              আমাদের মাধ্যমে সহজে PDF ও JPG ফাইল ডাউনলোড করতে পারবেন, এছাড়াও কাগজে প্রিন্ট হাডকপি সংগ্রহ করতে পারবেন।
            </p>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com/bdmouzaa"
                className="text-gray-400 hover:text-green-500 transform hover:scale-110 transition-all duration-300"
              >
                <Facebook className="h-6 w-6" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-green-400 transform hover:scale-110 transition-all duration-300"
              >
                <Twitter className="h-6 w-6" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-pink-500 transform hover:scale-110 transition-all duration-300"
              >
                <Instagram className="h-6 w-6" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-blue-600 transform hover:scale-110 transition-all duration-300"
              >
                <Linkedin className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">মেনু</h3>
            <ul className="space-y-3">
              {[
                { name: "সম্পর্কে", path: "/about" },
                { name: "যোগাযোগ", path: "/contactus" },
                { name: "সেবার শর্তাবলী", path: "/শর্তাবলী" },
                { name: "গুরুত্বপূর্ণ জিজ্ঞাসা", path: "/faqs" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="relative inline-block text-gray-400 hover:text-green-500 transition-colors duration-300 group"
                  >
                    <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-green-500 group-hover:w-full transition-all duration-300"></span>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6">যোগাযোগ</h3>
            <div className="space-y-4">
              <div className="flex items-center group hover:text-green-500 transition-colors duration-300">
                <Mail className="h-5 w-5 text-green-500 mr-3 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-gray-400 group-hover:text-green-500">support@bdmouza.com</span>
              </div>
              <div className="flex items-center group hover:text-green-500 transition-colors duration-300">
                <Phone className="h-5 w-5 text-green-500 mr-3 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-gray-400 group-hover:text-green-500">+8801337874935</span>
              </div>
              <div className="flex items-center group hover:text-green-500 transition-colors duration-300">
                <MapPin className="h-5 w-5 text-green-500 mr-3 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-gray-400 group-hover:text-green-500">ঢাকা, বাংলাদেশ</span>
              </div>
            </div>
            <div className="mt-6">
              <h4 className="font-medium mb-3">সাপোর্ট সময়</h4>
              <p className="text-gray-400 text-sm">
                রবিবার - বৃহস্পতিবার: সকাল ৯:০০ - সন্ধ্যা ৬:০০ <br />
                শুক্রবার: সকাল ৯:০০ - দুপুর ১২:০০
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © কপিরাইট ২০২৫ <Link to="/" className="text-green-500">BDMouza</Link> সকল অধিকার সংরক্ষিত।
            </p>
            
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


