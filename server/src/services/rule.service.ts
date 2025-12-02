import { TRPCError } from "@trpc/server";
import { prisma } from "../lib/prisma.js";
import { withErrorHandling } from "../utils/errors.js";
import type { CreateRuleInput, UpdateRuleInput } from "../lib/schemas/index.js";

const createRuleImpl = async (data: CreateRuleInput) => {
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

const getAllRulesImpl = async () => {
  return await prisma.rule.findMany({
    include: {
      category: true,
    },
    orderBy: { id: "asc" },
  });
};

const getRuleByIdImpl = async (id: number) => {
  const rule = await prisma.rule.findUnique({
    where: { id },
    include: {
      category: true,
    },
  });

  if (!rule) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: `Rule with id ${id} not found`,
    });
  }

  return rule;
};

const updateRuleImpl = async (id: number, data: UpdateRuleInput) => {
  return await prisma.rule.update({
    where: { id },
    data,
    include: {
      category: true,
    },
  });
};

const deleteRuleImpl = async (id: number) => {
  return await prisma.rule.delete({
    where: { id },
    include: {
      category: true,
    },
  });
};

export const createRule = withErrorHandling(createRuleImpl, "Rule");
export const getAllRules = withErrorHandling(getAllRulesImpl, "Rule");
export const getRuleById = withErrorHandling(getRuleByIdImpl, "Rule");
export const updateRule = withErrorHandling(updateRuleImpl, "Rule");
export const deleteRule = withErrorHandling(deleteRuleImpl, "Rule");
