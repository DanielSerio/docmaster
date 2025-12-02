import { createFileRoute } from '@tanstack/react-router';
import { DocumentBlocksPage } from '@/modules/Document/pages/DocumentBlocksPage';

export const Route = createFileRoute('/documents/$id/blocks')({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();
  return <DocumentBlocksPage id={id} />;
}