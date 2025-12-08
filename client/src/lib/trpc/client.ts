import { createTRPCClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../../../../server/src/routers/index.js';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/trpc';

export const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: API_URL,
    }),
  ],
});
