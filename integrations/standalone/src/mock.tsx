import { App, ClientContextProvider, initQueryClient } from '@axonivy/persistence-editor';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { HotkeysProvider, ReadonlyProvider, ThemeProvider } from '@axonivy/ui-components';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { initTranslation } from './i18n';
import './index.css';
import { PersistenceClientMock } from './mock/persistence-client-mock';
import { readonlyParam } from './url-helper';

export function start() {
  const persistenceClient = new PersistenceClientMock();
  const queryClient = initQueryClient();
  const readonly = readonlyParam();

  const root = document.getElementById('root');
  if (root === null) {
    throw new Error('Root element not found');
  }
  initTranslation();
  createRoot(root).render(
    <React.StrictMode>
      <ThemeProvider defaultTheme='light'>
        <ClientContextProvider client={persistenceClient}>
          <QueryClientProvider client={queryClient}>
            <ReadonlyProvider readonly={readonly}>
              <HotkeysProvider initiallyActiveScopes={['global']}>
                <App context={{ app: '', project: '', file: '' }} />
              </HotkeysProvider>
            </ReadonlyProvider>
            <ReactQueryDevtools initialIsOpen={false} buttonPosition={'bottom-left'} />
          </QueryClientProvider>
        </ClientContextProvider>
      </ThemeProvider>
    </React.StrictMode>
  );
}

start();
