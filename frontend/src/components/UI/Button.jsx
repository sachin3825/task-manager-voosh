import React from 'react';

const Button = ({ children, type = 'submit', width = 'full', onClick }) => {
  return (
    <button
      type={type}
      className={`w-${width} bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
