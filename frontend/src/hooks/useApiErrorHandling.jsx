import React from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { logout } from '../store/slices/authSlice';
import { useDispatch } from 'react-redux';
const useApiErrorHandling = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleApiError = (error) => {
    if (error?.status === 401) {
      toast.error('Session expired. Please log in again.');
      dispatch(logout());
      navigate('/login');
    } else {
      toast.error('An error occurred. Please try again.');
    }
  };

  return { handleApiError };
};

export default useApiErrorHandling;
