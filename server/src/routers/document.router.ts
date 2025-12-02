import { z } from "zod";
import { publicProcedure, router } from "../trpc.js";
import * as documentService from "../services/document.service.js";
import {
  documentSchema,
  createDocumentInputSchema,
  updateDocumentInputSchema,
  deleteDocumentInputSchema,
} from "../lib/schemas/index.js";

export const documentRouter = router({
  create: publicProcedure
    .input(createDocumentInputSchema)
    .output(documentSchema)
    .mutation(async ({ input }) => {
      return await documentService.createDocument(input);
    }),

  getAll: publicProcedure
    .output(z.array(documentSchema))
    .query(async () => {
      return await documentService.getAllDocuments();
    }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .output(documentSchema.nullable())
    .query(async ({ input }) => {
      return await documentService.getDocumentById(input.id);
    }),

  update: publicProcedure
    .input(z.object({
      id: z.number(),
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
