import { prisma } from "../lib/prisma.js";
import type { CreateTextBlockInput, UpdateTextBlockInput } from "../lib/schemas/index.js";

export const createTextBlock = async (data: CreateTextBlockInput) => {
  return await prisma.$transaction(async (tx) => {
    // Create the text block
    const textBlock = await tx.textBlock.create({
      data,
    });

    // Get all existing general documents
    const generalDocuments = await tx.document.findMany({
      where: { documentType: "general" },
      select: { id: true },
    });

    // Create junction records for all general documents
    if (generalDocuments.length > 0) {
      await tx.documentTextBlock.createMany({
        data: generalDocuments.map((doc) => ({
          documentId: doc.id,
          textBlockId: textBlock.id,
          priority: textBlock.defaultPriority,
          isEnabled: false,
        })),
      });
    }

    return textBlock;
  });
};

export const getAllTextBlocks = async () => {
  return await prisma.textBlock.findMany({
    orderBy: { id: "asc" },
  });
};

export const getTextBlockById = async (id: number) => {
  return await prisma.textBlock.findUnique({
    where: { id },
  });
};

export const updateTextBlock = async (id: number, data: UpdateTextBlockInput) => {
  return await prisma.textBlock.update({
    where: { id },
    data,
  });
};

export const deleteTextBlock = async (id: number) => {
  return await prisma.textBlock.delete({
    where: { id },
  });
};
