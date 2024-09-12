import React from 'react';
import { useForm } from 'react-hook-form';
import Form from './UI/Form';
import Input from './UI/Input';
import Button from './UI/Button';
import { NavLink, useNavigate } from 'react-router-dom';
import GoogleAuthButton from './UI/GoogleAuthButton';
import { useLoginMutation } from '../store/api/index';
import { useDispatch } from 'react-redux';
import { login } from '../store/slices/authSlice';
import toast from 'react-hot-toast';

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loginApi] = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
  });

  const onSubmit = async (data) => {
    try {
      const response = await loginApi(data).unwrap();
      dispatch(login({ token: response.token, user: response.user }));
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      if (error?.data?.message === 'User does not exist!') {
        toast.error('User does not exist! Redirecting to signup...');
        navigate('/signup');
      } else if (error?.data?.message) {
        toast.error(error.data.message);
      } else {
        toast.error('Login failed. Please try again.');
      }
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)} name={'Login'}>
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

      <Button>Login</Button>

      <div className="text-center mt-4">
        <p className="mb-2">
          Don’t have an account?{' '}
          <NavLink to="/signup" className="text-blue-500">
            Signup
          </NavLink>
        </p>

        <GoogleAuthButton type="button" name={'Login'} />
      </div>
    </Form>
  );
};

export default LoginForm;
