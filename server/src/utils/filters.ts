import type { Prisma } from "@prisma/client";

export interface ColumnFilter {
  id: string;
  value: unknown;
}

/**
 * Builds a Prisma where clause from an array of column filters
 * for the Document model.
 *
 * Supports:
 * - Text search (case-insensitive contains)
 * - Exact match (select filters)
 * - Date ranges (with partial range support)
 *
 * @param filters Array of column filters from the client
 * @returns Prisma DocumentWhereInput object
 */
export const buildDocumentFiltersWhere = (filters?: ColumnFilter[]): Prisma.DocumentWhereInput => {
  if (!filters || filters.length === 0) {
    return {};
  }

  const where: Prisma.DocumentWhereInput = {};

  for (const filter of filters) {
    switch (filter.id) {
      case 'documentType':
        // Handle single select filter (exact match)
        if (typeof filter.value === 'string' && (filter.value === 'general' || filter.value === 'rule')) {
          where.documentType = filter.value;
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
