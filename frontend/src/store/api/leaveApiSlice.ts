import { apiSlice } from './apiSlice';
export const leaveApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    submitLeave: builder.mutation({
      query: (data) => ({
        url: '/leaves',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['User'], 
    }),
    getMyLeaves: builder.query({
      query: () => '/leaves/me',
      providesTags: ['User'],
    }),
    getAllLeaves: builder.query({
      query: () => '/leaves',
      providesTags: ['Employee'],
    }),
    updateLeaveStatus: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/leaves/${id}/status`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Employee'],
    }),
  }),
});
export const {
  useSubmitLeaveMutation,
  useGetMyLeavesQuery,
  useGetAllLeavesQuery,
  useUpdateLeaveStatusMutation,
} = leaveApiSlice;
