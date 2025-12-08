import { TRPCError } from "@trpc/server";
import { prisma } from "../lib/prisma.js";
import { withErrorHandling } from "../utils/errors.js";
import type { CreateTextBlockInput, UpdateTextBlockInput, BatchUpdateTextBlocksInput } from "../lib/schemas/index.js";

const createTextBlockImpl = async (data: CreateTextBlockInput) => {
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

const getAllTextBlocksImpl = async () => {
  return await prisma.textBlock.findMany({
    orderBy: { id: "asc" },
  });
};

const getTextBlockByIdImpl = async (id: number) => {
  const textBlock = await prisma.textBlock.findUnique({
    where: { id },
  });

  if (!textBlock) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: `Text block with id ${id} not found`,
    });
  }

  return textBlock;
};

const updateTextBlockImpl = async (id: number, data: UpdateTextBlockInput) => {
  return await prisma.textBlock.update({
    where: { id },
    data,
  });
};

const deleteTextBlockImpl = async (id: number) => {
  return await prisma.textBlock.delete({
    where: { id },
  });
};

const batchUpdateTextBlocksImpl = async (data: BatchUpdateTextBlocksInput) => {
  return await prisma.$transaction(async (tx) => {
    // 1. Delete text blocks
    if (data.deletedIds.length > 0) {
      await tx.textBlock.deleteMany({
        where: {
          id: { in: data.deletedIds }
        }
      });
    }

    // 2. Update existing text blocks
    for (const textBlock of data.updatedTextBlocks) {
      await tx.textBlock.update({
        where: { id: textBlock.id },
        data: {
          rawContent: textBlock.rawContent,
          defaultPriority: textBlock.defaultPriority
        }
      });
    }

    // 3. Create new text blocks
    if (data.newTextBlocks.length > 0) {
      // Get all existing general documents once (outside the loop)
      const generalDocuments = await tx.document.findMany({
        where: { documentType: "general" },
        select: { id: true },
      });

      for (const textBlockData of data.newTextBlocks) {
        const textBlock = await tx.textBlock.create({
          data: {
            rawContent: textBlockData.rawContent,
            defaultPriority: textBlockData.defaultPriority,
          }
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
      }
    }

    // 4. Return updated full list
    return await tx.textBlock.findMany({
      orderBy: { id: "asc" }
    });
  });
};

export const createTextBlock = withErrorHandling(createTextBlockImpl, "Text block");
export const getAllTextBlocks = withErrorHandling(getAllTextBlocksImpl, "Text block");
export const getTextBlockById = withErrorHandling(getTextBlockByIdImpl, "Text block");
export const updateTextBlock = withErrorHandling(updateTextBlockImpl, "Text block");
export const deleteTextBlock = withErrorHandling(deleteTextBlockImpl, "Text block");
export const batchUpdateTextBlocks = withErrorHandling(batchUpdateTextBlocksImpl, "Text block");
