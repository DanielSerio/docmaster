import { DocumentListPage } from '@/modules/Document/pages/DocumentListPage';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/documents/')({
  component: DocumentListPage,
});
