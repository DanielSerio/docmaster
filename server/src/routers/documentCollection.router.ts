import { z } from "zod";
import { publicProcedure, router } from "../trpc.js";
import * as documentCollectionService from "../services/documentCollection.service.js";
import {
  documentCollectionSchema,
  createDocumentCollectionInputSchema,
  updateDocumentCollectionInputSchema,
  deleteDocumentCollectionInputSchema,
  documentCollectionIdSchema,
} from "../lib/schemas/index.js";

export const documentCollectionRouter = router({
  create: publicProcedure
    .input(createDocumentCollectionInputSchema)
    .output(documentCollectionSchema)
    .mutation(async ({ input }) => {
      return await documentCollectionService.createDocumentCollection(input);
    }),

  getAll: publicProcedure
    .input(z.object({
      offset: z.number().default(0),
      limit: z.number().default(10),
      filters: z.array(z.object({
        id: z.string(),
        value: z.unknown()
      })).optional(),
      sorting: z.array(z.object({
        id: z.string(),
        desc: z.boolean()
      })).optional()
    }))
    .output(z.object({
      paging: z.object({
        offset: z.number(),
        limit: z.number(),
        total: z.object({
          pages: z.number(),
          records: z.number(),
        }),
      }),
      results: z.array(documentCollectionSchema),
    }))
    .query(async ({ input }) => {
      return await documentCollectionService.getAllDocumentCollections({
        offset: input.offset,
        limit: input.limit,
        filters: input.filters,
        sorting: input.sorting
      });
    }),

  getById: publicProcedure
    .input(z.object({ id: documentCollectionIdSchema }))
    .output(documentCollectionSchema)
    .query(async ({ input }) => {
      return await documentCollectionService.getDocumentCollectionById(input.id);
    }),

  update: publicProcedure
    .input(z.object({
      id: documentCollectionIdSchema,
      data: updateDocumentCollectionInputSchema,
    }))
    .output(documentCollectionSchema)
    .mutation(async ({ input }) => {
      return await documentCollectionService.updateDocumentCollection(input.id, input.data);
    }),

  delete: publicProcedure
    .input(deleteDocumentCollectionInputSchema)
    .output(documentCollectionSchema)
    .mutation(async ({ input }) => {
      return await documentCollectionService.deleteDocumentCollection(input.id);
    }),
});
