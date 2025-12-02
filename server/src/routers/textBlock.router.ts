import { z } from "zod";
import { publicProcedure, router } from "../trpc.js";
import * as textBlockService from "../services/textBlock.service.js";
import {
  textBlockSchema,
  createTextBlockInputSchema,
  updateTextBlockInputSchema,
  deleteTextBlockInputSchema,
} from "../lib/schemas/index.js";

export const textBlockRouter = router({
  create: publicProcedure
    .input(createTextBlockInputSchema)
    .output(textBlockSchema)
    .mutation(async ({ input }) => {
      return await textBlockService.createTextBlock(input);
    }),

  getAll: publicProcedure
    .output(z.array(textBlockSchema))
    .query(async () => {
      return await textBlockService.getAllTextBlocks();
    }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .output(textBlockSchema.nullable())
    .query(async ({ input }) => {
      return await textBlockService.getTextBlockById(input.id);
    }),

  update: publicProcedure
    .input(z.object({
      id: z.number(),
      data: updateTextBlockInputSchema,
    }))
    .output(textBlockSchema)
    .mutation(async ({ input }) => {
      return await textBlockService.updateTextBlock(input.id, input.data);
    }),

  delete: publicProcedure
    .input(deleteTextBlockInputSchema)
    .output(textBlockSchema)
    .mutation(async ({ input }) => {
      return await textBlockService.deleteTextBlock(input.id);
    }),
});
