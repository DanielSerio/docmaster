import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/rules/new')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/rules/new"!</div>;
}
