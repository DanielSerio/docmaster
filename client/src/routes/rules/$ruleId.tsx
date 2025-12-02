import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/rules/$ruleId')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/rules/$ruleId"!</div>;
}
