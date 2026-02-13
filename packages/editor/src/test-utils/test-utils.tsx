/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  type DataclassType,
  type PersistenceContext,
  type PersistenceData,
  type PersistenceMetaRequestTypes
} from '@axonivy/persistence-editor-protocol';
import { ReadonlyProvider } from '@axonivy/ui-components';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, renderHook, type RenderHookOptions, type RenderOptions, type RenderResult } from '@testing-library/react';
import i18n from 'i18next';
import { type ReactElement, type ReactNode } from 'react';
import { initReactI18next } from 'react-i18next';
import { AppProvider } from '../context/AppContext';
import { ClientContextProvider, type ClientContext } from '../context/ClientContext';
import enMessages from '../translation/persistence-editor/en.json';

type ContextHelperProps = {
  appContext?: {
    context?: PersistenceContext;
    data?: Array<PersistenceData>;
    setData?: (data: Array<PersistenceData>) => void;
    helpUrl?: string;
  };
  readonly?: boolean;
  meta?: {
    dataClasses?: Array<DataclassType>;
  };
};

const initTranslation = () => {
  if (i18n.isInitializing || i18n.isInitialized) return;
  i18n.use(initReactI18next).init({
    supportedLngs: ['en'],
    fallbackLng: 'en',
    ns: ['persistence-editor'],
    defaultNS: 'persistence-editor',
    resources: {
      en: { 'persistence-editor': enMessages }
    }
  });
};

const ContextHelper = ({ appContext, readonly, meta, children }: ContextHelperProps & { children: ReactNode }) => {
  const data = appContext?.data ?? ([] as Array<PersistenceData>);
  const client: ClientContext = {
    // @ts-ignore
    client: {
      meta<TMeta extends keyof PersistenceMetaRequestTypes>(path: TMeta): Promise<PersistenceMetaRequestTypes[TMeta][1]> {
        switch (path) {
          case 'meta/scripting/entityClasses':
            return Promise.resolve(meta?.dataClasses ?? []);

          default:
            throw Error('mock meta path not programmed');
        }
      }
    }
  };
  initTranslation();
  const queryClient = new QueryClient();
  return (
    <ClientContextProvider client={client.client}>
      <QueryClientProvider client={queryClient}>
        <ReadonlyProvider readonly={readonly ?? false}>
          <AppProvider
            value={{
              context: appContext?.context ?? ({ file: '' } as PersistenceContext),
              data,
              // @ts-ignore
              setData: appContext?.setData ? getData => appContext.setData(getData(data)) : () => {},
              selectedIndex: -1,
              setSelectedIndex: () => {},
              history: { push: () => {}, undo: () => {}, redo: () => {}, canUndo: false, canRedo: false },
              detail: false,
              setDetail: () => {},
              helpUrl: appContext?.helpUrl ?? ''
            }}
          >
            {children}
          </AppProvider>
        </ReadonlyProvider>
      </QueryClientProvider>
    </ClientContextProvider>
  );
};

export const customRenderHook = <Result, Props>(
  render: (initialProps: Props) => Result,
  options?: RenderHookOptions<Props> & { wrapperProps: ContextHelperProps }
) => {
  return renderHook(render, {
    wrapper: props => <ContextHelper {...props} {...options?.wrapperProps} />,
    ...options
  });
};

export const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'> & { wrapperProps: ContextHelperProps }
): RenderResult => {
  return render(ui, { wrapper: props => <ContextHelper {...props} {...options?.wrapperProps} />, ...options });
};
