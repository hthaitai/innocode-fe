import { api } from "./api"

export const certificateApi = api.injectEndpoints({
  endpoints: (builder) => ({
    uploadCertificateTemplate: builder.mutation({
      query: (body) => ({
        url: "certificate-templates",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "CertificateTemplates", id: "LIST" }],
    }),

    getCertificateTemplates: builder.query({
      query: ({ pageNumber = 1, pageSize = 10, contestIdSearch = "" }) => ({
        url: "certificate-templates",
        params: { pageNumber, pageSize, contestIdSearch },
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((tpl) => ({
                type: "CertificateTemplates",
                id: tpl.templateId,
              })),
              { type: "CertificateTemplates", id: "LIST" },
            ]
          : [{ type: "CertificateTemplates", id: "LIST" }],
    }),
    getCertificateTemplateById: builder.query({
      query: (id) => ({
        url: `certificate-templates/${id}`,
      }),
      providesTags: (result, error, id) => [
        { type: "CertificateTemplates", id },
      ],
    }),

    editCertificateTemplate: builder.mutation({
      query: ({ id, body }) => ({
        url: `certificate-templates/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "CertificateTemplates", id },
        { type: "CertificateTemplates", id: "LIST" },
      ],
    }),

    deleteCertificateTemplate: builder.mutation({
      query: (id) => ({
        url: `certificate-templates/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "CertificateTemplates", id },
        { type: "CertificateTemplates", id: "LIST" },
      ],
    }),

    awardCertificates: builder.mutation({
      query: (data) => ({
        url: "certificates/issue",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Certificates", id: "LIST" }],
    }),

    getMyCertificates: builder.query({
      query: () => ({
        url: "certificates/my-certificate",
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((cert) => ({
                type: "Certificates",
                id: cert.templateId,
              })),
              { type: "Certificates", id: "LIST" },
            ]
          : [{ type: "Certificates", id: "LIST" }],
    }),

    getIssuedCertificates: builder.query({
      query: ({
        contestId,
        templateId,
        teamId,
        studentId,
        page = 1,
        pageSize = 20,
        sortBy = "issuedAt",
        desc = true,
      }) => ({
        url: "certificates", // just /api/certificates
        params: {
          contestId,
          templateId,
          teamId,
          studentId,
          page,
          pageSize,
          sortBy,
          desc,
        },
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((cert) => ({
                type: "Certificates",
                id: cert.templateId,
              })),
              { type: "Certificates", id: "LIST" },
            ]
          : [{ type: "Certificates", id: "LIST" }],
    }),
  }),
})

export const {
  useUploadCertificateTemplateMutation,
  useGetCertificateTemplatesQuery,
  useGetCertificateTemplateByIdQuery,
  useEditCertificateTemplateMutation,
  useDeleteCertificateTemplateMutation,

  useAwardCertificatesMutation,
  useGetIssuedCertificatesQuery,
  useGetMyCertificatesQuery,
} = certificateApi
