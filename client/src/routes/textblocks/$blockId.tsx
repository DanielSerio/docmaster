import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/textblocks/$blockId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/textblocks/$blockId"!</div>
}
