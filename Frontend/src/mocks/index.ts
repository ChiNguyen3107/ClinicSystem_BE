// MSW setup for development
if (import.meta.env.DEV) {
  const { worker } = await import('./browser');
  
  // Start the worker
  worker.start({
    onUnhandledRequest: 'bypass',
  });
  
  console.log('🔧 MSW: Mock Service Worker started');
}
