import { prisma } from "../lib/prisma.js";
import { withErrorHandling } from "../utils/errors.js";
import type {
  UpdateDocumentTextBlockPriorityInput,
  ToggleDocumentTextBlockEnabledInput,
} from "../lib/schemas/index.js";

const getDocumentTextBlocksImpl = async (documentId: number) => {
  return await prisma.documentTextBlock.findMany({
    where: { documentId },
    include: {
      textBlock: true,
    },
    orderBy: { priority: "asc" },
  });
};

const updateDocumentTextBlockPriorityImpl = async (data: UpdateDocumentTextBlockPriorityInput) => {
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

const toggleDocumentTextBlockEnabledImpl = async (data: ToggleDocumentTextBlockEnabledInput) => {
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

export const getDocumentTextBlocks = withErrorHandling(getDocumentTextBlocksImpl, "Document text block");
export const updateDocumentTextBlockPriority = withErrorHandling(updateDocumentTextBlockPriorityImpl, "Document text block");
export const toggleDocumentTextBlockEnabled = withErrorHandling(toggleDocumentTextBlockEnabledImpl, "Document text block");
