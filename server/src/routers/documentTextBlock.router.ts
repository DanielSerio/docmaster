import { z } from "zod";
import { publicProcedure, router } from "../trpc.js";
import * as documentTextBlockService from "../services/documentTextBlock.service.js";
import {
  documentTextBlockWithTextBlockSchema,
  getDocumentTextBlocksInputSchema,
  updateDocumentTextBlockPriorityInputSchema,
  toggleDocumentTextBlockEnabledInputSchema,
} from "../lib/schemas/index.js";

export const documentTextBlockRouter = router({
  getDocumentTextBlocks: publicProcedure
    .input(getDocumentTextBlocksInputSchema)
    .output(z.array(documentTextBlockWithTextBlockSchema))
    .query(async ({ input }) => {
      return await documentTextBlockService.getDocumentTextBlocks(input.documentId);
    }),

  updatePriority: publicProcedure
    .input(updateDocumentTextBlockPriorityInputSchema)
    .output(documentTextBlockWithTextBlockSchema)
    .mutation(async ({ input }) => {
      return await documentTextBlockService.updateDocumentTextBlockPriority(input);
    }),

  toggleEnabled: publicProcedure
    .input(toggleDocumentTextBlockEnabledInputSchema)
    .output(documentTextBlockWithTextBlockSchema)
    .mutation(async ({ input }) => {
      return await documentTextBlockService.toggleDocumentTextBlockEnabled(input);
    }),
});
