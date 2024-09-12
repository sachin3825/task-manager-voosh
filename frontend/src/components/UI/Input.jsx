import React from 'react';

const Input = ({ label, type = 'text', name, register, validation, errors }) => {
  return (
    <div className="mb-4">
      <input
        placeholder={label}
        type={type}
        {...register(name, validation)}
        className={`mt-1 block w-full px-3 py-2 border ${
          errors[name] ? 'border-red-500' : 'border-gray-300'
        } rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
      />
      {errors[name] && <p className="mt-2 text-sm text-red-600">{errors[name]?.message}</p>}
    </div>
  );
};

export default Input;
