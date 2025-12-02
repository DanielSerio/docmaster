import { Page } from "@/components/layout";
import type { EntityPageProps } from "../types";

export function DocumentBlocksPage({ id }: EntityPageProps) {
  return (
    <Page>
      <div>
        <h1>Document Blocks {id}</h1>
      </div>
    </Page>
  );
}