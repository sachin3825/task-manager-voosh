import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Input from './Input';
import Button from './Button';
import Form from './Form';
import { NavLink } from 'react-router-dom';
import { useSendOtpMutation, useSignupMutation } from '../../store/api/index';
import OtpInput from 'react-otp-input';
import GoogleAuthButton from './GoogleAuthButton';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { login } from '../../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const SignupForm = () => {
  const [sendOtpApi] = useSendOtpMutation();
  const [signupApi] = useSignupMutation();
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ mode: 'onChange' });

  const onSubmit = async (data) => {
    const loadingToastId = toast.loading('Processing...'); // Show loading toast

    try {
      if (!otpSent) {
        await sendOtpApi({ email: data.email }).unwrap();
        setOtpSent(true);
        toast.dismiss(loadingToastId); // Dismiss loading toast
        toast.success('OTP sent successfully!');
      } else {
        const signupData = { ...data, otp };
        const response = await signupApi(signupData).unwrap();
        toast.dismiss(loadingToastId); // Dismiss loading toast
        toast.success('Signup successful!');
        dispatch(login({ token: response.token, user: response.newUser }));
        navigate('/dashboard');
      }
    } catch (error) {
      toast.dismiss(loadingToastId); // Dismiss loading toast
      if (error?.data?.message === 'Invalid or expired OTP!') {
        setOtpSent(false);
        setOtp('');
        toast.error('Invalid or expired OTP! Please try again.');
      } else {
        toast.error('An error occurred. Please try again.');
      }
    }
  };

  const password = watch('password');

  return (
    <Form onSubmit={handleSubmit(onSubmit)} name={'Signup'}>
      {!otpSent && (
        <>
          <Input
            label="First Name"
            name="firstName"
            register={register}
            validation={{ required: 'First Name is required' }}
            errors={errors}
          />
          <Input
            label="Last Name"
            name="lastName"
            register={register}
            validation={{ required: 'Last Name is required' }}
            errors={errors}
          />
          <Input
            label="Email"
            name="email"
            type="email"
            register={register}
            validation={{
              required: 'Email is required',
              pattern: {
                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                message: 'Enter a valid email address',
              },
            }}
            errors={errors}
          />
          <Input
            label="Password"
            name="password"
            type="password"
            register={register}
            validation={{
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters long',
              },
            }}
            errors={errors}
          />
          <Input
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            register={register}
            validation={{
              validate: (value) => value === password || 'The passwords do not match',
            }}
            errors={errors}
          />
        </>
      )}

      {otpSent && (
        <div className="mt-4">
          <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
            Enter OTP
          </label>
          <OtpInput
            value={otp}
            onChange={setOtp}
            numInputs={6}
            renderInput={(props) => <input {...props} />}
            inputStyle={{
              width: '100%',
              marginTop: '1rem',
              padding: '1rem 0',
              border: '1px solid gray',
              borderRadius: '10%',
            }}
          />
        </div>
      )}

      <Button>{otpSent ? 'Verify OTP and Signup' : 'Send OTP'}</Button>

      <div className="text-center mt-4">
        <p className="mb-2">
          Already have an account?{' '}
          <NavLink to="/login" className="text-blue-500">
            Login
          </NavLink>
        </p>
        <GoogleAuthButton type="button" name={'Signup'} />
      </div>
    </Form>
  );
};

export default SignupForm;
