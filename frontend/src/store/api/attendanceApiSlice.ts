import { apiSlice } from './apiSlice';
export const attendanceApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    clockIn: builder.mutation({
      query: (data) => ({
        url: '/attendance/clock-in',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['User', 'Employee'], 
    }),
    clockOut: builder.mutation({
      query: (data) => ({
        url: '/attendance/clock-out',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User', 'Employee'],
    }),
    getMyAttendance: builder.query({
      query: () => '/attendance/me',
      providesTags: ['User'],
    }),
    getAllAttendance: builder.query({
      query: () => '/attendance',
      providesTags: ['Employee'],
    }),
    getViolations: builder.query({
      query: () => '/attendance/violations',
      providesTags: ['Employee'],
    }),
  }),
});
export const {
  useClockInMutation,
  useClockOutMutation,
  useGetMyAttendanceQuery,
  useGetAllAttendanceQuery,
  useGetViolationsQuery,
} = attendanceApiSlice;
