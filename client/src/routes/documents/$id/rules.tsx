import { createFileRoute } from '@tanstack/react-router';
import { DocumentRulesPage } from '@/modules/Document/pages/DocumentRulesPage';

export const Route = createFileRoute('/documents/$id/rules')({
  component: RouteComponent,
});


function RouteComponent() {
  const { id } = Route.useParams();
  return <DocumentRulesPage id={id} />;
};