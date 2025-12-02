import { TRPCError } from "@trpc/server";
import { prisma } from "../lib/prisma.js";
import { withErrorHandling } from "../utils/errors.js";
import type { CreateRuleCategoryInput, UpdateRuleCategoryInput } from "../lib/schemas/index.js";

const createRuleCategoryImpl = async (data: CreateRuleCategoryInput) => {
  return await prisma.ruleCategory.create({
    data,
  });
};

const getAllRuleCategoriesImpl = async () => {
  return await prisma.ruleCategory.findMany({
    orderBy: { id: "asc" },
  });
};

const getRuleCategoryByIdImpl = async (id: number) => {
  const ruleCategory = await prisma.ruleCategory.findUnique({
    where: { id },
  });

  if (!ruleCategory) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: `Rule category with id ${id} not found`,
    });
  }

  return ruleCategory;
};

const updateRuleCategoryImpl = async (id: number, data: UpdateRuleCategoryInput) => {
  return await prisma.ruleCategory.update({
    where: { id },
    data,
  });
};

const deleteRuleCategoryImpl = async (id: number) => {
  return await prisma.ruleCategory.delete({
    where: { id },
  });
};

export const createRuleCategory = withErrorHandling(createRuleCategoryImpl, "Rule category");
export const getAllRuleCategories = withErrorHandling(getAllRuleCategoriesImpl, "Rule category");
export const getRuleCategoryById = withErrorHandling(getRuleCategoryByIdImpl, "Rule category");
export const updateRuleCategory = withErrorHandling(updateRuleCategoryImpl, "Rule category");
export const deleteRuleCategory = withErrorHandling(deleteRuleCategoryImpl, "Rule category");
