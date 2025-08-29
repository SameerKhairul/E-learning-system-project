import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';

const DeadlineNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const { backendUrl, getToken } = useContext(AppContext);
  const { user } = useUser();

  const fetchUpcomingDeadlines = async () => {
    if (!user?.id) return;

    try {
      const token = await getToken();
      const { data } = await axios.get(
        `${backendUrl}/api/course/upcoming-deadlines/${user.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        setNotifications(data.notifications);
      }
    } catch (error) {
      console.error('Error fetching deadlines:', error);
    }
  };

  useEffect(() => {
    fetchUpcomingDeadlines();
    const interval = setInterval(fetchUpcomingDeadlines, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [user]);

  const formatDeadline = (deadline) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffMs = deadlineDate - now;
    const diffHours = diffMs / (1000 * 60 * 60);
    const diffMinutes = diffMs / (1000 * 60);
    
    if (diffMinutes < 60) {
      const exactMinutes = Math.floor(diffMinutes);
      return exactMinutes <= 0 ? 'Due now!' : `Due in ${exactMinutes} minutes`;
    } else if (diffHours < 24) {
      const hours = Math.floor(diffHours);
      const minutes = Math.floor(diffMinutes % 60);
      return minutes > 0 ? `Due in ${hours}h ${minutes}m` : `Due in ${hours} hours`;
    }
    return 'Due today';
  };

  const dismissNotification = (index) => {
    setNotifications(prev => prev.filter((_, i) => i !== index));
  };

  if (notifications.length === 0) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2 text-red-600 hover:text-red-800 transition-colors"
        title="Assignment Deadlines"
      >
        <svg 
          className="w-6 h-6" 
          fill="currentColor" 
          viewBox="0 0 20 20"
        >
          <path fillRule="evenodd" d="M10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2ZM11 6C11 5.44772 10.5523 5 10 5C9.44772 5 9 5.44772 9 6V10C9 10.5523 9.44772 11 10 11H13C13.5523 11 14 10.5523 14 10C14 9.44772 13.5523 9 13 9H11V6Z" clipRule="evenodd" />
        </svg>
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {notifications.length}
          </span>
        )}
      </button>

      {showNotifications && (
        <div className="absolute right-0 top-12 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          <div className="p-3 bg-red-50 border-b border-red-200">
            <h3 className="font-semibold text-red-800">Assignment Deadlines</h3>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {notifications.map((notification, index) => (
              <div key={index} className="p-3 border-b border-gray-100 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{notification.courseName}</p>
                    <p className="text-sm text-red-600 font-medium">
                      {formatDeadline(notification.deadline)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Due: {new Date(notification.deadline).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      dismissNotification(index);
                    }}
                    className="text-gray-400 hover:text-gray-600 ml-2"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="p-2 bg-gray-50 text-center">
            <button
              onClick={() => setShowNotifications(false)}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeadlineNotifications;