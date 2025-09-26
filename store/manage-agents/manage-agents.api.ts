import { camelToSnake, snakeToCamel } from "caseparser";

import { api } from "@/store/app.api";
import { RequestMethod } from "@/shared/utils/RequestMethod";

export const usersApi = api
  .enhanceEndpoints({ addTagTypes: ["agent", "agents"] })
  .injectEndpoints({
    overrideExisting: false,
    endpoints: (builder) => ({
      agents: builder.query({
        query: ({search}) => ({
          url: `/agents`,
          method: RequestMethod.GET,
          params: camelToSnake({
            search,
          }),
        }),
        providesTags: ["agents"],
        transformResponse: (response: any) => snakeToCamel(response.data),
      }),
      agent: builder.query({
        query: ({ id } : { id: string }) => ({
          url: `/agents/${id}`,
          method: RequestMethod.GET,
        }),
        providesTags: ["agents"],
        transformResponse: (response: any) => snakeToCamel(response.data),
      }),
      storeAgent: builder.mutation({
        invalidatesTags: ["agent"],
        query: (gymData) => ({
          url: "agents",
          method: RequestMethod.POST,
          body: gymData,
        }),
      }),
      updateAgent: builder.mutation({
        invalidatesTags: ["agent"],
        query: ({ id, agentData }: any) => ({
          url: `/agents/${id}`,
          method: RequestMethod.PUT,
          body: agentData
        }),
      }),
      deleteAgent: builder.mutation({
        invalidatesTags: ["agent"],
        query: ({ id }) => ({
          url: `/users/${id}`,
          method: RequestMethod.DELETE,
        }),
      }),

      toggleAgent: builder.mutation({
        invalidatesTags: ["agent"],
        query: ({ id }) => ({
          url: `/agents/${id}/toggle-status`,
          method: RequestMethod.PATCH,
        }),
      }),

      uploadFileAgent: builder.mutation({
        invalidatesTags: ["agent"],
        query: ({ agentId, file }: { agentId: string; file: File }) => {
          const formData = new FormData();
          formData.append("file", file);

          return {
            url: `knowledge-base/upload/${agentId}`,
            method: "POST",
            body: formData,
          };
        },
      }),

      getFilesAgent: builder.query({
        query: (agentId: string) => ({
          url: `/knowledge-base/files/${agentId}`,
          method: RequestMethod.GET,
          params: camelToSnake({
            agentId
          }),
        }),
        providesTags: ["agents"],
        transformResponse: (response: any) => snakeToCamel(response.data),
      }),
      deleteFileAgent: builder.mutation({
        invalidatesTags: ["agent"],
        query: ({ agentId, fileId }: { agentId: string; fileId: string }) => ({
          url: `/knowledge-base/delete/${fileId}`,
          method: RequestMethod.DELETE,
        }),
      }),
    }),
  });

export const {
  useAgentsQuery,
  useAgentQuery,
  useStoreAgentMutation,
  useUpdateAgentMutation,
  useDeleteAgentMutation,
  useToggleAgentMutation,
  useUploadFileAgentMutation,
  useGetFilesAgentQuery,
  useDeleteFileAgentMutation,
} = usersApi;
