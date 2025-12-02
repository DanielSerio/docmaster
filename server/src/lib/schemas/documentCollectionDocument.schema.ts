import { z } from "zod";
import { documentSchema } from "./document.schema.js";

const MESSAGES = {
  positiveInteger: "must be a positive integer",
  stringMin: "is required",
  stringMax: "cannot be longer than 500 characters"
};

const getMessage = (field: string, messageType: keyof typeof MESSAGES) => `${field} ${MESSAGES[messageType]}`;

const documentCollectionIdSchema = z.number().int(getMessage("documentCollectionId", "positiveInteger")).positive(getMessage("documentCollectionId", "positiveInteger"));
const documentIdSchema = z.number().int(getMessage("documentId", "positiveInteger")).positive(getMessage("documentId", "positiveInteger"));
const pathSchema = z.string().min(1, getMessage("path", "stringMin")).max(500, getMessage("path", "stringMax"));

export const documentCollectionDocumentSchema = z.object({
  documentCollectionId: documentCollectionIdSchema,
  documentId: documentIdSchema,
  path: pathSchema
});

export const documentCollectionDocumentWithDocumentSchema = documentCollectionDocumentSchema.extend({
  document: documentSchema
});

export type DocumentCollectionDocument = z.infer<typeof documentCollectionDocumentSchema>;
export type DocumentCollectionDocumentWithDocument = z.infer<typeof documentCollectionDocumentWithDocumentSchema>;

export const addDocumentToCollectionInputSchema = z.object({
  documentCollectionId: documentCollectionIdSchema,
  documentId: documentIdSchema,
  path: pathSchema
});

export const getCollectionDocumentsInputSchema = z.object({
  documentCollectionId: documentCollectionIdSchema
});

export const updateDocumentPathInputSchema = z.object({
  documentCollectionId: documentCollectionIdSchema,
  documentId: documentIdSchema,
  path: pathSchema
});

export const removeDocumentFromCollectionInputSchema = z.object({
  documentCollectionId: documentCollectionIdSchema,
  documentId: documentIdSchema
});

export type AddDocumentToCollectionInput = z.infer<typeof addDocumentToCollectionInputSchema>;
export type GetCollectionDocumentsInput = z.infer<typeof getCollectionDocumentsInputSchema>;
export type UpdateDocumentPathInput = z.infer<typeof updateDocumentPathInputSchema>;
export type RemoveDocumentFromCollectionInput = z.infer<typeof removeDocumentFromCollectionInputSchema>;
