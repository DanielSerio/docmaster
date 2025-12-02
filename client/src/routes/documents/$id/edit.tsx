import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/documents/$id/edit')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/documents/$id/edit"!</div>;
}
