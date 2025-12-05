import { createFileRoute } from '@tanstack/react-router';
import { CollectionCreatePage } from '@/modules/Collection/pages/CollectionCreatePage';

export const Route = createFileRoute('/collections/new')({
  component: CollectionCreatePage,
});
