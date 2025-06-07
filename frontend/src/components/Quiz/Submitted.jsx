import React from 'react';

const Submitted = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-2xl p-8 text-center">
        <h1 className="text-2xl font-semibold text-red-600">Heyy!</h1>
        <p className="mt-2 text-gray-700">You have already submitted the quiz.</p>
      </div>
    </div>
  );
};

export default Submitted;
