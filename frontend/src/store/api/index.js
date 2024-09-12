import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
const GET = 'GET';
const POST = 'POST';
const PATCH = 'PATCH';
const DELETE = 'DELETE';

export const userApi = createApi({
  reducerPath: 'movies',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3000/api/v1',
  }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: '/user/login',
        method: POST,
        body: data,
      }),
    }),
    signup: builder.mutation({
      query: (data) => ({
        url: '/user/signup',
        method: POST,
        body: data,
      }),
    }),
    sendOtp: builder.mutation({
      query: (data) => ({
        url: '/user/send-otp',
        method: POST,
        body: data,
      }),
    }),
  }),
});

export const { useLoginMutation, useSendOtpMutation, useSignupMutation } = userApi;
