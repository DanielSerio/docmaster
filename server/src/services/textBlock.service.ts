import { TRPCError } from "@trpc/server";
import { prisma } from "../lib/prisma.js";
import { withErrorHandling } from "../utils/errors.js";
import type { CreateTextBlockInput, UpdateTextBlockInput } from "../lib/schemas/index.js";

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

export const createTextBlock = withErrorHandling(createTextBlockImpl, "Text block");
export const getAllTextBlocks = withErrorHandling(getAllTextBlocksImpl, "Text block");
export const getTextBlockById = withErrorHandling(getTextBlockByIdImpl, "Text block");
export const updateTextBlock = withErrorHandling(updateTextBlockImpl, "Text block");
export const deleteTextBlock = withErrorHandling(deleteTextBlockImpl, "Text block");
