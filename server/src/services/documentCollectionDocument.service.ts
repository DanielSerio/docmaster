import { prisma } from "../lib/prisma.js";
import type {
  AddDocumentToCollectionInput,
  UpdateDocumentPathInput,
  RemoveDocumentFromCollectionInput,
} from "../lib/schemas/index.js";

export const addDocumentToCollection = async (data: AddDocumentToCollectionInput) => {
  return await prisma.documentCollectionDocument.create({
    data,
    include: {
      document: true,
    },
  });
};

export const getCollectionDocuments = async (documentCollectionId: number) => {
  return await prisma.documentCollectionDocument.findMany({
    where: { documentCollectionId },
    include: {
      document: true,
    },
    orderBy: { path: "asc" },
  });
};

export const updateDocumentPath = async (data: UpdateDocumentPathInput) => {
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

export const removeDocumentFromCollection = async (data: RemoveDocumentFromCollectionInput) => {
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
