import { createFileRoute } from '@tanstack/react-router';
import { EditDocumentPage } from '@/modules/Document/pages/EditDocumentPage';

export const Route = createFileRoute('/documents/$id/edit')({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();
  return <EditDocumentPage id={id} />;
}