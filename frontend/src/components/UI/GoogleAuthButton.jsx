import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useLoginMutation, useSignupMutation } from '../../store/api';
import { login } from '../../store/slices/authSlice';

const GoogleAuthButton = ({ name }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loginApi] = useLoginMutation();
  const [signupApi] = useSignupMutation();
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const googleAccessToken = tokenResponse.access_token;
        let response;
        if (name === 'Login') {
          response = await loginApi({ googleAccessToken }).unwrap();
        } else {
          response = await await signupApi({ googleAccessToken }).unwrap();
        }

        dispatch(login({ token: response.token, user: response.user }));
        navigate('/dashboard');
      } catch (error) {
        console.error('Google login failed: ', error);
      }
    },
    onError: () => {
      console.error('Google Login Failed');
    },
  });

  return (
    <button
      type="button"
      onClick={() => googleLogin()}
      className="bg-blue-500 text-white p-2 rounded"
    >
      {name} with Google
    </button>
  );
};

export default GoogleAuthButton;
