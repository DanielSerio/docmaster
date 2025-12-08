import { Page } from "@/components/layout";
import type { EntityPageProps } from "../types";

export function DocumentRulesPage({ id }: EntityPageProps) {
  return (
    <Page>
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-6">
          Document Rules - Priority Overrides
        </h1>
        <p className="text-muted-foreground">
          This page will allow enabling/disabling rules and setting priority
          overrides for document {id}.
        </p>
        <p className="text-muted-foreground mt-2">
          (To be implemented: EditSheet for document-rule junction table)
        </p>
      </div>
    </Page>
  );
}