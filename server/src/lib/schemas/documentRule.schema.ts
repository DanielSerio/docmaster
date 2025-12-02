import { z } from "zod";
import { ruleWithCategorySchema } from "./rule.schema.js";

const MESSAGES = {
  positiveInteger: "must be a positive integer",
  intMin: "must be at least 1",
  intMax: "must be at most 100",
  boolean: "must be a boolean"
};

const getMessage = (field: string, messageType: keyof typeof MESSAGES) => `${field} ${MESSAGES[messageType]}`;

const documentIdSchema = z.number().int(getMessage("documentId", "positiveInteger")).positive(getMessage("documentId", "positiveInteger"));
const ruleIdSchema = z.number().int(getMessage("ruleId", "positiveInteger")).positive(getMessage("ruleId", "positiveInteger"));
const prioritySchema = z.number().int(getMessage("priority", "positiveInteger")).min(1, getMessage("priority", "intMin")).max(100, getMessage("priority", "intMax"));
const isEnabledSchema = z.boolean({ message: getMessage("isEnabled", "boolean") });

export const documentRuleSchema = z.object({
  documentId: documentIdSchema,
  ruleId: ruleIdSchema,
  priority: prioritySchema,
  isEnabled: isEnabledSchema
});

export const documentRuleWithRuleSchema = documentRuleSchema.extend({
  rule: ruleWithCategorySchema
});

export type DocumentRule = z.infer<typeof documentRuleSchema>;
export type DocumentRuleWithRule = z.infer<typeof documentRuleWithRuleSchema>;

export const getDocumentRulesInputSchema = z.object({
  documentId: documentIdSchema
});

export const updateDocumentRulePriorityInputSchema = z.object({
  documentId: documentIdSchema,
  ruleId: ruleIdSchema,
  priority: prioritySchema
});

export const toggleDocumentRuleEnabledInputSchema = z.object({
  documentId: documentIdSchema,
  ruleId: ruleIdSchema,
  isEnabled: isEnabledSchema
});

export type GetDocumentRulesInput = z.infer<typeof getDocumentRulesInputSchema>;
export type UpdateDocumentRulePriorityInput = z.infer<typeof updateDocumentRulePriorityInputSchema>;
export type ToggleDocumentRuleEnabledInput = z.infer<typeof toggleDocumentRuleEnabledInputSchema>;
