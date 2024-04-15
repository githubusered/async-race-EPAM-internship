import React from 'react';
import './Input.css';
import { InputProps } from '../../utils/types';

const Input: React.FC<InputProps> = ({
  placeholder,
  type = 'text',
  value,
  onChange,
  id,
}) => {
  if (type === 'text') {
    return (
      <input type="text" placeholder={placeholder} className="styled-input" id={id} />
    );
  }
  if (type === 'color') {
    return (
      <input
        type="color"
        id={id}
        value={value}
        onChange={onChange}
        className="styled-inputForColorTypeInput"
      />
    );
  }
  return null;
};

export default Input;
