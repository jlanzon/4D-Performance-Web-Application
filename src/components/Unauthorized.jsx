import React from "react";

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-8 rounded border shadow-lg max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-4">Unauthorized</h1>
        <p>You do not have permission to view this page.</p>
      </div>
    </div>
  );
};

export default Unauthorized;
