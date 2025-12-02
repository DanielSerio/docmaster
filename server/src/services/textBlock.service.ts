import { TRPCError } from "@trpc/server";
import { prisma } from "../lib/prisma.js";
import { handlePrismaError } from "../utils/errors.js";
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

export const updateTextBlock = async (id: number, data: UpdateTextBlockInput) => {
  try {
    return await prisma.textBlock.update({
      where: { id },
      data,
    });
  } catch (error) {
    return handlePrismaError(error, "Text block");
  }
};

export const deleteTextBlock = async (id: number) => {
  try {
    return await prisma.textBlock.delete({
      where: { id },
    });
  } catch (error) {
    return handlePrismaError(error, "Text block");
  }
};
