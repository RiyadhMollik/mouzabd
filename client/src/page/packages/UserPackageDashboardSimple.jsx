/**
 * Simple User Package Dashboard for Testing
 */
import React from 'react';

const UserPackageDashboardSimple = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">আমার প্যাকেজ ড্যাশবোর্ড</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">বর্তমান প্যাকেজ</h2>
          <div className="text-gray-600">
            <p>প্যাকেজ তথ্য লোড হচ্ছে...</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">প্যাকেজ ইতিহাস</h2>
          <div className="text-gray-600">
            <p>কোনো প্যাকেজ ইতিহাস পাওয়া যায়নি।</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPackageDashboardSimple;