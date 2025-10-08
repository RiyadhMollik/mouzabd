import React from 'react';

const TestPrivate = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Private Route Test</h1>
        <p className="text-gray-600">If you can see this, you are logged in!</p>
      </div>
    </div>
  );
};

export default TestPrivate;