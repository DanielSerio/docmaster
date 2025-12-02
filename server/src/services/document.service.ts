import { prisma } from "../lib/prisma.js";
import type { CreateDocumentInput, UpdateDocumentInput } from "../lib/schemas/index.js";

export const createDocument = async (data: CreateDocumentInput) => {
  return await prisma.$transaction(async (tx) => {
    // Create the document
    const document = await tx.document.create({
      data,
    });

    if (data.documentType === "rule") {
      // Get all existing rules
      const rules = await tx.rule.findMany({
        select: { id: true, defaultPriority: true },
      });

      // Create junction records for all rules
      if (rules.length > 0) {
        await tx.documentRule.createMany({
          data: rules.map((rule) => ({
            documentId: document.id,
            ruleId: rule.id,
            priority: rule.defaultPriority,
            isEnabled: true,
          })),
        });
      }
    } else if (data.documentType === "general") {
      // Get all existing text blocks
      const textBlocks = await tx.textBlock.findMany({
        select: { id: true, defaultPriority: true },
      });

      // Create junction records for all text blocks
      if (textBlocks.length > 0) {
        await tx.documentTextBlock.createMany({
          data: textBlocks.map((textBlock) => ({
            documentId: document.id,
            textBlockId: textBlock.id,
            priority: textBlock.defaultPriority,
            isEnabled: false,
          })),
        });
      }
    }

    return document;
  });
};

export const getAllDocuments = async () => {
  return await prisma.document.findMany({
    orderBy: { id: "asc" },
  });
};

export const getDocumentById = async (id: number) => {
  return await prisma.document.findUnique({
    where: { id },
  });
};

export const updateDocument = async (id: number, data: UpdateDocumentInput) => {
  return await prisma.document.update({
    where: { id },
    data: {
      ...data,
      updatedAt: new Date(),
    },
  });
};

export const deleteDocument = async (id: number) => {
  return await prisma.document.delete({
    where: { id },
  });
};
