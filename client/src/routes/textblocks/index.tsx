import { createFileRoute } from "@tanstack/react-router";
import { TextBlockListPage } from "@/modules/TextBlock/pages/TextBlockListPage";

export const Route = createFileRoute("/textblocks/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <TextBlockListPage />;
}
