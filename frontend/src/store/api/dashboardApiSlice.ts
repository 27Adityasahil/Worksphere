import { apiSlice } from './apiSlice';

export const dashboardApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAdminStats: builder.query({
      query: () => '/dashboard/admin',
      providesTags: ['Employee', 'User', 'Settings'] as any,
    }),
    getEmployeeStats: builder.query({
      query: () => '/dashboard/employee',
      providesTags: ['User'] as any,
    }),
  }),
});

export const {
  useGetAdminStatsQuery,
  useGetEmployeeStatsQuery,
} = dashboardApiSlice;
