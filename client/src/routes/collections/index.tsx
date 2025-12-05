import { CollectionListPage } from '@/modules/Collection/pages/CollectionListPage';

import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/collections/')({
  component: CollectionListPage
});
