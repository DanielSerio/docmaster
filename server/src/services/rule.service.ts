import { TRPCError } from "@trpc/server";
import { prisma } from "../lib/prisma.js";
import { withErrorHandling } from "../utils/errors.js";
import type { CreateRuleInput, UpdateRuleInput, BatchUpdateRulesInput } from "../lib/schemas/index.js";

const createRuleImpl = async (data: CreateRuleInput) => {
  return await prisma.$transaction(async (tx) => {
    // Upsert category to get ID
    const category = await tx.ruleCategory.upsert({
      where: { name: data.categoryName },
      create: { name: data.categoryName },
      update: {},
    });

    // Create the rule with categoryId
    const rule = await tx.rule.create({
      data: {
        categoryId: category.id,
        rawContent: data.rawContent,
        defaultPriority: data.defaultPriority,
      },
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
  return await prisma.$transaction(async (tx) => {
    // Upsert category to get ID
    const category = await tx.ruleCategory.upsert({
      where: { name: data.categoryName },
      create: { name: data.categoryName },
      update: {},
    });

    // Update the rule with categoryId
    return await tx.rule.update({
      where: { id },
      data: {
        categoryId: category.id,
        rawContent: data.rawContent,
        defaultPriority: data.defaultPriority,
      },
      include: {
        category: true,
      },
    });
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

const batchUpdateRulesImpl = async (data: BatchUpdateRulesInput) => {
  return await prisma.$transaction(async (tx) => {
    // 1. Delete rules
    if (data.deletedIds.length > 0) {
      await tx.rule.deleteMany({
        where: {
          id: { in: data.deletedIds }
        }
      });
    }

    // 2. Update existing rules
    for (const rule of data.updatedRules) {
      // Upsert category to get ID
      const category = await tx.ruleCategory.upsert({
        where: { name: rule.categoryName },
        create: { name: rule.categoryName },
        update: {},
      });

      await tx.rule.update({
        where: { id: rule.id },
        data: {
          categoryId: category.id,
          rawContent: rule.rawContent,
          defaultPriority: rule.defaultPriority
        }
      });
    }

    // 3. Create new rules
    const newRules = [];
    for (const ruleData of data.newRules) {
      // Upsert category to get ID
      const category = await tx.ruleCategory.upsert({
        where: { name: ruleData.categoryName },
        create: { name: ruleData.categoryName },
        update: {},
      });

      const rule = await tx.rule.create({
        data: {
          categoryId: category.id,
          rawContent: ruleData.rawContent,
          defaultPriority: ruleData.defaultPriority,
        },
        include: {
          category: true
        }
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

      newRules.push(rule);
    }

    // 4. Return updated full list
    return await tx.rule.findMany({
      include: {
        category: true
      },
      orderBy: { id: "asc" }
    });
  });
};

export const createRule = withErrorHandling(createRuleImpl, "Rule");
export const getAllRules = withErrorHandling(getAllRulesImpl, "Rule");
export const getRuleById = withErrorHandling(getRuleByIdImpl, "Rule");
export const updateRule = withErrorHandling(updateRuleImpl, "Rule");
export const deleteRule = withErrorHandling(deleteRuleImpl, "Rule");
export const batchUpdateRules = withErrorHandling(batchUpdateRulesImpl, "Rule");
