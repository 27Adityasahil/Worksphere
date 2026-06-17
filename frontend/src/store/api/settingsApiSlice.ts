import { apiSlice } from './apiSlice';
export const settingsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSettings: builder.query({
      query: () => '/settings',
      providesTags: ['Settings'] as any,
    }),
    updateSettings: builder.mutation({
      query: (data) => ({
        url: '/settings',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Settings'] as any,
    }),
  }),
});
export const {
  useGetSettingsQuery,
  useUpdateSettingsMutation,
} = settingsApiSlice;
