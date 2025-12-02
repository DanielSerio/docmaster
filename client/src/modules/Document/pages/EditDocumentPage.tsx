import { Page } from "@/components/layout";
import type { EntityPageProps } from "../types";

export function EditDocumentPage({ id }: EntityPageProps) {
  return (
    <Page>
      <div>
        <h1>Edit Document {id}</h1>
      </div>
    </Page>
  );
}