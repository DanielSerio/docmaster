import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/documents/$id/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/documents/$id/"!</div>;
}
