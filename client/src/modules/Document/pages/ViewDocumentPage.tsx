import { Page } from "@/components/layout";
import type { EntityPageProps } from "../types";

export function ViewDocumentPage({ id }: EntityPageProps) {
  return (
    <Page>
      <div>
        <h1>View Document {id}</h1>
      </div>
    </Page>
  );
}
