import React from 'react';
import { useParams } from 'react-router-dom';

function UnitPage() {
  const { unitId } = useParams();
  
  return (
    <div className="flex h-screen justify-center items-center bg-gray-100">
      <div className="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-6">Unit Dashboard</h1>
        <p className="text-lg text-center text-gray-600">
          Unit ID: {unitId}
        </p>
        <p className="text-md text-center text-gray-500 mt-4">
          This page is under construction.
        </p>
      </div>
    </div>
  );
}

export default UnitPage;
