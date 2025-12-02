import { NewDocumentPage } from '@/modules/Document/pages/NewDocumentPage';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/documents/new')({
  component: NewDocumentPage,
});
