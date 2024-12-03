import { apiSlice } from "./apiSlice";

const PLANS_URL = "/plans";
const PACKAGES_URL = "/packages";
const CUSTOMER_URL = "/users";
const PROFILE_URL = "/profiles";
const HELP_URL = "/help";
export const customerApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllPlans: builder.query({
      query: ({ page, limit }) => {
        return {
          url: `${PLANS_URL}/getAllPackages?page=${page}&limit=${limit}`,
          method: "GET",
        };
      },
      providesTags: ["Plan"],
    }),
    getAllPackageFeatures: builder.query({
      query: ({ page, limit, search }) => {
        return {
          url:
            `/plans/getAllPackagesDetails` +
            `${page ? `?page=${page}` : ""}` +
            `${limit ? `&limit=${limit}` : ""}` +
            `${search ? `&search=${search}` : ""}`,
          method: "GET",
        };
      },
      providesTags: ["PlanFeatures"],
    }),
    createPackage: builder.mutation({
      query: ({ body }) => ({
        url: `${PLANS_URL}/createPackage`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["Plan", "PlanFeatures"],
    }),
    // deletePlan: builder.mutation({
    //   query: ({ id }) => ({
    //     url: `/plans/${id}`,
    //     method: "DELETE",
    //   }),
    //   invalidatesTags: ["Plan","PlanFeatures"],
    // }),
    createPlan: builder.mutation({
      query: ({ body }) => ({
        url: `${PLANS_URL}/createNewPlan`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["PlanFeatures", "Plan"],
    }),
    getUserCustomers: builder.query({
      query: ({ page, limit }) => ({
        url: `users/customers${page ? `?page=${page}` : ""}${
          limit ? `&limit=${limit}` : ""
        }`,
        method: "GET",
      }),
      providesTags: ["Customer"],
    }),
    updateCustomer: builder.mutation({
      query: ({ id, updatedCustomer }) => ({
        url: `users/customers/update/${id}`,
        method: "PUT",
        body: updatedCustomer,
      }),
      invalidatesTags: ["Customer"],
    }),
    enableSMPT: builder.mutation({
      query: ({ body }) => ({
        url: `users/customers/changeSMTP`,
        method: "PUT",
        body: body,
      }),
      invalidatesTags: ["Customer"],
    }),
    createCustomer: builder.mutation({
      query: ({ body }) => ({
        url: `${CUSTOMER_URL}/signup`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["Customer"],
    }),
    getCreateCategory: builder.query({
      query: ({ page, limit, search, pagination }) => ({
        url: `${HELP_URL}/categories${page ? `?page=${page}` : ""}${
          limit ? `&limit=${limit}` : ""
        }&search=${search}${pagination === false ? "&pagination=false" : ""}
        `,
        method: "GET",
      }),
      providesTags: ["Customer"],
    }),
    createCategory: builder.mutation({
      query: ({ body }) => ({
        url: `${HELP_URL}/categories`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["Customer"],
    }),
    updateCategory: builder.mutation({
      query: ({ id, updatedCategory }) => ({
        url: `${HELP_URL}/categories/${id}`,
        method: "PUT",
        body: updatedCategory,
      }),
      invalidatesTags: ["Customer"],
    }),
    deleteCategory: builder.mutation({
      query: ({ ids }) => ({
        url: `${HELP_URL}/categories`,
        method: "DELETE",
        body: { ids },
      }),
      invalidatesTags: ["Customer"],
    }),
    getHelp: builder.query({
      query: ({ page, limit }) => {
        return {
          url: `${HELP_URL}/help-supports${page ? `?page=${page}` : ""}${
            limit ? `&limit=${limit}` : ""
          }`,
          method: "GET",
        };
      },
      providesTags: ["Help"],
    }),
    deleteHelp: builder.mutation({
      query: ({ ids }) => ({
        url: `${HELP_URL}/help-supports`,
        method: "DELETE",
        body: { ids },
      }),
      invalidatesTags: ["Help"],
    }),
    updateHelp: builder.mutation({
      query: ({ id, updatedHelp }) => ({
        url: `${HELP_URL}/help-supports/${id}`,
        method: "PUT",
        body: updatedHelp,
      }),
      invalidatesTags: ["Help"],
    }),
    getCategoryQuestions: builder.query({
      query: ({ id, search }) => {
        const searchParam = search
          ? `?search=${encodeURIComponent(search)}`
          : "";

        return {
          url: `${HELP_URL}/help-supports-category/${id}${searchParam}`,
          method: "GET",
        };
      },
      providesTags: ["Help"],
    }),
    getCategoryAnswer: builder.query({
      query: ({ id }) => {
        return {
          url: `${HELP_URL}/help-supports/${id}`,
          method: "GET",
        };
      },
      providesTags: ["Help"],
    }),
    addHelp: builder.mutation({
      query: ({ body }) => ({
        url: `${HELP_URL}/help-supports`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["Help"],
    }),
    getAdminProfile: builder.query({
      query: ({
        id,
        page,
        limit,
        created,
        updated,
        search,
        customFilterOperation,
        customFilters,
        creationEndDate,
        updationEndDate,
        tags,
        updationDate,
        creationDate,
        viewId,
        sequence,
        statuses,
      }) =>
        `${PROFILE_URL}` +
        `${page ? `?page=${page}` : ""}` +
        `${limit ? `&limit=${limit}` : ""}` +
        `${created ? `&created=${created}` : ""}` +
        `${updated ? `&updated=${updated}` : ""}` +
        `${search ? `&search=${search}` : ""}` +
        `${
          customFilterOperation
            ? `&customFilterOperation=${customFilterOperation}`
            : ""
        }` +
        `${customFilters ? `&customFilters=${customFilters}` : ""}` +
        `${tags ? `&tags=${tags}` : ""}` +
        `${updationDate ? `&updationDate=${updationDate}` : ""}` +
        `${creationDate ? `&creationDate=${creationDate}` : ""}` +
        `${creationEndDate ? `&creationEndDate=${creationEndDate}` : ""}` +
        `${updationEndDate ? `&updationEndDate=${updationEndDate}` : ""}` +
        `${viewId ? `&viewId=${viewId}` : ""}` +
        `${sequence ? `&sequence=${sequence}` : ""}` +
        `${statuses ? `&statuses=${statuses}` : ""}`,
      method: "GET",
      providesTags: ["GetProfile"],
    }),
    getBlog: builder.query({
      query: ({ page, limit, pagination }) => ({
        url: `/blog/categories${page ? `?page=${page}` : ""}${
          limit ? `&limit=${limit}` : ""
        }${pagination === false ? "&pagination=false" : ""}
        `,
        method: "GET",
      }),
      providesTags: ["Blog"],
    }),
    createBlog: builder.mutation({
      query: ({ body }) => ({
        url: `/blog/categories`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["Blog"],
    }),
    updateBlog: builder.mutation({
      query: ({ id, body }) => ({
        url: `/blog/categories/${id}`,
        method: "PUT",
        body: body,
      }),
      invalidatesTags: ["Blog"],
    }),
    deleteBlog: builder.mutation({
      query: ({ ids }) => ({
        url: `/blog/categories`,
        method: "DELETE",
        body: { ids },
      }),
      invalidatesTags: ["Blog"],
    }),
    deleteByFiles: builder.mutation({
      query: ({ filenames }) => ({
        url: `/profiles/deleteByFilename`,
        method: "DELETE",
        body: { filenames },
      }),
      invalidatesTags: ["GetProfile"], 
    }),
    getAllAddedSummaries: builder.query({
      query: ({ page, limit, search }) => {
        return {
          url: `/profiles/getAllAddedSummaries${page ? `?page=${page}` : ""}${limit ? `&limit=${limit}` : ""}${search ? `&search=${search}` : ""}`,
          method: "GET",
        };
      },
      providesTags: ["AddedSummaries"],
    }),
    getBlogList: builder.query({
      query: ({ page, limit }) => ({
        url: `/blog/blogs${page ? `?page=${page}` : ""}${
          limit ? `&limit=${limit}` : ""
        }`,
        method: "GET",
      }),
      providesTags: ["BlogList"],
    }),
    createBlogList: builder.mutation({
      query: ({ body }) => ({
        url: `/blog/blogs/create`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["BlogList"],
    }),
    uploadFile: builder.mutation({
      query: ({ file, folder }) => ({
        url: `/uploads/local/upload?folder=${folder}`,
        method: "POST",
        body: file,
      }),
    }),
    deleteBlogList: builder.mutation({
      query: ({ ids }) => ({
        url: `/blog/blogs`,
        method: "DELETE",
        body: { ids },
      }),
      invalidatesTags: ["BlogList"],
    }),
    updateBlogList: builder.mutation({
      query: ({ id, body }) => ({
        url: `/blog/blogs/${id}`,
        method: "PUT",
        body: body,
      }),
      invalidatesTags: ["BlogList"],
    }),
    getAllFreeUsers: builder.query({
      query: ({ from, to }) => {
        return {
          url:
            `/analytics/getTotalFreePlanUsers` +
            `${to && from ? `?from=${from}` : ""}` +
            `${to ? `&to=${to}` : ""}`,
          method: "GET",
        };
      },
    }),
    getTotalPaidUsers: builder.query({
      query: ({ from, to }) => {
        return {
          url:
            `/analytics/getTotalPaidPlanUsers` +
            `${to && from ? `?from=${from}` : ""}` +
            `${to ? `&to=${to}` : ""}`,
          method: "GET",
        };
      },
    }),
    getTopPlans: builder.query({
      query: ({ from, to }) => {
        return {
          url:
            `/analytics/topPlans` +
            `${to && from ? `?from=${from}` : ""}` +
            `${to ? `&to=${to}` : ""}`,
          method: "GET",
        };
      },
    }),
    getPreferredPalns: builder.query({
      query: ({ from, to }) => {
        return {
          url:
            `/analytics/preferredPlans` +
            `${to && from ? `?from=${from}` : ""}` +
            `${to ? `&to=${to}` : ""}`,
          method: "GET",
        };
      },
      transformResponse: (response) => {
        // console.log("API Response:", response);
        return response.data; // Extract the data field
      },
    }),
    getTotalSales: builder.query({
      query: ({ from, to }) => {
        return {
          url:
            `/analytics/getTotalSales` +
            `${to && from ? `?from=${from}` : ""}` +
            `${to ? `&to=${to}` : ""}`,
          method: "GET",
        };
      },
    }),
    getPayouts: builder.query({
      query: ({ from, to }) => {
        return {
          url: `/analytics/getTotalPayouts${to && from ? `?from=${from}` : ""}${
            to ? `&to=${to}` : ""
          }`,
          method: "GET",
        };
      },
    }),
    getUnsubsriptions: builder.query({
      query: ({ from, to }) => {
        return {
          url: `/analytics/unsubscriptions${to && from ? `?from=${from}` : ""}${
            to ? `&to=${to}` : ""
          }`,
          method: "GET",
        };
      },
    }),

    deleteAllPlanPackages: builder.mutation({
      query: ({ id }) => ({
        url: `/plans/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["PlanFeatures", "Plan"],
    }),
    geoLocation: builder.query({
      query: () => {
        return {
          url: `/analytics/locations`,
          method: "GET",
        };
      },
    }),
    verifyEmail: builder.query({
      query: ({ id, token }) => {
        return {
          url: `/users/${id}/verify/${token}`,
          method: "GET",
        };
      },
    }),
    forgetPassword: builder.mutation({
      query: ({ body }) => {
        return {
          url: `/users/sendEmail/forgotPassword`,
          method: "POST",
          body: body,
        };
      },
    }),
    verifyEmailForget: builder.mutation({
      query: ({ body }) => {
        return {
          url: `/users/resetPassword`,
          method: "POST",
          body: body,
        };
      },
    }),
    AddCustomers: builder.mutation({
      query: ({ body }) => {
        return {
          url: `users/customers`,
          method: "POST",
          body: body,
        };
      },
      invalidatesTags: ["Customer"],
    }),
    deleteCustomers: builder.mutation({
      query: (ids) => ({
        url: `/users/customers/delete`,
        method: "DELETE",
        body: ids,
      }),
      invalidatesTags: ["Customer"],
    }),
    inviteAndResendCustomer: builder.mutation({
      query: ({ id }) => ({
        url: `users/customers/invite/${id}`,
        method: "POST",
      }),
      invalidatesTags: ["Customer"],
    }),
    deleteImport: builder.mutation({
      query: () => ({
        url: `profiles/deleteImportedLeads`,
        method: "DELETE",
      }),
      invalidatesTags: ["Customer", "GetProfile"],
    }),
  }),
});

export const {
  useGetAllPlansQuery,
  useCreatePackageMutation,
  useDeletePlanMutation,
  useCreatePlanMutation,
  useGetUserCustomersQuery,
  useUpdateCustomerMutation,
  useEnableSMPTMutation,
  useCreateCustomerMutation,
  useGetAdminProfileQuery,
  useCreateCategoryMutation,
  useGetCreateCategoryQuery,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useGetBlogQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
  useGetBlogListQuery,
  useAddHelpMutation,
  useGetHelpQuery,
  useLazyGetCategoryQuestionsQuery,
  useGetCategoryAnswerQuery,
  useDeleteHelpMutation,
  useUpdateHelpMutation,
  useCreateBlogListMutation,
  useUploadFileMutation,
  useDeleteBlogListMutation,
  useUpdateBlogListMutation,
  useGetAllFreeUsersQuery,
  useGetTotalPaidUsersQuery,
  useGetTopPlansQuery,
  useGetPreferredPalnsQuery,
  useGetTotalSalesQuery,
  useGetPayoutsQuery,
  useGetUnsubsriptionsQuery,
  useGetAllPackageFeaturesQuery,
  useDeleteAllPlanPackagesMutation,
  useGeoLocationQuery,
  useVerifyEmailQuery,
  useDeleteByFilesMutation ,
  useLazyVerifyEmailQuery,
  useForgetPasswordMutation,
  useVerifyEmailForgetMutation,
  useDeleteCustomersMutation,
  useInviteAndResendCustomerMutation,
  useAddCustomersMutation,
  useDeleteImportMutation,
  useGetAllAddedSummariesQuery
} = customerApiSlice;
