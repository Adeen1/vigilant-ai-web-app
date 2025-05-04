
"use client";

import { useState } from 'react';

export default function EmployeeList({ employees }) {
  const [expandedEmployee, setExpandedEmployee] = useState(null);
  
  if (!employees || employees.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <p className="text-gray-500 text-center">No employees added yet.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {employees.map((employee) => (
        <div 
          key={employee._id} 
          className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
        >
          <div 
            className="p-4 flex items-center justify-between cursor-pointer"
            onClick={() => setExpandedEmployee(expandedEmployee === employee._id ? null : employee._id)}
          >
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mr-4 overflow-hidden">
                {employee.imageUrls && employee.imageUrls[0] ? (
                  <img src={employee.imageUrls[0]} alt={employee.name} className="w-full h-full object-cover" />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                )}
              </div>
              <div>
                <h3 className="font-medium">{employee.name}</h3>
                <p className="text-sm text-gray-500">{employee.role}</p>
              </div>
            </div>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-5 w-5 text-gray-400 transform transition-transform ${expandedEmployee === employee._id ? 'rotate-180' : ''}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          
          {expandedEmployee === employee._id && (
            <div className="p-4 pt-0 border-t border-gray-100">
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-600 mb-2">Reference Images</h4>
                <div className="grid grid-cols-5 gap-2">
                  {employee.imageUrls?.map((imageUrl, index) => (
                    <div key={index} className="w-full aspect-square rounded bg-gray-100 overflow-hidden">
                      <img src={imageUrl} alt={`Reference ${index + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <button className="text-sm text-gray-600 hover:text-primary">Edit</button>
                <button className="text-sm text-red-500 hover:text-red-700">Delete</button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
