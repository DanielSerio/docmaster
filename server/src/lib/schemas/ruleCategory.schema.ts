import { z } from "zod";

const MESSAGES = {
  positiveInteger: "must be a positive integer",
  stringMin: "is required",
  stringMax: "cannot be longer than 255 characters",
  arrayMin: "must have at least 1 item"
};

const getMessage = (field: string, messageType: keyof typeof MESSAGES) => `${field} ${MESSAGES[messageType]}`;

const idSchema = z.number().int(getMessage("id", "positiveInteger")).positive(getMessage("id", "positiveInteger"));
const nameSchema = z.string().min(1, getMessage("name", "stringMin")).max(255, getMessage("name", "stringMax"));

export const ruleCategorySchema = z.object({
  id: idSchema,
  name: nameSchema
});

export type RuleCategory = z.infer<typeof ruleCategorySchema>;

export const createRuleCategoryInputSchema = ruleCategorySchema.omit({ id: true });
export const updateRuleCategoryInputSchema = ruleCategorySchema.omit({ id: true });

export type CreateRuleCategoryInput = z.infer<typeof createRuleCategoryInputSchema>;
export type UpdateRuleCategoryInput = z.infer<typeof updateRuleCategoryInputSchema>;

export const deleteRuleCategoryInputSchema = z.object({
  id: idSchema
});

export const deleteManyRuleCategoriesInputSchema = z.object({
  ids: z.array(idSchema).min(1, getMessage("ids", "arrayMin"))
});

export type DeleteRuleCategoryInput = z.infer<typeof deleteRuleCategoryInputSchema>;

export type DeleteManyRuleCategoriesInput = z.infer<typeof deleteManyRuleCategoriesInputSchema>;