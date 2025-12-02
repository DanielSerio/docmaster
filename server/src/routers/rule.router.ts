import { z } from "zod";
import { publicProcedure, router } from "../trpc.js";
import * as ruleService from "../services/rule.service.js";
import {
  ruleWithCategorySchema,
  createRuleInputSchema,
  updateRuleInputSchema,
  deleteRuleInputSchema,
  ruleIdSchema,
} from "../lib/schemas/index.js";

export const ruleRouter = router({
  create: publicProcedure
    .input(createRuleInputSchema)
    .output(ruleWithCategorySchema)
    .mutation(async ({ input }) => {
      return await ruleService.createRule(input);
    }),

  getAll: publicProcedure
    .output(z.array(ruleWithCategorySchema))
    .query(async () => {
      return await ruleService.getAllRules();
    }),

  getById: publicProcedure
    .input(z.object({ id: ruleIdSchema }))
    .output(ruleWithCategorySchema)
    .query(async ({ input }) => {
      return await ruleService.getRuleById(input.id);
    }),

  update: publicProcedure
    .input(z.object({
      id: ruleIdSchema,
      data: updateRuleInputSchema,
    }))
    .output(ruleWithCategorySchema)
    .mutation(async ({ input }) => {
      return await ruleService.updateRule(input.id, input.data);
    }),

  delete: publicProcedure
    .input(deleteRuleInputSchema)
    .output(ruleWithCategorySchema)
    .mutation(async ({ input }) => {
      return await ruleService.deleteRule(input.id);
    }),
});
