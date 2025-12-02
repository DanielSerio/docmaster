import { z } from "zod";
import { publicProcedure, router } from "../trpc.js";
import * as documentCollectionDocumentService from "../services/documentCollectionDocument.service.js";
import {
  documentCollectionDocumentWithDocumentSchema,
  addDocumentToCollectionInputSchema,
  getCollectionDocumentsInputSchema,
  updateDocumentPathInputSchema,
  removeDocumentFromCollectionInputSchema,
} from "../lib/schemas/index.js";

export const documentCollectionDocumentRouter = router({
  addDocument: publicProcedure
    .input(addDocumentToCollectionInputSchema)
    .output(documentCollectionDocumentWithDocumentSchema)
    .mutation(async ({ input }) => {
      return await documentCollectionDocumentService.addDocumentToCollection(input);
    }),

  getCollectionDocuments: publicProcedure
    .input(getCollectionDocumentsInputSchema)
    .output(z.array(documentCollectionDocumentWithDocumentSchema))
    .query(async ({ input }) => {
      return await documentCollectionDocumentService.getCollectionDocuments(input.documentCollectionId);
    }),

  updatePath: publicProcedure
    .input(updateDocumentPathInputSchema)
    .output(documentCollectionDocumentWithDocumentSchema)
    .mutation(async ({ input }) => {
      return await documentCollectionDocumentService.updateDocumentPath(input);
    }),

  removeDocument: publicProcedure
    .input(removeDocumentFromCollectionInputSchema)
    .output(documentCollectionDocumentWithDocumentSchema)
    .mutation(async ({ input }) => {
      return await documentCollectionDocumentService.removeDocumentFromCollection(input);
    }),
});
