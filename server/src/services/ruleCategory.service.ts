import { prisma } from "../lib/prisma.js";
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
  return await prisma.ruleCategory.findUnique({
    where: { id },
  });
};

export const updateRuleCategory = async (id: number, data: UpdateRuleCategoryInput) => {
  return await prisma.ruleCategory.update({
    where: { id },
    data,
  });
};

export const deleteRuleCategory = async (id: number) => {
  return await prisma.ruleCategory.delete({
    where: { id },
  });
};
