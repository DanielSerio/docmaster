import { z } from "zod";
import { textBlockSchema } from "./textBlock.schema.js";

const MESSAGES = {
  positiveInteger: "must be a positive integer",
  intMin: "must be at least 1",
  intMax: "must be at most 100",
  boolean: "must be a boolean"
};

const getMessage = (field: string, messageType: keyof typeof MESSAGES) => `${field} ${MESSAGES[messageType]}`;

const documentIdSchema = z.number().int(getMessage("documentId", "positiveInteger")).positive(getMessage("documentId", "positiveInteger"));
const textBlockIdSchema = z.number().int(getMessage("textBlockId", "positiveInteger")).positive(getMessage("textBlockId", "positiveInteger"));
const prioritySchema = z.number().int(getMessage("priority", "positiveInteger")).min(1, getMessage("priority", "intMin")).max(100, getMessage("priority", "intMax"));
const isEnabledSchema = z.boolean({ message: getMessage("isEnabled", "boolean") });

export const documentTextBlockSchema = z.object({
  documentId: documentIdSchema,
  textBlockId: textBlockIdSchema,
  priority: prioritySchema,
  isEnabled: isEnabledSchema
});

export const documentTextBlockWithTextBlockSchema = documentTextBlockSchema.extend({
  textBlock: textBlockSchema
});

export type DocumentTextBlock = z.infer<typeof documentTextBlockSchema>;
export type DocumentTextBlockWithTextBlock = z.infer<typeof documentTextBlockWithTextBlockSchema>;

export const getDocumentTextBlocksInputSchema = z.object({
  documentId: documentIdSchema
});

export const updateDocumentTextBlockPriorityInputSchema = z.object({
  documentId: documentIdSchema,
  textBlockId: textBlockIdSchema,
  priority: prioritySchema
});

export const toggleDocumentTextBlockEnabledInputSchema = z.object({
  documentId: documentIdSchema,
  textBlockId: textBlockIdSchema,
  isEnabled: isEnabledSchema
});

export type GetDocumentTextBlocksInput = z.infer<typeof getDocumentTextBlocksInputSchema>;
export type UpdateDocumentTextBlockPriorityInput = z.infer<typeof updateDocumentTextBlockPriorityInputSchema>;
export type ToggleDocumentTextBlockEnabledInput = z.infer<typeof toggleDocumentTextBlockEnabledInputSchema>;
