import { createFileRoute } from '@tanstack/react-router';
import { ViewDocumentPage } from '@/modules/Document/pages/ViewDocumentPage';

export const Route = createFileRoute('/documents/$id/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();
  return <ViewDocumentPage id={id} />;
}
