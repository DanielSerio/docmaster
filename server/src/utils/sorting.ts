export interface ColumnSort {
  id: string;
  desc: boolean;
}

/**
 * Builds a Prisma orderBy clause from an array of column sorts
 * for the Document model.
 *
 * Only includes valid field names from the fieldMap to prevent
 * server crashes from invalid client input.
 *
 * @param sorting Array of column sorts from the client
 * @returns Prisma orderBy clause (single object or array)
 */
export const buildDocumentSortingOrderBy = (sorting?: ColumnSort[]): Record<string, 'asc' | 'desc'>[] | Record<string, 'asc' | 'desc'> => {
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
    const field = fieldMap[sort.id]!;
    return { [field]: sort.desc ? 'desc' : 'asc' };
  }

  // Multi-column sorting
  return validSorts.map(sort => {
    const field = fieldMap[sort.id]!;
    return { [field]: sort.desc ? 'desc' : 'asc' };
  });
};
