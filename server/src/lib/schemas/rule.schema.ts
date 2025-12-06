import { z } from "zod";
import { ruleCategorySchema } from "./ruleCategory.schema.js";

const MESSAGES = {
  positiveInteger: "must be a positive integer",
  stringMin: "is required",
  intMin: "must be at least 1",
  intMax: "must be at most 100",
  arrayMin: "must have at least 1 item"
};

const getMessage = (field: string, messageType: keyof typeof MESSAGES) => `${field} ${MESSAGES[messageType]}`;

const idSchema = z.number().int(getMessage("id", "positiveInteger")).positive(getMessage("id", "positiveInteger"));
const categoryIdSchema = z.number().int(getMessage("categoryId", "positiveInteger")).positive(getMessage("categoryId", "positiveInteger"));
const categoryNameSchema = z.string().min(1, getMessage("categoryName", "stringMin"));
const rawContentSchema = z.string().min(1, getMessage("rawContent", "stringMin"));
const defaultPrioritySchema = z.number().int(getMessage("defaultPriority", "positiveInteger")).min(1, getMessage("defaultPriority", "intMin")).max(100, getMessage("defaultPriority", "intMax")).default(50);

export const ruleIdSchema = idSchema;

export const ruleSchema = z.object({
  id: idSchema,
  categoryId: categoryIdSchema,
  rawContent: rawContentSchema,
  defaultPriority: defaultPrioritySchema
});

export const ruleWithCategorySchema = ruleSchema.extend({
  category: ruleCategorySchema
});

export type Rule = z.infer<typeof ruleSchema>;
export type RuleWithCategory = z.infer<typeof ruleWithCategorySchema>;

// Input schemas use categoryName instead of categoryId
export const createRuleInputSchema = z.object({
  categoryName: categoryNameSchema,
  rawContent: rawContentSchema,
  defaultPriority: defaultPrioritySchema
});

export const updateRuleInputSchema = z.object({
  id: idSchema,
  categoryName: categoryNameSchema,
  rawContent: rawContentSchema,
  defaultPriority: defaultPrioritySchema
});

export type CreateRuleInput = z.infer<typeof createRuleInputSchema>;
export type UpdateRuleInput = z.infer<typeof updateRuleInputSchema>;

export const getRuleByIdInputSchema = z.object({
  id: idSchema
});

export const deleteRuleInputSchema = z.object({
  id: idSchema
});

export const deleteManyRulesInputSchema = z.object({
  ids: z.array(idSchema).min(1, getMessage("ids", "arrayMin"))
});

export const batchUpdateRulesInputSchema = z.object({
  newRules: z.array(createRuleInputSchema).default([]),
  updatedRules: z.array(updateRuleInputSchema).default([]),
  deletedIds: z.array(idSchema).default([])
});

export type GetRuleByIdInput = z.infer<typeof getRuleByIdInputSchema>;
export type DeleteRuleInput = z.infer<typeof deleteRuleInputSchema>;
export type DeleteManyRulesInput = z.infer<typeof deleteManyRulesInputSchema>;
export type BatchUpdateRulesInput = z.infer<typeof batchUpdateRulesInputSchema>;
