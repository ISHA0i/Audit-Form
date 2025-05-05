import React from 'react';

/**
 * Button component following our design system
 * 
 * @param {string} variant - 'primary', 'secondary', 'outlined', 'text'
 * @param {string} size - 'small', 'medium', 'large'
 * @param {boolean} fullWidth - Whether button takes full width of container
 * @param {function} onClick - Click handler
 * @param {node} children - Button content
 * @param {boolean} disabled - Disabled state
 * @param {string} type - Button type attribute 
 */
const Button = ({
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  onClick,
  children,
  disabled = false,
  type = 'button',
  ...props
}) => {
  // Size styles
  const sizeStyles = {
    small: {
      padding: '0.5rem 1rem',
      fontSize: '0.875rem',
    },
    medium: {
      padding: '0.75rem 1.5rem',
      fontSize: '1rem',
    },
    large: {
      padding: '1rem 2rem',
      fontSize: '1.125rem',
    },
  };

  // Variant styles
  const getVariantStyles = (variant) => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: 'var(--primary-dark)',
          color: 'var(--white)',
          border: 'none',
          boxShadow: 'var(--shadow-sm)',
          hover: {
            backgroundColor: 'var(--primary-medium)',
            transform: 'translateY(-1px)',
            boxShadow: 'var(--shadow-md)',
          },
        };
      case 'secondary':
        return {
          backgroundColor: 'var(--neutral-1)',
          color: 'var(--primary-dark)',
          border: 'none',
          hover: {
            backgroundColor: 'var(--neutral-2)',
            transform: 'translateY(-1px)',
          },
        };
      case 'outlined':
        return {
          backgroundColor: 'transparent',
          color: 'var(--primary-dark)',
          border: '1px solid var(--primary-dark)',
          hover: {
            backgroundColor: 'rgba(46, 65, 86, 0.05)',
          },
        };
      case 'text':
        return {
          backgroundColor: 'transparent',
          color: 'var(--primary-dark)',
          border: 'none',
          padding: '0.5rem 0.75rem',
          hover: {
            backgroundColor: 'rgba(46, 65, 86, 0.05)',
          },
        };
      default:
        return getVariantStyles('primary');
    }
  };

  const variantStyles = getVariantStyles(variant);
  const selectedSizeStyles = sizeStyles[size] || sizeStyles.medium;

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 500,
        borderRadius: '6px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'var(--transition-base)',
        width: fullWidth ? '100%' : 'auto',
        opacity: disabled ? 0.6 : 1,
        ...selectedSizeStyles,
        ...variantStyles,
      }}
      onMouseEnter={(e) => {
        if (!disabled && variantStyles.hover) {
          Object.entries(variantStyles.hover).forEach(([key, value]) => {
            e.currentTarget.style[key] = value;
          });
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled && variantStyles.hover) {
          Object.entries(variantStyles.hover).forEach(([key]) => {
            e.currentTarget.style[key] = variantStyles[key] || '';
          });
          // Reset transform
          e.currentTarget.style.transform = '';
        }
      }}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button; 