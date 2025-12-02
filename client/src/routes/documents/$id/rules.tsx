import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/documents/$id/rules')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/documents/$id/rules"!</div>;
}
