import React from "react";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center bg-gray-100">
      <h1 className="mb-4 text-5xl font-bold text-gray-800">404</h1>
      <p className="mb-8 text-xl text-gray-600">Page Not Found</p>
      <Link to="/" className="text-lg text-blue-500 hover:underline">
        Go Back to Home
      </Link>
    </div>
  );
}

export default NotFound;
