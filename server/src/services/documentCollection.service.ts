import { TRPCError } from "@trpc/server";
import { prisma } from "../lib/prisma.js";
import { withErrorHandling } from "../utils/errors.js";
import type { CreateDocumentCollectionInput, UpdateDocumentCollectionInput } from "../lib/schemas/index.js";
import { buildCollectionFiltersWhere, type ColumnFilter } from "../utils/filters.js";
import { buildCollectionSortingOrderBy, type ColumnSort } from "../utils/sorting.js";

const createDocumentCollectionImpl = async (data: CreateDocumentCollectionInput) => {
  return await prisma.documentCollection.create({
    data,
  });
};

const getAllDocumentCollectionsImpl = async ({
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
  const where = buildCollectionFiltersWhere(filters);
  const orderBy = buildCollectionSortingOrderBy(sorting);

  const results = await prisma.documentCollection.findMany({
    where,
    orderBy,
    skip: offset,
    take: limit,
  });

  const count = await prisma.documentCollection.count({ where });

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

const getDocumentCollectionByIdImpl = async (id: number) => {
  const documentCollection = await prisma.documentCollection.findUnique({
    where: { id },
  });

  if (!documentCollection) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: `Document collection with id ${id} not found`,
    });
  }

  return documentCollection;
};

const updateDocumentCollectionImpl = async (id: number, data: UpdateDocumentCollectionInput) => {
  return await prisma.documentCollection.update({
    where: { id },
    data
  });
};

const deleteDocumentCollectionImpl = async (id: number) => {
  return await prisma.documentCollection.delete({
    where: { id },
  });
};

export const createDocumentCollection = withErrorHandling(createDocumentCollectionImpl, "Document collection");
export const getAllDocumentCollections = withErrorHandling(getAllDocumentCollectionsImpl, "Document collection");
export const getDocumentCollectionById = withErrorHandling(getDocumentCollectionByIdImpl, "Document collection");
export const updateDocumentCollection = withErrorHandling(updateDocumentCollectionImpl, "Document collection");
export const deleteDocumentCollection = withErrorHandling(deleteDocumentCollectionImpl, "Document collection");
