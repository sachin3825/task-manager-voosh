import React from 'react';

const Form = ({ children, onSubmit, name }) => {
  return (
    <div className="max-w-md w-full mx-auto bg-white ">
      <h2 className="text-blue-500 mb-2 font-bold text-2xl">{name}</h2>
      <form
        onSubmit={onSubmit}
        className="space-y-4 shadow-lg rounded-lg p-8 border border-blue-400"
      >
        {children}
      </form>
    </div>
  );
};

export default Form;
