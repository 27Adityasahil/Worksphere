import { apiSlice } from './apiSlice';
export const payrollApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    generatePayroll: builder.mutation({
      query: (data) => ({
        url: '/payroll',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Employee'] as any,
    }),
    getAllPayrolls: builder.query({
      query: () => '/payroll',
      providesTags: ['Employee'] as any,
    }),
    getMyPayrolls: builder.query({
      query: () => '/payroll/me',
      providesTags: ['User'] as any,
    }),
    updatePayrollStatus: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/payroll/${id}/status`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Employee'] as any,
    }),
  }),
});
export const {
  useGeneratePayrollMutation,
  useGetAllPayrollsQuery,
  useGetMyPayrollsQuery,
  useUpdatePayrollStatusMutation,
} = payrollApiSlice;
