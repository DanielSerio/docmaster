import { prisma } from "../lib/prisma.js";
import type { CreateDocumentCollectionInput, UpdateDocumentCollectionInput } from "../lib/schemas/index.js";

export const createDocumentCollection = async (data: CreateDocumentCollectionInput) => {
  return await prisma.documentCollection.create({
    data,
  });
};

export const getAllDocumentCollections = async () => {
  return await prisma.documentCollection.findMany({
    orderBy: { id: "asc" },
  });
};

export const getDocumentCollectionById = async (id: number) => {
  return await prisma.documentCollection.findUnique({
    where: { id },
  });
};

export const updateDocumentCollection = async (id: number, data: UpdateDocumentCollectionInput) => {
  return await prisma.documentCollection.update({
    where: { id },
    data: {
      ...data,
      updatedAt: new Date(),
    },
  });
};

export const deleteDocumentCollection = async (id: number) => {
  return await prisma.documentCollection.delete({
    where: { id },
  });
};
