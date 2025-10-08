import { useState } from "react";
import From from "./From";
import FeeNotice from "./FeeNotice";
import StatsSection from "./StatsSection";
import AdvancedSearchFrom from "./AdvancedSearchFrom";
import Guidelines from "./Guidelines";
// Tab component
const Tab = ({ id, icon, label, isActive, onClick }) => (
  <div
    onClick={() => onClick(id)}
    className={`flex flex-col justify-center items-center p-6 rounded w-40 lg:w-55 h-30 shadows cursor-pointer transition-colors ${
      isActive
        ? "bg-green-600 text-white"
        : "bg-white  border-gray-200 hover:bg-gray-50"
    }`}
  >
    <div className="text-4xl">{icon}</div>
    <div className="text-center mt-2 text-base lg:text-xl font-inter1">
      {label}
    </div>
  </div>
);

// TabNav component
const TabNav = ({ tabs, activeTab, setActiveTab }) => (
  <div className="flex flex-wrap justify-center p-4 gap-5 pt-8" data-aos="fade-right"
    data-aos-offset="20"
    data-aos-delay="20"
    data-aos-duration="1000"
    data-aos-easing="ease-in-out"
    data-aos-mirror="true"
    data-aos-once="false">
    {tabs.map((tab) => (
      <Tab
        key={tab.id}
        id={tab.id}
        icon={tab.icon}
        label={tab.label}
        isActive={activeTab === tab.id}
        onClick={setActiveTab}
      />
    ))}
  </div>
);

// TabContent component
const TabContent = ({ activeTab }) => {
  // Render appropriate content based on the active tab
  const renderTabContent = () => {
    switch (activeTab) {
      // case "ম্যাপ অনুসন্ধান":
      //   return (
      //     <div>
      //       <h2 className="text-2xl text-green-700 font-medium mb-4">
      //         {activeTab}
      //       </h2>
      //       <From />
      //     </div>
      //   );

      case "এডভান্স অনুসন্ধান":
        return (
          <div>
            <h2 className="text-lg lg:text-xl xl:text-2xl text-green-700 font-medium mb-4">
              এডভান্স অনুসন্ধানের তথ্য
            </h2>
            <AdvancedSearchFrom />
          </div>
        );

      case "নির্দেশিকা":
        return (
          <div>
            <h2 className="text-lg lg:text-xl xl:text-2xl text-green-700 font-medium mb-4">
              নির্দেশিকা তথ্য
            </h2>
            <Guidelines />
          </div>
        );

      default:
        return (
          <div>
            <h2 className="text-lg lg:text-xl xl:text-2xl text-green-700 font-medium mb-4">
              {activeTab}
            </h2>
            <div className="bg-gray-50 p-4 rounded text-center text-gray-600">
              {activeTab} এর তথ্য এখানে দেখানো হবে
            </div>
          </div>
        );
    }
  };

  return (
    <div className="p-6">
      {renderTabContent()}

      {/* Application button can be added here if needed */}
    </div>
  );
};
// FloatingButton component
const FloatingButton = ({ icon, bgColor, position, onClick }) => (
  <div className={`fixed right-6 ${position}`}>
    <button
      onClick={onClick}
      className={`${bgColor} text-white p-3 rounded-full shadow-lg hover:${bgColor.replace(
        "bg-",
        "bg-"
      )} transition-colors`}
    >
      {icon}
    </button>
  </div>
);

// Main component
export default function HomeTab() {
  // State
  const [activeTab, setActiveTab] = useState("এডভান্স অনুসন্ধান");

  // Tab data
  const tabs = [
    // {
    //   id: "ম্যাপ অনুসন্ধান",
    //   icon: "📋",
    //   label: "ম্যাপ অনুসন্ধান",
    // },
    {
      id: "এডভান্স অনুসন্ধান",
      icon: "📜",
      label: "এডভান্স অনুসন্ধান",
    },
    {
      id: "ফাইল আবেদন",
      icon: "🔍",
      label: "ফাইল আবেদন",
    },

    {
      id: "নির্দেশিকা",
      icon: "📋",
      label: "নির্দেশিকা",
    },
  ];

  
  // Chat handler

  return (
    <div className="bg-gradient-to-br from-gray-50 via-green-50 to-blue-50 min-h-screen lg:p-6">
      <div className="container mx-auto bg-white rounded-2xl  overflow-hidden">
        {/* Tab Navigation */}
        <TabNav tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Fee Notice */}
       {/* <FeeNotice /> */}

        {/* Tab Content Area */}
        <TabContent activeTab={activeTab} />

        {/* Stats Section */}
        <StatsSection />
      </div>

      {/* Floating Buttons */}
      {/* <FloatingButton 
        icon="↑" 
        bgColor="bg-green-700" 
        position="bottom-6" 
        onClick={scrollToTop} 
      /> */}
    </div>
  );
}
