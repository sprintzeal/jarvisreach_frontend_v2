import { Update } from "@mui/icons-material";
import { apiSlice } from "./apiSlice";

const CUSTOMER_URL = "/users";
const PROFILE_URL = "/profiles";
const FOLDERS_URL = "/folders";
const VIEW_URL = "/views";

export const customerApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: ({ body }) => ({
        url: `${CUSTOMER_URL}/signin`,
        method: "POST",
        body: body,
      }),
    }),
    logout: builder.query({
      query: () => `${CUSTOMER_URL}/signout`,
      method: "GET",
    }),
    loginWithGoogle: builder.mutation({
      query: ({ body }) => ({
        url: `${CUSTOMER_URL}/login-with-google`,
        method: "POST",
        body,
      }),
    }),
    loginWithLinkedIn: builder.mutation({
      query: ({ body }) => ({
        url: `${CUSTOMER_URL}/login-with-linkedin`,
        method: "POST",
        body,
      }),
    }),

    signup: builder.mutation({
      query: ({ body }) => ({
        url: `${CUSTOMER_URL}/signup`,
        method: "POST",
        body: body,
      }),
    }),
    checkData: builder.query({
      query: () => `/users/userData`,
      method: "GET",
      providesTags: ["UserUpdate"],
    }),
    editUser: builder.mutation({
      query: ({ body }) => ({
        url: `${CUSTOMER_URL}/customers/update`,
        method: "PUT",
        body: body,
      }),
      invalidatesTags: ["UserUpdate"],
    }),
    editEmail: builder.mutation({
      query: ({ body }) => ({
        url: `${CUSTOMER_URL}/customers/update-email`,
        method: "PUT",
        body: body,
      }),
      invalidatesTags: ["UserUpdate"],
    }),
    editPassword: builder.mutation({
      query: ({ body }) => ({
        url: `${CUSTOMER_URL}/customers/reset-password`,
        method: "PUT",
        body: body,
      }),
      invalidatesTags: ["UserUpdate"],
    }),
    restAccount: builder.mutation({
      query: ({ body }) => ({
        url: `${CUSTOMER_URL}/customers/reset-account`,
        method: "PUT",
        body: body,
      }),
      invalidatesTags: ["UserUpdate"],
    }),
    deleteAccount: builder.mutation({
      query: ({ body }) => ({
        url: `${CUSTOMER_URL}/customers`,
        method: "DELETE",
        body: body,
      }),
      invalidatesTags: ["UserUpdate"],
    }),
    getProduct: builder.query({
      query: () => `${PROFILE_URL}`,
      method: "GET",
      invalidatesTags: ["UserUpdate"],
    }),
    getProfileFolders: builder.query({
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
        `${PROFILE_URL}/folder/${id}` +
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
      invalidatesTags: ["UserUpdate"],
    }),
    addNoteAndTag: builder.mutation({
      query: ({ body, leadId }) => ({
        url: `${PROFILE_URL}/tags/createTag/${leadId ? leadId : ""}`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["GetProfile", "GetTags", "UserUpdate"],
    }),
    updateTag: builder.mutation({
      query: ({ body, id }) => ({
        url: `${PROFILE_URL}/tags/addnotesortags/${id}`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["GetProfile", "GetTags", "UserUpdate"],
    }),
    getProfileFolderName: builder.query({
      query: () => `${FOLDERS_URL}`,
      method: "GET",
      providesTags: ["FolderName"],
      invalidatesTags: ["UserUpdate"],
    }),
    postProfileFolder: builder.mutation({
      query: ({ body }) => ({
        url: `${FOLDERS_URL}`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: [
        "FolderName",
        "GetProfile",
        "UserUpdate",
        "PlansFeatureInfo",
      ],
    }),

    getFolderView: builder.query({
      query: () => `${VIEW_URL}`,
      method: "GET",
      invalidatesTags: ["UserUpdate", "GetProfile"],
    }),
    deleFolder: builder.mutation({
      query: ({ id }) => ({
        url: `${FOLDERS_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        "FolderName",
        "GetProfile",
        "UserUpdate",
        "PlansFeatureInfo",
      ],
    }),
    editFolder: builder.mutation({
      query: ({ body, id }) => ({
        url: `${FOLDERS_URL}/${id}`,
        method: "PUT",
        body: body,
      }),
      invalidatesTags: [
        "FolderName",
        "GetProfile",
        "UserUpdate",
        "PlansFeatureInfo",
      ],
    }),
    getViewColumns: builder.query({
      query: ({ id }) => `${VIEW_URL}/columns/${id}`,
      method: "GET",
      providesTags: ["GetColumns"],
      invalidatesTags: ["UserUpdate", "GetProfile"],
    }),
    updateColumn: builder.mutation({
      query: ({ body, id }) => ({
        url: `${VIEW_URL}/${id}`,
        method: "PUT",
        body: body,
      }),
      invalidatesTags: ["GetColumns", "UserUpdate"],
    }),
    getExportSettings: builder.query({
      query: () => "/exports/exports-settings",
      method: "GET",
      invalidatesTags: ["UserUpdate", "GetProfile"],
    }),
    postCreateExport: builder.mutation({
      query: ({ body }) => ({
        url: "/exports/create-export",
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["UserUpdate", "GetProfile"],
    }),
    getExportData: builder.query({
      query: ({ page, limit }) =>
        "/exports/" +
        `${page ? `?page=${page}` : ""}` +
        `${limit ? `&limit=${limit}` : ""}`,
      method: "GET",
      invalidatesTags: ["UserUpdate", "GetProfile"],
    }),
    downloadExport: builder.mutation({
      query: ({ body }) => ({
        url: "exports/download-export",
        method: "POST",
        body: body,
      }),
    }),
    teamInvitation: builder.mutation({
      query: ({ body }) => ({
        url: "/team/send-invitation",
        method: "POST",
        body: body,
      }),
    }),
    getAllTags: builder.query({
      query: ({ search, ids }) =>
        `${PROFILE_URL}/tags/getallTags` +
        `${search ? `?name=${search}` : ""}` +
        `${ids && search ? `&ids=${ids}` : ids ? `?ids=${ids}` : ""}`,
      method: "GET",
      providesTags: ["GetTags"],
      invalidatesTags: ["UserUpdate", "GetProfile"],
    }),
    getStatuses: builder.query({
      query: () => `leadmanager/status/getAllStatuses`,
      method: "GET",
      invalidatesTags: ["UserUpdate"],
    }),
    updateStatus: builder.mutation({
      query: ({ body }) => ({
        url: `leadmanager/status/updateStatus`,
        method: "PUT",
        body: body,
      }),
      invalidatesTags: ["GetProfile", "UserUpdate"],
    }),
    moveToFolder: builder.mutation({
      query: ({ body }) => ({
        url: `${PROFILE_URL}/moveToFolder`,
        method: "PUT",
        body: body,
      }),
      invalidatesTags: ["GetProfile", "UserUpdate"],
    }),
    deleteLead: builder.mutation({
      query: ({ body }) => ({
        url: `${PROFILE_URL}/deleteLeads`,
        method: "DELETE",
        body: body,
      }),
      invalidatesTags: ["GetProfile", "UserUpdate"],
    }),
    profileTagsAndUntags: builder.mutation({
      query: ({ body }) => ({
        url: `${PROFILE_URL}/tags/multiple/tagUntag`,
        method: "PUT",
        body: body,
      }),
      invalidatesTags: ["GetProfile", "UserUpdate"],
    }),
    getTeam: builder.query({
      query: () => "/team/getAllTeam",
      method: "GET",
      providesTags: ["GetTeam"],
    }),
    DeleteTeamMember: builder.mutation({
      query: ({ id }) => ({
        url: `/team/deleteMember/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["GetTeam"],
    }),
    profileMultipleStatus: builder.mutation({
      query: ({ body }) => ({
        url: `${PROFILE_URL}/multiple/status/updateStatus`,
        method: "PUT",
        body: body,
      }),
      invalidatesTags: ["GetProfile"],
    }),
    updateProfile: builder.mutation({
      query: ({ body, id }) => ({
        url: `${PROFILE_URL}/update/${id}`,
        method: "PUT",
        body: body,
      }),
      invalidatesTags: ["GetProfile", "UserUpdate"],
    }),
    getAllSeePlans: builder.query({
      query: ({ duration }) =>
        `/plans/getPlans?${duration ? `duration=${duration}` : ""}`,
      method: "GET",
      providesTags: ["SeePlans"],
      invalidatesTags: ["UserUpdate"],
    }),
    getPlansFeatureInfo: builder.query({
      query: ({ id }) => `/plans/featuresUsed/${id}`,
      method: "GET",
      providesTags: ["PlansFeatureInfo"],
    }),
    getSubscriptionInfo: builder.query({
      query: () => "plans/subscription/info",
      method: "GET",
      providesTags: ["SubscriptionInfo"],
      invalidatesTags: ["UserUpdate"],
    }),
    getPlans: builder.mutation({
      query: ({ body }) => ({
        url: "plans/change/userplan",
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["SeePlans", "SubscriptionInfo", "UserUpdate"],
    }),
    getAllPlans: builder.query({
      query: ({ page, limit }) => {
        return {
          url: `plans/getAllPackages?page=${page}&limit=${limit}`,
          method: "GET",
        };
      },
      providesTags: ["Plan"],
      invalidatesTags: ["UserUpdate"],
    }),
    deletePlan: builder.mutation({
      query: ({ id }) => ({
        url: `/plans/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Plan", "SubscriptionInfo", "UserUpdate", "SeePlans"],
    }),
    updatePlan: builder.mutation({
      query: ({ body, id }) => ({
        url: `/plans/updatePlan/${id}`,
        method: "PUT",
        body: body,
      }),
      invalidatesTags: ["SubscriptionInfo", "UserUpdate", "SeePlans", "Plan"],
    }),

    getPaymentMethod: builder.query({
      query: () => "plans/payments/methods",
      method: "GET",
      providesTags: ["PaymentMethod"],
      invalidatesTags: ["UserUpdate"],
    }),
    postPaymentMethod: builder.mutation({
      query: ({ body }) => ({
        url: "plans/change/customer/paymentmethod",
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["UserUpdate", "PaymentMethod", "PaymentMethod"],
    }),
    getSubscriptioInvoices: builder.query({
      query: () => "plans/customer/invoices",
      method: "GET",
      invalidatesTags: ["UserUpdate"],
    }),
    AddCustomerBillingAddress: builder.mutation({
      query: ({ body }) => ({
        url: "plans/customer/billingaddress",
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["UserUpdate"],
    }),
    smtpSettings: builder.mutation({
      query: ({ body }) => ({
        url: "leadmanager/mail-settings",
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["SmtpSettings", "UserUpdate"],
    }),
    getSmptSettings: builder.query({
      query: () => "leadmanager/mail-settings",
      method: "GET",
      providesTags: ["SmtpSettings", "UserUpdate"],
    }),

    composeEmail: builder.mutation({
      query: ({ body }) => ({
        url: "/leadmanager/sendMail",
        method: "POST",
        body: body,
      }),
    }),
    getSequenceTemplates: builder.query({
      query: ({ page, limit, search }) => ({
        url:
          `/leadmanager/templates${page ? `?page=${page}` : ""}` +
          `${limit ? `&limit=${limit}` : ""}` +
          `${search ? `&search=${search}` : ""}`,
        method: "GET",
      }),
      providesTags: ["SequenceTemplates"],
      invalidatesTags: ["UserUpdate"],
    }),
    createSequenceTemplate: builder.mutation({
      query: ({ body }) => ({
        url: "/leadmanager/templates",
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["SequenceTemplates", "UserUpdate"],
    }),
    deleteSequenceTemplate: builder.mutation({
      query: ({ body }) => ({
        url: `/leadmanager/templates`,
        method: "DELETE",
        body: body,
      }),
      invalidatesTags: ["SequenceTemplates", "UserUpdate"],
    }),
    updateSequenceTemplate: builder.mutation({
      query: ({ body, id }) => ({
        url: `/leadmanager/templates/${id}`,
        method: "PUT",
        body: body,
      }),
      invalidatesTags: ["SequenceTemplates", "UserUpdate"],
    }),
    assignTemplate: builder.mutation({
      query: ({ body }) => ({
        url: "/leadmanager/templates/assignToLead",
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["GetProfile", "UserUpdate"],
    }),
    getAllSequences: builder.query({
      query: ({ search }) => ({
        url: `/leadmanager/sequences${search ? `?search=${search}` : ""}`,
        method: "GET",
      }),
      providesTags: ["SequenceList"],
      invalidatesTags: ["UserUpdate"],
    }),
    createSequence: builder.mutation({
      query: ({ body }) => ({
        url: `/leadmanager/sequences`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["SequenceList", "UserUpdate"],
    }),

    getSequenceList: builder.query({
      query: () => ({
        url: `leadmanager/sequences-info`,
        method: "GET",
      }),
      providesTags: ["SequenceListInfo"],
      invalidatesTags: ["UserUpdate"],
    }),
    updateSequenceList: builder.mutation({
      query: ({ body }) => ({
        url: `/leadmanager/sequences-info`,
        method: "PUT",
        body: body,
      }),
      invalidatesTags: ["SequenceList", "SequenceListInfo", "UserUpdate"],
    }),
    deleteSequenceList: builder.mutation({
      query: ({ body }) => ({
        url: `/leadmanager/sequences`,
        method: "DELETE",
        body: body,
      }),
      invalidatesTags: ["SequenceList", "SequenceListInfo", "UserUpdate"],
    }),
    getLeadManagerStatuses: builder.query({
      query: ({ page, limit }) =>
        `leadmanager/lead-statuses${page ? `?page=${page}` : ""}${
          limit ? `&limit=${limit}` : ""
        }`,
      method: "GET",
      providesTags: ["LeadManagerStatuses"],
      invalidatesTags: ["UserUpdate"],
    }),
    createLeadManagerStatus: builder.mutation({
      query: ({ body }) => ({
        url: "leadmanager/lead-statuses",
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["LeadManagerStatuses", "UserUpdate"],
    }),
    updateLeadManagerStatus: builder.mutation({
      query: ({ body, id }) => ({
        url: `leadmanager/lead-statuses/${id}`,
        method: "PUT",
        body: body,
      }),
      invalidatesTags: ["LeadManagerStatuses", "UserUpdate"],
    }),
    deleteLeadManagerStatus: builder.mutation({
      query: ({ body }) => ({
        url: `leadmanager/lead-statuses`,
        method: "DELETE",
        body: body,
      }),
      invalidatesTags: ["LeadManagerStatuses", "UserUpdate"],
    }),
    deleteSmtpSettings: builder.mutation({
      query: () => ({
        url: `leadmanager/mail-settings`,
        method: "DELETE",
      }),
      invalidatesTags: ["SmtpSettings", "UserUpdate"],
    }),
    cancelSubscription: builder.mutation({
      query: () => ({
        url: `/plans/customer/cancleSubscription`,
        method: "PUT",
      }),
      invalidatesTags: ["SubscriptionInfo", "UserUpdate"],
    }),
    emailVerification: builder.mutation({
      query: ({ body }) => ({
        url: "/lin/email-verification",
        method: "POST",
        body: body,
      }),
    }),
    importTemplate: builder.mutation({
      query: ({ body }) => ({
        url: "/exports/import-leads",
        method: "POST",
        body: body,
      }),
    }),
    getBlogCategorized: builder.query({
      query: () => `/blog/blogs/categorized`,
      method: "GET",
    }),
    deleteGoogleAccount: builder.mutation({
      query: (id) => ({
        url: `/users/customers/delete/${id}`,
        method: "DELETE",
      }),
    }),
    postUserTour: builder.mutation({
      query: () => ({
        url: "users/customers/completeAppTour",
        method: "PUT",
      }),
      invalidatesTags: ["UserUpdate"],
    }),
    getCustomerBillingPortal: builder.query({
      query: () => `/plans/manage/billing`,
      method: "GET",
    }),
    deletePaymentMethod: builder.mutation({
      query: (paymentMethodId) => ({
        url: `/plans/detach/customer/paymentmethod`,
        method: "DELETE",
        body: { paymentMethodId },
      }),
      invalidatesTags: ["PaymentMethod"],
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutQuery,
  useSignupMutation,
  useEditUserMutation,
  useEditEmailMutation,
  useEditPasswordMutation,
  useRestAccountMutation,
  useDeleteAccountMutation,
  useGetProductQuery,
  useGetProfileFoldersQuery,
  usePostProfileFolderMutation,
  useGetProfileFolderNameQuery,
  useGetFolderViewQuery,
  useGetViewColumnsQuery,
  useGetExportSettingsQuery,
  usePostCreateExportMutation,
  useGetExportDataQuery,
  useDownloadExportMutation,
  useTeamInvitationMutation,
  useDeleFolderMutation,
  useEditFolderMutation,
  useAddNoteAndTagMutation,
  useGetAllTagsQuery,
  useUpdateTagMutation,
  useGetStatusesQuery,
  useUpdateStatusMutation,
  useMoveToFolderMutation,
  useCheckDataQuery,
  useDeleteLeadMutation,
  useProfileTagsAndUntagsMutation,
  useUpdateColumnMutation,
  useGetTeamQuery,
  useDeleteTeamMemberMutation,
  useProfileMultipleStatusMutation,
  useUpdateProfileMutation,
  useGetPlansMutation,
  useGetAllSeePlansQuery,
  useGetPaymentMethodQuery,
  usePostPaymentMethodMutation,
  useGetSubscriptionInfoQuery,
  useGetSubscriptioInvoicesQuery,
  useAddCustomerBillingAddressMutation,
  useLoginWithGoogleMutation,
  useLoginWithLinkedInMutation,
  useSmtpSettingsMutation,
  useComposeEmailMutation,
  useGetSequenceTemplatesQuery,
  useCreateSequenceTemplateMutation,
  useDeleteSequenceTemplateMutation,
  useUpdateSequenceTemplateMutation,
  useGetSequenceListQuery,
  useUpdateSequenceListMutation,
  useDeleteSequenceListMutation,
  useGetAllSequencesQuery,
  useDeletePlanMutation,
  useUpdatePlanMutation,
  useAssignTemplateMutation,
  useCreateSequenceMutation,
  useGetSmptSettingsQuery,
  useGetLeadManagerStatusesQuery,
  useCreateLeadManagerStatusMutation,
  useUpdateLeadManagerStatusMutation,
  useDeleteLeadManagerStatusMutation,
  useDeleteSmtpSettingsMutation,
  useCancelSubscriptionMutation,
  useEmailVerificationMutation,
  useImportTemplateMutation,
  useGetBlogCategorizedQuery,
  useDeleteGoogleAccountMutation,
  usePostUserTourMutation,
  useGetPlansFeatureInfoQuery,
  useGetCustomerBillingPortalQuery,
  useLazyGetCustomerBillingPortalQuery,
  useDeletePaymentMethodMutation,
} = customerApiSlice;
