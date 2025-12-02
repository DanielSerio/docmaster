import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/documents/$id/blocks')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/documents/$id/blocks"!</div>
}
