import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/collections/$collectionId/download')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/collections/$collectionId/download"!</div>;
}
