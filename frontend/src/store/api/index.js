import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const GET = 'GET';
const POST = 'POST';
const PATCH = 'PATCH';
const DELETE = 'DELETE';

export const userApi = createApi({
  reducerPath: 'api', // Ensure this matches your reducer path
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://task-manager-voosh.adaptable.app/api/v1',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
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
    createTask: builder.mutation({
      query: (data) => ({
        url: '/task',
        method: POST,
        body: data,
      }),
    }),
    getAllTasks: builder.query({
      query: () => ({
        url: '/task',
        method: GET,
      }),
    }),
    getTaskById: builder.query({
      query: (id) => ({
        url: `/task/${id}`,
        method: GET,
        body: data,
      }),
    }),
    updateTask: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/task/${id}`,
        method: PATCH,
        body: data,
      }),
    }),
    deleteTask: builder.mutation({
      query: (id) => ({
        url: `/task/${id}`,
        method: DELETE,
      }),
    }),
    updateAvatar: builder.mutation({
      query: (data) => ({
        url: '/user/avatar',
        method: PATCH,
        body: data,
      }),
    }),
    getProfile: builder.query({
      query: () => ({
        url: '/user/me',
        method: GET,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useSendOtpMutation,
  useSignupMutation,
  useCreateTaskMutation,
  useGetAllTasksQuery,
  useGetTaskByIdQuery,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useUpdateAvatarMutation,
  useGetProfileQuery,
} = userApi;
