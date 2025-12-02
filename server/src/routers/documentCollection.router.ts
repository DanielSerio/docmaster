import { z } from "zod";
import { publicProcedure, router } from "../trpc.js";
import * as documentCollectionService from "../services/documentCollection.service.js";
import {
  documentCollectionSchema,
  createDocumentCollectionInputSchema,
  updateDocumentCollectionInputSchema,
  deleteDocumentCollectionInputSchema,
} from "../lib/schemas/index.js";

export const documentCollectionRouter = router({
  create: publicProcedure
    .input(createDocumentCollectionInputSchema)
    .output(documentCollectionSchema)
    .mutation(async ({ input }) => {
      return await documentCollectionService.createDocumentCollection(input);
    }),

  getAll: publicProcedure
    .output(z.array(documentCollectionSchema))
    .query(async () => {
      return await documentCollectionService.getAllDocumentCollections();
    }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .output(documentCollectionSchema.nullable())
    .query(async ({ input }) => {
      return await documentCollectionService.getDocumentCollectionById(input.id);
    }),

  update: publicProcedure
    .input(z.object({
      id: z.number(),
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
