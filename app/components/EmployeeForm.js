
"use client";

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../lib/firebase';

export default function EmployeeForm({ onSuccess, onCancel }) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [images, setImages] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const onDrop = useCallback((acceptedFiles) => {
    // Only accept up to 5 images
    const newFiles = acceptedFiles.slice(0, 5 - images.length);
    
    if (newFiles.length > 0) {
      // Create preview URLs for display
      const newImages = newFiles.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file)
      }));
      
      setImages(prev => [...prev, ...newImages].slice(0, 5));
    }
  }, [images]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': []
    },
    maxFiles: 5,
    disabled: images.length >= 5 || loading,
  });
  
  const removeImage = (index) => {
    setImages(prev => {
      const newImages = [...prev];
      if (newImages[index]?.preview) {
        URL.revokeObjectURL(newImages[index].preview);
      }
      newImages.splice(index, 1);
      return newImages;
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!name || !role) {
      setError('Please fill in all fields');
      return;
    }
    
    if (images.length < 5) {
      setError('Please upload 5 reference images');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Upload images to Firebase Storage
      const uploadedUrls = [];
      
      for (let i = 0; i < images.length; i++) {
        const file = images[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `employees/${Date.now()}-${i}.${fileExt}`;
        const storageRef = ref(storage, fileName);
        
        await uploadBytes(storageRef, file);
        const downloadUrl = await getDownloadURL(storageRef);
        uploadedUrls.push(downloadUrl);
        
        // Update progress
        setUploadProgress(Math.round(((i + 1) / images.length) * 100));
      }
      
      // Save employee with image URLs
      const res = await fetch('/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          role,
          imageUrls: uploadedUrls,
        }),
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create employee');
      }
      
      const data = await res.json();
      
      // Call success callback with the new employee data
      onSuccess({
        _id: data.employeeId,
        name,
        role,
        imageUrls: uploadedUrls,
        createdAt: new Date(),
      });
      
      // Clean up previews
      images.forEach(file => {
        if (file.preview) URL.revokeObjectURL(file.preview);
      });
      
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">
          Employee Name
        </label>
        <input
          id="name"
          type="text"
          className="input-field"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={loading}
          required
        />
      </div>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="role">
          Role / Position
        </label>
        <input
          id="role"
          type="text"
          className="input-field"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          disabled={loading}
          required
        />
      </div>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Reference Images (5 required)
        </label>
        
        <div className="grid grid-cols-5 gap-3 mb-4">
          {Array.from({ length: 5 }).map((_, index) => {
            const image = images[index];
            
            return (
              <div 
                key={index} 
                className={`aspect-square rounded-lg overflow-hidden border-2 ${
                  image ? 'border-green-500' : 'border-gray-200'
                } relative`}
              >
                {image ? (
                  <>
                    <img 
                      src={image.preview} 
                      alt={`Reference ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                      disabled={loading}
                    >
                      ×
                    </button>
                  </>
                ) : (
                  <div className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-400">
                    {index + 1}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {images.length < 5 && (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer ${
              isDragActive ? 'border-primary bg-primary bg-opacity-5' : 'border-gray-300 hover:border-primary'
            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <input {...getInputProps()} />
            <p className="text-gray-600">
              {isDragActive ? 'Drop the images here' : 'Drag & drop images here, or click to select'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {5 - images.length} more {5 - images.length === 1 ? 'image' : 'images'} needed
            </p>
          </div>
        )}
      </div>
      
      {loading && (
        <div className="mb-6">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-primary h-2.5 rounded-full" 
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-1 text-center">
            Uploading... {uploadProgress}%
          </p>
        </div>
      )}
      
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn-primary"
          disabled={loading || images.length < 5 || !name || !role}
        >
          {loading ? 'Adding Employee...' : 'Add Employee'}
        </button>
      </div>
    </form>
  );
}
