import { TRPCError } from "@trpc/server";
import { prisma } from "../lib/prisma.js";
import { handlePrismaError } from "../utils/errors.js";
import type { CreateRuleCategoryInput, UpdateRuleCategoryInput } from "../lib/schemas/index.js";

export const createRuleCategory = async (data: CreateRuleCategoryInput) => {
  return await prisma.ruleCategory.create({
    data,
  });
};

export const getAllRuleCategories = async () => {
  return await prisma.ruleCategory.findMany({
    orderBy: { id: "asc" },
  });
};

export const getRuleCategoryById = async (id: number) => {
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

export const updateRuleCategory = async (id: number, data: UpdateRuleCategoryInput) => {
  try {
    return await prisma.ruleCategory.update({
      where: { id },
      data,
    });
  } catch (error) {
    return handlePrismaError(error, "Rule category");
  }
};

export const deleteRuleCategory = async (id: number) => {
  try {
    return await prisma.ruleCategory.delete({
      where: { id },
    });
  } catch (error) {
    return handlePrismaError(error, "Rule category");
  }
};
