import { prisma } from "../lib/prisma.js";
import type { CreateRuleInput, UpdateRuleInput } from "../lib/schemas/index.js";

export const createRule = async (data: CreateRuleInput) => {
  return await prisma.$transaction(async (tx) => {
    // Create the rule
    const rule = await tx.rule.create({
      data,
      include: {
        category: true,
      },
    });

    // Get all existing rule documents
    const ruleDocuments = await tx.document.findMany({
      where: { documentType: "rule" },
      select: { id: true },
    });

    // Create junction records for all rule documents
    if (ruleDocuments.length > 0) {
      await tx.documentRule.createMany({
        data: ruleDocuments.map((doc) => ({
          documentId: doc.id,
          ruleId: rule.id,
          priority: rule.defaultPriority,
          isEnabled: true,
        })),
      });
    }

    return rule;
  });
};

export const getAllRules = async () => {
  return await prisma.rule.findMany({
    include: {
      category: true,
    },
    orderBy: { id: "asc" },
  });
};

export const getRuleById = async (id: number) => {
  return await prisma.rule.findUnique({
    where: { id },
    include: {
      category: true,
    },
  });
};

export const updateRule = async (id: number, data: UpdateRuleInput) => {
  return await prisma.rule.update({
    where: { id },
    data,
    include: {
      category: true,
    },
  });
};

export const deleteRule = async (id: number) => {
  return await prisma.rule.delete({
    where: { id },
    include: {
      category: true,
    },
  });
};
