import { TRPCError } from "@trpc/server";
import { prisma } from "../lib/prisma.js";
import { handlePrismaError } from "../utils/errors.js";
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
  const documentCollection = await prisma.documentCollection.findUnique({
    where: { id },
  });

  if (!documentCollection) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: `Document collection with id ${id} not found`,
    });
  }

  return documentCollection;
};

export const updateDocumentCollection = async (id: number, data: UpdateDocumentCollectionInput) => {
  try {
    return await prisma.documentCollection.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
  } catch (error) {
    return handlePrismaError(error, "Document collection");
  }
};

export const deleteDocumentCollection = async (id: number) => {
  try {
    return await prisma.documentCollection.delete({
      where: { id },
    });
  } catch (error) {
    return handlePrismaError(error, "Document collection");
  }
};
