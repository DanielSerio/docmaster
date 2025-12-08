import { z } from "zod";

const MESSAGES = {
  positiveInteger: "must be a positive integer",
  stringMin: "is required",
  intMin: "must be at least 1",
  intMax: "must be at most 100",
  arrayMin: "must have at least 1 item"
};

const getMessage = (field: string, messageType: keyof typeof MESSAGES) => `${field} ${MESSAGES[messageType]}`;

const idSchema = z.number().int(getMessage("id", "positiveInteger")).positive(getMessage("id", "positiveInteger"));
const rawContentSchema = z.string().min(1, getMessage("rawContent", "stringMin"));
const defaultPrioritySchema = z.number().int(getMessage("defaultPriority", "positiveInteger")).min(1, getMessage("defaultPriority", "intMin")).max(100, getMessage("defaultPriority", "intMax")).default(50);

export const textBlockIdSchema = idSchema;

export const textBlockSchema = z.object({
  id: idSchema,
  rawContent: rawContentSchema,
  defaultPriority: defaultPrioritySchema
});

export type TextBlock = z.infer<typeof textBlockSchema>;

export const createTextBlockInputSchema = textBlockSchema.omit({ id: true });
export const updateTextBlockInputSchema = textBlockSchema;

export type CreateTextBlockInput = z.infer<typeof createTextBlockInputSchema>;
export type UpdateTextBlockInput = z.infer<typeof updateTextBlockInputSchema>;

export const getTextBlockByIdInputSchema = z.object({
  id: idSchema
});

export const deleteTextBlockInputSchema = z.object({
  id: idSchema
});

export const deleteManyTextBlocksInputSchema = z.object({
  ids: z.array(idSchema).min(1, getMessage("ids", "arrayMin"))
});

export const batchUpdateTextBlocksInputSchema = z.object({
  newTextBlocks: z.array(createTextBlockInputSchema).default([]),
  updatedTextBlocks: z.array(updateTextBlockInputSchema).default([]),
  deletedIds: z.array(idSchema).default([])
});

export type GetTextBlockByIdInput = z.infer<typeof getTextBlockByIdInputSchema>;
export type DeleteTextBlockInput = z.infer<typeof deleteTextBlockInputSchema>;
export type DeleteManyTextBlocksInput = z.infer<typeof deleteManyTextBlocksInputSchema>;
export type BatchUpdateTextBlocksInput = z.infer<typeof batchUpdateTextBlocksInputSchema>;
