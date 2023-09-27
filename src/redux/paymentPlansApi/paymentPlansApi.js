import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const paymentPlansApi = createApi({
  reducerPath: 'paymentPlans',
  baseQuery: fetchBaseQuery({
    // baseUrl: 'http://192.168.18.131:3333/',
    baseUrl: 'http://127.0.0.1:3333/',
  }),
  endpoints: (builder) => ({
    getPaymentPlans: builder.query({
      query: () => ({
        url: 'paymentPlans',
        method: 'GET',
      }),
      providesTags: ['PaymentPlan'],
    }),

    addPaymentPlan: builder.mutation({
      query: (paymentPlan) => ({
        url: 'paymentPlans',
        method: 'POST',
        body: paymentPlan,
      }),
      invalidatesTags: ['PaymentPlan'],
    }),

    updatePaymentPlan: builder.mutation({
      query: (payload) => ({
        url: `paymentPlans/${payload.id}`,
        method: 'PUT',
        body: payload,
      }),
      invalidatesTags: ['PaymentPlan'],
    }),

    deletePaymentPlan: builder.mutation({
      query: (id) => ({
        url: `paymentPlans/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['PaymentPlan'],
    }),
  }),
});

export const {
  useGetPaymentPlansQuery,
  useAddPaymentPlanMutation,
  useUpdatePaymentPlanMutation,
  useDeletePaymentPlanMutation,
} = paymentPlansApi;

export { paymentPlansApi };
