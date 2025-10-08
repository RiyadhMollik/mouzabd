import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const ErrorPage = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 px-4">
      <div className="text-center max-w-md">
        <h1 className="text-7xl font-bold text-red-500">404</h1>
        <p className="text-2xl mt-4 font-semibold text-gray-800">Page Not Found</p>
        <p className="mt-2 text-gray-600">
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>

        <Link
          to="/"
          className="inline-flex items-center mt-6 px-5 py-3 text-white bg-green-600 hover:bg-green-700 rounded-lg transition"
        >
          <ArrowLeft className="mr-2" />
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
