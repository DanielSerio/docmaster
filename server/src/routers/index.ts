import { router } from '../trpc.js';
import { healthRouter } from './health.js';
import { ruleCategoryRouter } from './ruleCategory.router.js';
import { ruleRouter } from './rule.router.js';
import { textBlockRouter } from './textBlock.router.js';
import { documentRouter } from './document.router.js';
import { documentRuleRouter } from './documentRule.router.js';
import { documentTextBlockRouter } from './documentTextBlock.router.js';
import { documentCollectionRouter } from './documentCollection.router.js';
import { documentCollectionDocumentRouter } from './documentCollectionDocument.router.js';

export const appRouter = router({
  health: healthRouter,
  ruleCategory: ruleCategoryRouter,
  rule: ruleRouter,
  textBlock: textBlockRouter,
  document: documentRouter,
  documentRule: documentRuleRouter,
  documentTextBlock: documentTextBlockRouter,
  documentCollection: documentCollectionRouter,
  documentCollectionDocument: documentCollectionDocumentRouter,
});

export type AppRouter = typeof appRouter;
