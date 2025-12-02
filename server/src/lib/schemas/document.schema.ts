import { z } from "zod";

const MESSAGES = {
  positiveInteger: "must be a positive integer",
  stringMin: "is required",
  stringMax: "cannot be longer than 255 characters",
  invalidEnum: "must be either 'general' or 'rule'",
  arrayMin: "must have at least 1 item"
};

const getMessage = (field: string, messageType: keyof typeof MESSAGES) => `${field} ${MESSAGES[messageType]}`;

const idSchema = z.number().int(getMessage("id", "positiveInteger")).positive(getMessage("id", "positiveInteger"));
const documentTypeSchema = z.enum(["general", "rule"], { message: getMessage("documentType", "invalidEnum") });
const filenameSchema = z.string().min(1, getMessage("filename", "stringMin")).max(255, getMessage("filename", "stringMax"));
const dateTimeSchema = z.date();

export const documentIdSchema = idSchema;

export const documentSchema = z.object({
  id: idSchema,
  documentType: documentTypeSchema,
  filename: filenameSchema,
  createdAt: dateTimeSchema,
  updatedAt: dateTimeSchema
});

export type Document = z.infer<typeof documentSchema>;

export const createDocumentInputSchema = z.object({
  documentType: documentTypeSchema,
  filename: filenameSchema
});

export const updateDocumentInputSchema = z.object({
  filename: filenameSchema
});

export type CreateDocumentInput = z.infer<typeof createDocumentInputSchema>;
export type UpdateDocumentInput = z.infer<typeof updateDocumentInputSchema>;

export const getDocumentByIdInputSchema = z.object({
  id: idSchema
});

export const deleteDocumentInputSchema = z.object({
  id: idSchema
});

export const deleteManyDocumentsInputSchema = z.object({
  ids: z.array(idSchema).min(1, getMessage("ids", "arrayMin"))
});

export type GetDocumentByIdInput = z.infer<typeof getDocumentByIdInputSchema>;
export type DeleteDocumentInput = z.infer<typeof deleteDocumentInputSchema>;
export type DeleteManyDocumentsInput = z.infer<typeof deleteManyDocumentsInputSchema>;
