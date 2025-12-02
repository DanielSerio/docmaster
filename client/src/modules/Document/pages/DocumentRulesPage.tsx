import { Page } from "@/components/layout";
import type { EntityPageProps } from "../types";

export function DocumentRulesPage({ id }: EntityPageProps) {
  return (
    <Page>
      <div>
        <h1>Document Rules {id}</h1>
      </div>
    </Page>
  );
}