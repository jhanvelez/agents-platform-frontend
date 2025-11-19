import { camelToSnake, snakeToCamel } from "caseparser";

import { api } from "@/store/app.api";
import { RequestMethod } from "@/shared/utils/RequestMethod";

export const tokensApi = api
  .enhanceEndpoints({ 
    addTagTypes: [
      "agent-tokens", 
      "tenant-tokens", 
      "token-assignment",
      "token-usage"
    ] 
  })
  .injectEndpoints({
    overrideExisting: false,
    endpoints: (builder) => ({
      // Asignar tokens a un agente
      assignTokens: builder.mutation({
        invalidatesTags: ["agent-tokens", "tenant-tokens", "token-assignment"],
        query: (data: { agentId: string; totalTokensAssigned: number }) => ({
          url: "agent-token-usage/assign",
          method: RequestMethod.POST,
          body: snakeToCamel(data),
        }),
        transformResponse: (response: any) => snakeToCamel(response.data),
      }),

      // Obtener información completa de un agente con tokens
      getAgentTokenInfo: builder.query({
        query: (agentId: string) => ({
          url: `agent-token-usage/agent/${agentId}`,
          method: RequestMethod.GET,
        }),
        providesTags: ["agent-tokens"],
        transformResponse: (response: any) => snakeToCamel(response.data),
      }),

      // Obtener todos los agentes de un tenant con información de tokens
      getTenantAgentsTokens: builder.query({
        query: (tenantId: string) => ({
          url: `agent-token-usage/tenant/${tenantId}`,
          method: RequestMethod.GET,
        }),
        providesTags: ["tenant-tokens"],
        transformResponse: (response: any) => snakeToCamel(response.data),
      }),

      // Registrar uso de tokens (para cuando los agentes consumen tokens)
      registerTokenUsage: builder.mutation({
        invalidatesTags: ["agent-tokens", "token-usage"],
        query: (data: { 
          agentId: string; 
          tokensUsed: number; 
          totalTokensAssigned: number;
        }) => ({
          url: "agent-token-usage/register",
          method: RequestMethod.POST,
          body: camelToSnake(data),
        }),
        transformResponse: (response: any) => snakeToCamel(response.data),
      }),

      // Obtener uso histórico de tokens de un agente
      getAgentTokenUsage: builder.query({
        query: (agentId: string) => ({
          url: `agent-token-usage/${agentId}`,
          method: RequestMethod.GET,
        }),
        providesTags: ["token-usage"],
        transformResponse: (response: any) => snakeToCamel(response.data),
      }),

      // Obtener todo el uso de tokens
      getAllTokenUsage: builder.query({
        query: () => ({
          url: "agent-token-usage",
          method: RequestMethod.GET,
        }),
        providesTags: ["token-usage"],
        transformResponse: (response: any) => snakeToCamel(response.data),
      }),
    }),
  });

export const {
  useAssignTokensMutation,
  useGetAgentTokenInfoQuery,
  useGetTenantAgentsTokensQuery,
  useRegisterTokenUsageMutation,
  useGetAgentTokenUsageQuery,
  useGetAllTokenUsageQuery,
} = tokensApi;