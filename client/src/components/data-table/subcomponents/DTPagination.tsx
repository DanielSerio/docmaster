import { Button } from '@/components/ui/button';
import type { PagingController } from '@/hooks/data-table';

export interface DTPaginationProps {
  controller: PagingController;
}

export function DTPagination({ controller: [pagination, methods] }: DTPaginationProps) {
  const currentPage = Math.floor(pagination.offset / pagination.limit) + 1;
  const lastPageDisabled = currentPage >= pagination.totalPages;

  return (
    <footer className="flex justify-end px-4 py-2">
      <Button
        variant="outline"
        size="sm"
        onClick={methods.prevPage}
        disabled={pagination.offset === 0}
      >
        Previous
      </Button>
      <span className="text-muted-foreground mx-2 h-[32px] flex items-center">
        {currentPage} / {pagination.totalPages || 1}
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={methods.nextPage}
        disabled={lastPageDisabled}
      >
        Next
      </Button>
    </footer>
  );
}
