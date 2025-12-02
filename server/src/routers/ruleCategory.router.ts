import { z } from "zod";
import { publicProcedure, router } from "../trpc.js";
import * as ruleCategoryService from "../services/ruleCategory.service.js";
import {
  ruleCategorySchema,
  createRuleCategoryInputSchema,
  updateRuleCategoryInputSchema,
  deleteRuleCategoryInputSchema,
  ruleCategoryIdSchema,
} from "../lib/schemas/index.js";

export const ruleCategoryRouter = router({
  create: publicProcedure
    .input(createRuleCategoryInputSchema)
    .output(ruleCategorySchema)
    .mutation(async ({ input }) => {
      return await ruleCategoryService.createRuleCategory(input);
    }),

  getAll: publicProcedure
    .output(z.array(ruleCategorySchema))
    .query(async () => {
      return await ruleCategoryService.getAllRuleCategories();
    }),

  getById: publicProcedure
    .input(z.object({ id: ruleCategoryIdSchema }))
    .output(ruleCategorySchema)
    .query(async ({ input }) => {
      return await ruleCategoryService.getRuleCategoryById(input.id);
    }),

  update: publicProcedure
    .input(z.object({
      id: ruleCategoryIdSchema,
      data: updateRuleCategoryInputSchema,
    }))
    .output(ruleCategorySchema)
    .mutation(async ({ input }) => {
      return await ruleCategoryService.updateRuleCategory(input.id, input.data);
    }),

  delete: publicProcedure
    .input(deleteRuleCategoryInputSchema)
    .output(ruleCategorySchema)
    .mutation(async ({ input }) => {
      return await ruleCategoryService.deleteRuleCategory(input.id);
    }),
});
