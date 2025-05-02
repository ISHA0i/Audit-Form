import React, { useEffect, useState } from 'react';

/**
 * Toast notification component
 * @param {string} type - 'success', 'error', 'warning', 'info'
 * @param {string} message - The notification message
 * @param {number} duration - Duration in milliseconds
 * @param {function} onClose - Callback when toast is closed
 */
const Toast = ({ type = 'info', message, duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  
  // Color configurations based on type
  const configurations = {
    success: {
      backgroundColor: 'rgba(46, 65, 86, 0.95)',
      borderColor: 'var(--primary-dark)',
      icon: '✓'
    },
    error: {
      backgroundColor: 'rgba(220, 53, 69, 0.95)',
      borderColor: '#c82333',
      icon: '✕'
    },
    warning: {
      backgroundColor: 'rgba(255, 193, 7, 0.95)',
      borderColor: '#d39e00',
      icon: '⚠'
    },
    info: {
      backgroundColor: 'rgba(23, 162, 184, 0.95)',
      borderColor: '#117a8b',
      icon: 'ℹ'
    }
  };
  
  const config = configurations[type] || configurations.info;
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        onClose && onClose();
      }, 300); // Allow time for fade out animation
    }, duration);
    
    return () => clearTimeout(timer);
  }, [duration, onClose]);
  
  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        maxWidth: '350px',
        backgroundColor: config.backgroundColor,
        color: 'white',
        padding: '12px 16px',
        borderRadius: '6px',
        boxShadow: 'var(--shadow-md)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        borderLeft: `4px solid ${config.borderColor}`,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 0.3s ease, transform 0.3s ease',
        zIndex: 1000
      }}
    >
      <div 
        style={{ 
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold'
        }}
      >
        {config.icon}
      </div>
      <div>{message}</div>
      <button
        onClick={() => {
          setIsVisible(false);
          setTimeout(() => onClose && onClose(), 300);
        }}
        style={{
          backgroundColor: 'transparent',
          border: 'none',
          color: 'white',
          cursor: 'pointer',
          marginLeft: 'auto',
          padding: '4px',
          fontWeight: 'bold',
          fontSize: '16px'
        }}
      >
        ×
      </button>
    </div>
  );
};

export default Toast; 