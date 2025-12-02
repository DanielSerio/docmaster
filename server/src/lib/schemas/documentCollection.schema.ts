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
const dateTimeSchema = z.date();

export const documentCollectionSchema = z.object({
  id: idSchema,
  name: nameSchema,
  createdAt: dateTimeSchema,
  updatedAt: dateTimeSchema
});

export type DocumentCollection = z.infer<typeof documentCollectionSchema>;

export const createDocumentCollectionInputSchema = z.object({
  name: nameSchema
});

export const updateDocumentCollectionInputSchema = z.object({
  name: nameSchema
});

export type CreateDocumentCollectionInput = z.infer<typeof createDocumentCollectionInputSchema>;
export type UpdateDocumentCollectionInput = z.infer<typeof updateDocumentCollectionInputSchema>;

export const getDocumentCollectionByIdInputSchema = z.object({
  id: idSchema
});

export const deleteDocumentCollectionInputSchema = z.object({
  id: idSchema
});

export const deleteManyDocumentCollectionsInputSchema = z.object({
  ids: z.array(idSchema).min(1, getMessage("ids", "arrayMin"))
});

export type GetDocumentCollectionByIdInput = z.infer<typeof getDocumentCollectionByIdInputSchema>;
export type DeleteDocumentCollectionInput = z.infer<typeof deleteDocumentCollectionInputSchema>;
export type DeleteManyDocumentCollectionsInput = z.infer<typeof deleteManyDocumentCollectionsInputSchema>;
