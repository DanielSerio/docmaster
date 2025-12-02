import { TRPCError } from "@trpc/server";
import { prisma } from "../lib/prisma.js";
import { withErrorHandling } from "../utils/errors.js";
import type { CreateDocumentInput, UpdateDocumentInput } from "../lib/schemas/index.js";

const createDocumentImpl = async (data: CreateDocumentInput) => {
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

const getAllDocumentsImpl = async () => {
  return await prisma.document.findMany({
    orderBy: { id: "asc" },
  });
};

const getDocumentByIdImpl = async (id: number) => {
  const document = await prisma.document.findUnique({
    where: { id },
  });

  if (!document) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: `Document with id ${id} not found`,
    });
  }

  return document;
};

const updateDocumentImpl = async (id: number, data: UpdateDocumentInput) => {
  return await prisma.document.update({
    where: { id },
    data,
  });
};

const deleteDocumentImpl = async (id: number) => {
  return await prisma.document.delete({
    where: { id },
  });
};

export const createDocument = withErrorHandling(createDocumentImpl, "Document");
export const getAllDocuments = withErrorHandling(getAllDocumentsImpl, "Document");
export const getDocumentById = withErrorHandling(getDocumentByIdImpl, "Document");
export const updateDocument = withErrorHandling(updateDocumentImpl, "Document");
export const deleteDocument = withErrorHandling(deleteDocumentImpl, "Document");
