import React from 'react';

const LoadingIndicator = ({ size = 'medium', color = 'var(--primary-dark)' }) => {
  const sizeMap = {
    small: '24px',
    medium: '40px',
    large: '60px'
  };

  const actualSize = sizeMap[size] || sizeMap.medium;

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px'
    }}>
      <div style={{
        width: actualSize,
        height: actualSize,
        borderRadius: '50%',
        border: `3px solid ${color}20`,
        borderTopColor: color,
        animation: 'spin 1s linear infinite'
      }} />
      <style jsx="true">{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingIndicator; 