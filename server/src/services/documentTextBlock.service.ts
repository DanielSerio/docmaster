import { prisma } from "../lib/prisma.js";
import type {
  UpdateDocumentTextBlockPriorityInput,
  ToggleDocumentTextBlockEnabledInput,
} from "../lib/schemas/index.js";

export const getDocumentTextBlocks = async (documentId: number) => {
  return await prisma.documentTextBlock.findMany({
    where: { documentId },
    include: {
      textBlock: true,
    },
    orderBy: { priority: "asc" },
  });
};

export const updateDocumentTextBlockPriority = async (data: UpdateDocumentTextBlockPriorityInput) => {
  return await prisma.$transaction(async (tx) => {
    // Update the junction record
    const documentTextBlock = await tx.documentTextBlock.update({
      where: {
        documentId_textBlockId: {
          documentId: data.documentId,
          textBlockId: data.textBlockId,
        },
      },
      data: {
        priority: data.priority,
      },
      include: {
        textBlock: true,
      },
    });

    // Update parent document's updatedAt timestamp
    await tx.document.update({
      where: { id: data.documentId },
      data: { updatedAt: new Date() },
    });

    return documentTextBlock;
  });
};

export const toggleDocumentTextBlockEnabled = async (data: ToggleDocumentTextBlockEnabledInput) => {
  return await prisma.$transaction(async (tx) => {
    // Update the junction record
    const documentTextBlock = await tx.documentTextBlock.update({
      where: {
        documentId_textBlockId: {
          documentId: data.documentId,
          textBlockId: data.textBlockId,
        },
      },
      data: {
        isEnabled: data.isEnabled,
      },
      include: {
        textBlock: true,
      },
    });

    // Update parent document's updatedAt timestamp
    await tx.document.update({
      where: { id: data.documentId },
      data: { updatedAt: new Date() },
    });

    return documentTextBlock;
  });
};
