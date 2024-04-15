import React from 'react';
import { Link } from 'react-router-dom';
import './Button.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { ButtonProps } from '../../utils/types';

const Button: React.FC<ButtonProps> = ({
  navigateToLink,
  onClick,
  title,
  style,
  icon,
  disabled,
}) => {
  if (navigateToLink) {
    return (
      <div>
        <Link to={navigateToLink} className="btn" style={style}>
          {title}
        </Link>
      </div>
    );
  }
  if (onClick) {
    return (
      <div>
        <button
          type="button"
          onClick={onClick}
          className={`btn ${disabled ? 'disabled' : ''}`}
          style={style}
        >
          {title}
          {icon && <FontAwesomeIcon icon={icon} />}
        </button>
      </div>
    );
  }
  return null;
};
export default Button;
