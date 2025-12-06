import { prisma } from "../lib/prisma.js";
import { withErrorHandling } from "../utils/errors.js";
import type {
  UpdateDocumentRulePriorityInput,
  ToggleDocumentRuleEnabledInput,
  BatchUpdateDocumentRulesInput,
} from "../lib/schemas/index.js";

const getDocumentRulesImpl = async (documentId: number) => {
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

const updateDocumentRulePriorityImpl = async (data: UpdateDocumentRulePriorityInput) => {
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

const toggleDocumentRuleEnabledImpl = async (data: ToggleDocumentRuleEnabledInput) => {
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

const batchUpdateDocumentRulesImpl = async (data: BatchUpdateDocumentRulesInput) => {
  return await prisma.$transaction(async (tx) => {
    // 1. Delete rules
    if (data.deletedRuleIds.length > 0) {
      await tx.documentRule.deleteMany({
        where: {
          documentId: data.documentId,
          ruleId: { in: data.deletedRuleIds }
        }
      });
    }

    // 2. Update existing rules
    for (const rule of data.updatedRules) {
      await tx.documentRule.update({
        where: {
          documentId_ruleId: {
            documentId: data.documentId,
            ruleId: rule.ruleId
          }
        },
        data: {
          priority: rule.priority,
          isEnabled: rule.isEnabled
        }
      });
    }

    // 3. Create new rules
    if (data.newRules.length > 0) {
      await tx.documentRule.createMany({
        data: data.newRules.map(rule => ({
          documentId: data.documentId,
          ruleId: rule.ruleId,
          priority: rule.priority,
          isEnabled: rule.isEnabled
        }))
      });
    }

    // 4. Update parent document's updatedAt timestamp
    await tx.document.update({
      where: { id: data.documentId },
      data: { updatedAt: new Date() }
    });

    // 5. Return updated full list
    return await tx.documentRule.findMany({
      where: { documentId: data.documentId },
      include: {
        rule: {
          include: {
            category: true
          }
        }
      },
      orderBy: { priority: "asc" }
    });
  });
};

export const getDocumentRules = withErrorHandling(getDocumentRulesImpl, "Document rule");
export const updateDocumentRulePriority = withErrorHandling(updateDocumentRulePriorityImpl, "Document rule");
export const toggleDocumentRuleEnabled = withErrorHandling(toggleDocumentRuleEnabledImpl, "Document rule");
export const batchUpdateDocumentRules = withErrorHandling(batchUpdateDocumentRulesImpl, "Document rule");
