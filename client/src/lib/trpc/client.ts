import { createTRPCClient, httpBatchLink } from '@trpc/client';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/trpc';

export const trpcClient = createTRPCClient({
  links: [
    httpBatchLink({
      url: API_URL,
    }),
  ],
});
