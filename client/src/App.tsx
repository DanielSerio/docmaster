import { trpc } from './lib/trpc/react';

function App() {
  const healthQuery = trpc.health.check.useQuery();

  return (
    <>
      <h1>DocMaster</h1>
      <div className="card">
        <h2>Server Health Check</h2>
        {healthQuery.isLoading && <p>Loading...</p>}
        {healthQuery.error && (
          <p style={{ color: 'red' }}>
            Error: {healthQuery.error.message}
          </p>
        )}
        {healthQuery.data && (
          <div data-testid="health-check-result">
            <p>Status: {healthQuery.data.status}</p>
            <p>Timestamp: {healthQuery.data.timestamp}</p>
            <p>Server Uptime: {healthQuery.data.uptime.toFixed(2)}s</p>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
