import { z } from "zod";
import { publicProcedure, router } from "../trpc.js";
import * as documentService from "../services/document.service.js";
import {
  documentSchema,
  createDocumentInputSchema,
  updateDocumentInputSchema,
  deleteDocumentInputSchema,
  documentIdSchema,
} from "../lib/schemas/index.js";

export const documentRouter = router({
  create: publicProcedure
    .input(createDocumentInputSchema)
    .output(documentSchema)
    .mutation(async ({ input }) => {
      return await documentService.createDocument(input);
    }),

  getAll: publicProcedure
    .input(z.object({
      offset: z.number().default(0),
      limit: z.number().default(10),
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
      results: z.array(documentSchema),
    }))
    .query(async ({ input }) => {
      return await documentService.getAllDocuments({
        offset: input.offset,
        limit: input.limit,
      });
    }),

  getById: publicProcedure
    .input(z.object({ id: documentIdSchema }))
    .output(documentSchema)
    .query(async ({ input }) => {
      return await documentService.getDocumentById(input.id);
    }),

  update: publicProcedure
    .input(z.object({
      id: documentIdSchema,
      data: updateDocumentInputSchema,
    }))
    .output(documentSchema)
    .mutation(async ({ input }) => {
      return await documentService.updateDocument(input.id, input.data);
    }),

  delete: publicProcedure
    .input(deleteDocumentInputSchema)
    .output(documentSchema)
    .mutation(async ({ input }) => {
      return await documentService.deleteDocument(input.id);
    }),
});
