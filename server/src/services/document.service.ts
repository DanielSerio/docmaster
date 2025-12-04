import { TRPCError } from "@trpc/server";
import { prisma } from "../lib/prisma.js";
import { withErrorHandling } from "../utils/errors.js";
import type { CreateDocumentInput, UpdateDocumentInput } from "../lib/schemas/index.js";
import type { Prisma } from "@prisma/client";

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

interface ColumnFilter {
  id: string;
  value: unknown;
}

interface ColumnSort {
  id: string;
  desc: boolean;
}

const buildFiltersWhere = (filters?: ColumnFilter[]): Prisma.DocumentWhereInput => {
  if (!filters || filters.length === 0) {
    return {};
  }

  const where: Prisma.DocumentWhereInput = {};

  for (const filter of filters) {
    switch (filter.id) {
      case 'documentType':
        // Handle single select filter (exact match)
        if (typeof filter.value === 'string') {
          where.documentType = filter.value as 'general' | 'rule';
        }
        break;

      case 'filename':
        // Handle search filter (case-insensitive contains)
        if (typeof filter.value === 'string') {
          where.filename = {
            contains: filter.value,
            mode: 'insensitive'
          };
        }
        break;

      case 'createdAt':
        // Handle date range filter (supports partial ranges)
        if (filter.value && typeof filter.value === 'object') {
          const range = filter.value as { from?: string; to?: string };
          where.createdAt = {};
          if (range.from) {
            where.createdAt.gte = new Date(range.from);
          }
          if (range.to) {
            where.createdAt.lte = new Date(range.to);
          }
        }
        break;

      // Example: Multi-select filter (would use 'in' operator)
      // case 'status':
      //   if (Array.isArray(filter.value) && filter.value.length > 0) {
      //     where.status = {
      //       in: filter.value as string[]
      //     };
      //   }
      //   break;

      // Example: Number range filter (supports partial ranges)
      // case 'priority':
      //   if (filter.value && typeof filter.value === 'object') {
      //     const range = filter.value as { min?: number; max?: number };
      //     where.priority = {};
      //     if (range.min !== undefined) {
      //       where.priority.gte = range.min;
      //     }
      //     if (range.max !== undefined) {
      //       where.priority.lte = range.max;
      //     }
      //   }
      //   break;
    }
  }

  return where;
};

const buildSortingOrderBy = (sorting?: ColumnSort[]): Record<string, 'asc' | 'desc'>[] | Record<string, 'asc' | 'desc'> => {
  if (!sorting || sorting.length === 0) {
    return { id: "asc" };
  }

  // Map column IDs to database field names (only valid fields)
  const fieldMap: Record<string, string> = {
    'filename': 'filename',
    'documentType': 'documentType',
    'createdAt': 'createdAt',
    'updatedAt': 'updatedAt'
  };

  // Filter to only include valid fields to prevent server crashes
  const validSorts = sorting.filter(sort => fieldMap[sort.id] !== undefined);

  if (validSorts.length === 0) {
    return { id: "asc" };
  }

  if (validSorts.length === 1) {
    const sort = validSorts[0];
    const field = fieldMap[sort.id];
    return { [field]: sort.desc ? 'desc' : 'asc' };
  }

  // Multi-column sorting
  return validSorts.map(sort => {
    const field = fieldMap[sort.id];
    return { [field]: sort.desc ? 'desc' : 'asc' } as Record<string, 'asc' | 'desc'>;
  });
};

const getAllDocumentsImpl = async ({
  offset,
  limit,
  filters,
  sorting
}: {
  offset: number;
  limit: number;
  filters?: ColumnFilter[];
  sorting?: ColumnSort[];
}) => {
  const where = buildFiltersWhere(filters);
  const orderBy = buildSortingOrderBy(sorting);

  const results = await prisma.document.findMany({
    where,
    orderBy,
    skip: offset,
    take: limit,
  });

  const count = await prisma.document.count({ where });

  return {
    paging: {
      offset,
      limit,
      total: {
        pages: Math.ceil(count / limit),
        records: count,
      }
    },
    results,
  };
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
