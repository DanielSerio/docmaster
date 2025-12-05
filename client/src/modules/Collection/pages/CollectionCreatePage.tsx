import { Page } from '@/components/layout';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { CollectionForm } from '../components/CollectionForm';
import { useCollectionForm } from '../hooks/collection-form';

export function CollectionCreatePage() {
  const form = useCollectionForm();
  return (
    <Page>
      <div className="mb-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                className="text-primary"
                href="/collections"
              >
                Collections
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <span>New Collection</span>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <section id="formArea">
        <CollectionForm form={form} />
      </section>
    </Page>
  );
}
