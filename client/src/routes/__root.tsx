import { Header, Layout } from '@/components/layout';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

const RootLayout = () => (
  <Layout>
    <Header />

    <Outlet />

    {import.meta.env.DEV && <TanStackRouterDevtools />}
  </Layout>
);

export const Route = createRootRoute({ component: RootLayout });