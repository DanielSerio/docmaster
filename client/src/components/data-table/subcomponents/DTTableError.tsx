import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TableBody } from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { DTRow } from './DTRow';
import { DTCell } from './DTCell';

export function DTTableError({ error }: { error: Error }) {
  const alertClassNames = cn(
    'w-[fit-content] max-w-[640px] mx-auto', // layout
    'bg-destructive/2 border-destructive/25' // colors
  );

  return (
    <TableBody>
      <DTRow
        gridTemplateColumns={'1fr'}
        className="bg-sidebar hover:bg-sidebar"
      >
        <DTCell className="border-b p-8">
          <Alert
            variant="destructive"
            className={alertClassNames}
          >
            <AlertCircle />
            <AlertTitle>{error.name}</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        </DTCell>
      </DTRow>
    </TableBody>
  );
}
