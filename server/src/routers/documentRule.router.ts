import { z } from "zod";
import { publicProcedure, router } from "../trpc.js";
import * as documentRuleService from "../services/documentRule.service.js";
import {
  documentRuleWithRuleSchema,
  getDocumentRulesInputSchema,
  updateDocumentRulePriorityInputSchema,
  toggleDocumentRuleEnabledInputSchema,
} from "../lib/schemas/index.js";

export const documentRuleRouter = router({
  getDocumentRules: publicProcedure
    .input(getDocumentRulesInputSchema)
    .output(z.array(documentRuleWithRuleSchema))
    .query(async ({ input }) => {
      return await documentRuleService.getDocumentRules(input.documentId);
    }),

  updatePriority: publicProcedure
    .input(updateDocumentRulePriorityInputSchema)
    .output(documentRuleWithRuleSchema)
    .mutation(async ({ input }) => {
      return await documentRuleService.updateDocumentRulePriority(input);
    }),

  toggleEnabled: publicProcedure
    .input(toggleDocumentRuleEnabledInputSchema)
    .output(documentRuleWithRuleSchema)
    .mutation(async ({ input }) => {
      return await documentRuleService.toggleDocumentRuleEnabled(input);
    }),
});
