import { Page } from '@/components/layout';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { DocumentForm } from '../components/DocumentForm';
import { useDocumentForm } from '../hooks/document-form';

export function NewDocumentPage() {
  const form = useDocumentForm();
  return (
    <Page>
      <div className="mb-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                className="text-primary"
                href="/documents"
              >
                Documents
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <span>New Document</span>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <section id="formArea">
        <DocumentForm form={form} />
      </section>
    </Page>
  );
}
