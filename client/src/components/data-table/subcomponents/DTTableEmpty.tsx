import { TableBody } from '@/components/ui/table';
import { DTCell } from './DTCell';
import { DTRow } from './DTRow';
import { FolderCode } from 'lucide-react';
import { Empty, EmptyDescription, EmptyMedia, EmptyTitle } from '@/components/ui/empty';

export function DTTableEmpty({
  icon,
  title,
  description
}: {
  icon?: React.ReactNode;
  title: string;
  description: string;
}) {
  const usingIcon = icon ?? <FolderCode />;
  return (
    <TableBody>
      <DTRow
        gridTemplateColumns={'1fr'}
        className="bg-sidebar hover:bg-sidebar"
      >
        <DTCell className="border-b p-8">
          <Empty>
            <EmptyMedia variant="icon">{usingIcon}</EmptyMedia>
            <EmptyTitle>{title}</EmptyTitle>
            <EmptyDescription>{description}</EmptyDescription>
          </Empty>
        </DTCell>
      </DTRow>
    </TableBody>
  );
}
