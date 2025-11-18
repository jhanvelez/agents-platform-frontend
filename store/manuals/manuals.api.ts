import { camelToSnake, snakeToCamel } from "caseparser";

import { api } from "@/store/app.api";
import { RequestMethod } from "@/shared/utils/RequestMethod";

export const manualsApi = api
  .enhanceEndpoints({ addTagTypes: ["manual", "manuals"] })
  .injectEndpoints({
    overrideExisting: false,
    endpoints: (builder) => ({
      // Obtener todos los manuales
      manuals: builder.query({
        query: ({ search }: { search?: string } = {}) => ({
          url: `/manuals`,
          method: RequestMethod.GET,
          params: camelToSnake({
            search,
          }),
        }),
        providesTags: ["manuals"],
        transformResponse: (response: any) => snakeToCamel(response.data),
      }),

      // Obtener un manual por ID
      manual: builder.query({
        query: ({ id }: { id: string }) => ({
          url: `/manuals/${id}`,
          method: RequestMethod.GET,
        }),
        providesTags: ["manual"],
        transformResponse: (response: any) => snakeToCamel(response.data),
      }),

      // Obtener manuales por tipo
      manualsByType: builder.query({
        query: ({ type }: { type: string }) => ({
          url: `/manuals/type/${type}`,
          method: RequestMethod.GET,
        }),
        providesTags: ["manuals"],
        transformResponse: (response: any) => snakeToCamel(response.data),
      }),

      // Obtener manual activo por tipo
      activeManualByType: builder.query({
        query: ({ type }: { type: string }) => ({
          url: `/manuals/type/${type}/active`,
          method: RequestMethod.GET,
        }),
        providesTags: ["manual"],
        transformResponse: (response: any) => snakeToCamel(response.data),
      }),

      // Obtener URLs de todos los manuales activos
      activeManualsUrls: builder.query({
        query: () => ({
          url: `/manuals/active`,
          method: RequestMethod.GET,
        }),
        providesTags: ["manuals"],
        transformResponse: (response: any) => snakeToCamel(response.data),
      }),

      // Crear nuevo manual (subir archivo)
      createManual: builder.mutation({
        invalidatesTags: ["manuals"],
        query: ({ manualData, file }: { manualData: any; file: File }) => {
          const formData = new FormData();
          formData.append("file", file);
          
          // Agregar los datos del manual al FormData
          Object.keys(manualData).forEach(key => {
            formData.append(key, manualData[key]);
          });

          return {
            url: `/manuals`,
            method: RequestMethod.POST,
            body: formData,
          };
        },
        transformResponse: (response: any) => snakeToCamel(response.data),
      }),

      // Actualizar manual (sin archivo)
      updateManual: builder.mutation({
        invalidatesTags: ["manual", "manuals"],
        query: ({ id, manualData }: { id: string; manualData: any }) => ({
          url: `/manuals/${id}`,
          method: RequestMethod.PATCH,
          body: camelToSnake(manualData),
        }),
        transformResponse: (response: any) => snakeToCamel(response.data),
      }),

      // Activar un manual
      activateManual: builder.mutation({
        invalidatesTags: ["manual", "manuals"],
        query: ({ id }: { id: string }) => ({
          url: `/manuals/${id}/activate`,
          method: RequestMethod.PATCH,
        }),
        transformResponse: (response: any) => snakeToCamel(response.data),
      }),

      // Eliminar manual
      deleteManual: builder.mutation({
        invalidatesTags: ["manuals"],
        query: ({ id }: { id: string }) => ({
          url: `/manuals/${id}`,
          method: RequestMethod.DELETE,
        }),
        transformResponse: (response: any) => snakeToCamel(response.data),
      }),

      // Subir archivo de manual (alternativa si necesitas separado)
      uploadManualFile: builder.mutation({
        invalidatesTags: ["manuals"],
        query: ({ manualId, file }: { manualId: string; file: File }) => {
          const formData = new FormData();
          formData.append("file", file);

          return {
            url: `/manuals/${manualId}/upload`,
            method: RequestMethod.POST,
            body: formData,
          };
        },
        transformResponse: (response: any) => snakeToCamel(response.data),
      }),
    }),
  });

export const {
  useManualsQuery,
  useManualQuery,
  useManualsByTypeQuery,
  useActiveManualByTypeQuery,
  useActiveManualsUrlsQuery,
  useCreateManualMutation,
  useUpdateManualMutation,
  useActivateManualMutation,
  useDeleteManualMutation,
  useUploadManualFileMutation,
} = manualsApi;