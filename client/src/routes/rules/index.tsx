import { createFileRoute } from "@tanstack/react-router";
import { RuleListPage } from "@/modules/Rule/pages/RuleListPage";

export const Route = createFileRoute("/rules/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <RuleListPage />;
}
