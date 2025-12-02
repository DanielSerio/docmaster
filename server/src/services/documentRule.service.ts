import { prisma } from "../lib/prisma.js";
import type {
  UpdateDocumentRulePriorityInput,
  ToggleDocumentRuleEnabledInput,
} from "../lib/schemas/index.js";

export const getDocumentRules = async (documentId: number) => {
  return await prisma.documentRule.findMany({
    where: { documentId },
    include: {
      rule: {
        include: {
          category: true,
        },
      },
    },
    orderBy: { priority: "asc" },
  });
};

export const updateDocumentRulePriority = async (data: UpdateDocumentRulePriorityInput) => {
  return await prisma.$transaction(async (tx) => {
    // Update the junction record
    const documentRule = await tx.documentRule.update({
      where: {
        documentId_ruleId: {
          documentId: data.documentId,
          ruleId: data.ruleId,
        },
      },
      data: {
        priority: data.priority,
      },
      include: {
        rule: {
          include: {
            category: true,
          },
        },
      },
    });

    // Update parent document's updatedAt timestamp
    await tx.document.update({
      where: { id: data.documentId },
      data: { updatedAt: new Date() },
    });

    return documentRule;
  });
};

export const toggleDocumentRuleEnabled = async (data: ToggleDocumentRuleEnabledInput) => {
  return await prisma.$transaction(async (tx) => {
    // Update the junction record
    const documentRule = await tx.documentRule.update({
      where: {
        documentId_ruleId: {
          documentId: data.documentId,
          ruleId: data.ruleId,
        },
      },
      data: {
        isEnabled: data.isEnabled,
      },
      include: {
        rule: {
          include: {
            category: true,
          },
        },
      },
    });

    // Update parent document's updatedAt timestamp
    await tx.document.update({
      where: { id: data.documentId },
      data: { updatedAt: new Date() },
    });

    return documentRule;
  });
};
