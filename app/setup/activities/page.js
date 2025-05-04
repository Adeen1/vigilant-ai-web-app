
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { withAuth } from '../../contexts/AuthContext';
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

const activityOptions = [
  { id: 'mobile', title: 'Mobile Phone Usage Detection', description: 'Identify unauthorized mobile phone usage in restricted areas.' },
  { id: 'presence', title: 'Presence Detection', description: 'Monitor workspace occupancy and attendance automatically.' },
  { id: 'sleepiness', title: 'Sleepiness Detection', description: 'Ensure alertness in critical safety environments.' },
  { id: 'smoking', title: 'Smoking Detection', description: 'Enforce no-smoking policies in designated areas.' },
  { id: 'weapons', title: 'Weapons Detection', description: 'Enhanced security with immediate threat alerts.' },
  { id: 'eating', title: 'Eating Detection', description: 'Ensure compliance with food safety regulations.' },
  { id: 'loitering', title: 'Loitering Detection', description: 'Identify unusual lingering in secure areas.' },
  { id: 'altercations', title: 'Physical Altercations Detection', description: 'Improve workplace safety with conflict alerts.' },
];

function ActivitiesSetup() {
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  
  // Check if user already has subscribed activities
  useEffect(() => {
    const checkSubscriptions = async () => {
      try {
        const res = await fetch('/api/subscriptions');
        if (!res.ok) throw new Error('Failed to fetch subscriptions');
        
        const data = await res.json();
        if (data.activities && data.activities.length > 0) {
          setSelectedActivities(data.activities);
        }
      } catch (err) {
        console.error('Error checking subscriptions:', err);
      }
    };
    
    checkSubscriptions();
  }, []);
  
  // Setup driver.js tour
  useEffect(() => {
    const driverObj = driver({
      showProgress: true,
      steps: [
        {
          element: '#activities-heading',
          popover: {
            title: 'Activity Subscription',
            description: 'Select the monitoring activities you want to enable for your organization.',
          }
        },
        {
          element: '.activity-card',
          popover: {
            title: 'Activity Options',
            description: 'Click on any activity to select or deselect it. You can choose multiple activities.',
          }
        },
        {
          element: '#submit-button',
          popover: {
            title: 'Continue Setup',
            description: 'After selecting your desired activities, click here to proceed to employee setup.',
          }
        }
      ]
    });
    
    // Start the tour
    driverObj.drive();
    
    return () => {
      driverObj.destroy();
    };
  }, []);
  
  const toggleActivity = (activityId) => {
    setSelectedActivities(prev => {
      if (prev.includes(activityId)) {
        return prev.filter(id => id !== activityId);
      } else {
        return [...prev, activityId];
      }
    });
  };
  
  const handleSubmit = async () => {
    if (selectedActivities.length === 0) {
      setError('Please select at least one activity');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activities: selectedActivities }),
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save activities');
      }
      
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-muted">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 id="activities-heading" className="text-3xl font-bold text-primary mb-8">
            Select Monitoring Activities
          </h1>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 p-3 rounded mb-6">
              {error}
            </div>
          )}
          
          <p className="text-gray-600 mb-8">
            Choose which activities you want to monitor in your workplace. 
            You can change these settings later.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {activityOptions.map((activity) => (
              <div
                key={activity.id}
                onClick={() => toggleActivity(activity.id)}
                className={`activity-card p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedActivities.includes(activity.id) 
                    ? 'border-primary bg-primary bg-opacity-10'
                    : 'border-gray-200 hover:border-primary hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-5 h-5 rounded-full mr-3 flex items-center justify-center ${
                    selectedActivities.includes(activity.id) ? 'bg-primary' : 'bg-gray-200'
                  }`}>
                    {selectedActivities.includes(activity.id) && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium">{activity.title}</h3>
                    <p className="text-sm text-gray-500">{activity.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-end">
            <button
              id="submit-button"
              className="btn-primary"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Continue to Dashboard'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAuth(ActivitiesSetup);
