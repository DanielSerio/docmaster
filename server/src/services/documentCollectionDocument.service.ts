import { prisma } from "../lib/prisma.js";
import { withErrorHandling } from "../utils/errors.js";
import type {
  AddDocumentToCollectionInput,
  UpdateDocumentPathInput,
  RemoveDocumentFromCollectionInput,
} from "../lib/schemas/index.js";

const addDocumentToCollectionImpl = async (data: AddDocumentToCollectionInput) => {
  return await prisma.documentCollectionDocument.create({
    data,
    include: {
      document: true,
    },
  });
};

const getCollectionDocumentsImpl = async (documentCollectionId: number) => {
  return await prisma.documentCollectionDocument.findMany({
    where: { documentCollectionId },
    include: {
      document: true,
    },
    orderBy: { path: "asc" },
  });
};

const updateDocumentPathImpl = async (data: UpdateDocumentPathInput) => {
  return await prisma.documentCollectionDocument.update({
    where: {
      documentCollectionId_documentId: {
        documentCollectionId: data.documentCollectionId,
        documentId: data.documentId,
      },
    },
    data: {
      path: data.path,
    },
    include: {
      document: true,
    },
  });
};

const removeDocumentFromCollectionImpl = async (data: RemoveDocumentFromCollectionInput) => {
  return await prisma.documentCollectionDocument.delete({
    where: {
      documentCollectionId_documentId: {
        documentCollectionId: data.documentCollectionId,
        documentId: data.documentId,
      },
    },
    include: {
      document: true,
    },
  });
};

export const addDocumentToCollection = withErrorHandling(addDocumentToCollectionImpl, "Collection document");
export const getCollectionDocuments = withErrorHandling(getCollectionDocumentsImpl, "Collection document");
export const updateDocumentPath = withErrorHandling(updateDocumentPathImpl, "Collection document");
export const removeDocumentFromCollection = withErrorHandling(removeDocumentFromCollectionImpl, "Collection document");
