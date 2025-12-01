import { z } from 'zod';
import { publicProcedure, router } from '../trpc.js';

export const healthRouter = router({
  check: publicProcedure
    .output(z.object({
      status: z.literal('ok'),
      timestamp: z.string(),
      uptime: z.number(),
    }))
    .query(() => {
      return {
        status: 'ok' as const,
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
      };
    }),
});
