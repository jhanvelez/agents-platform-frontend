import { camelToSnake, snakeToCamel } from "caseparser";

import { api } from "@/store/app.api";
import { RequestMethod } from "@/shared/utils/RequestMethod";

export const usersApi = api
  .enhanceEndpoints({ addTagTypes: ["agent", "agents", "agent-users"] })
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
      agentsPermittedAccess: builder.query({
        query: () => ({
          url: `/agents/permitted-access`,
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
      refreshAgent: builder.mutation({
        invalidatesTags: ["agent"],
        query: ({ id }) => ({
          url: `/agents/${id}/refresh`,
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
      agentUsers: builder.query({
        query: ({ agentId }: { agentId: string; }) => ({
          url: `/agents/${agentId}/users`,
          method: RequestMethod.GET,
        }),
        providesTags: ["agents"],
        transformResponse: (response: any) => snakeToCamel(response.data),
      }),
      hasAccessUserAgent: builder.mutation({
        invalidatesTags: ["agent"],
        query: ({ userId, agentId }: { userId: string; agentId: string; }) => ({
          url: `/agents/${agentId}/assign-user`,
          method: RequestMethod.PATCH,
          body: camelToSnake({
            userId
          }),
        }),
      }),
      removeAccessUserAgent: builder.mutation({
        invalidatesTags: ["agent"],
        query: ({ userId, agentId }: { userId: string; agentId: string; }) => ({
          url: `/agents/${agentId}/remove-user`,
          method: RequestMethod.PATCH,
          body: camelToSnake({
            userId
          }),
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
  useRefreshAgentMutation,
  useUploadFileAgentMutation,
  useGetFilesAgentQuery,
  useDeleteFileAgentMutation,
  useAgentUsersQuery,
  useHasAccessUserAgentMutation,
  useRemoveAccessUserAgentMutation,
  useAgentsPermittedAccessQuery,
} = usersApi;
