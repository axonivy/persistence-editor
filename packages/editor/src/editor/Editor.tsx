import type { PersistenceContext, PersistenceData, PersistenceEditorData } from '@axonivy/persistence-editor-protocol';
import {
  Flex,
  PanelMessage,
  ResizableGroup,
  ResizableHandle,
  ResizablePanel,
  Spinner,
  useDefaultLayout,
  useHistoryData,
  useHotkeys,
  type Unary
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';
import { AppProvider } from '../context/AppContext';
import { useClient } from '../context/ClientContext';
import { genQueryKey } from '../query/query-client';
import { useKnownHotkeys } from '../utils/useKnownHotkeys';
import { ErrorFallback } from './main/ErrorFallback';
import { Main } from './main/Main';
import { PersistenceToolbar } from './main/PersistenceToolbar';
import { Sidebar } from './sidebar/Sidebar';

export type PersistenceEditorProps = { context: PersistenceContext; directSave?: boolean };

export const Editor = ({ context, directSave }: PersistenceEditorProps) => {
  const { t } = useTranslation();
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [detail, setDetail] = useState(true);
  const [initialData, setInitialData] = useState<Array<PersistenceData> | undefined>(undefined);
  const history = useHistoryData<Array<PersistenceData>>();
  const { defaultLayout, onLayoutChanged } = useDefaultLayout({ groupId: 'persistence-editor-resize', storage: localStorage });

  const client = useClient();
  const queryClient = useQueryClient();

  const queryKeys = useMemo(
    () => ({
      data: (context: PersistenceContext) => genQueryKey('data', context),
      saveData: (context: PersistenceContext) => genQueryKey('saveData', context)
    }),
    []
  );

  const { data, isPending, isError, error } = useQuery({
    queryKey: queryKeys.data(context),
    queryFn: () => client.data(context),
    structuralSharing: false
  });

  useEffect(() => {
    const dataDispose = client.onDataChanged(() => queryClient.invalidateQueries({ queryKey: queryKeys.data(context) }));
    return () => {
      dataDispose.dispose();
    };
  }, [client, context, queryClient, queryKeys]);

  if (data?.data !== undefined && initialData === undefined) {
    setInitialData(data.data);
    history.push(data.data);
  }

  const mutation = useMutation({
    mutationKey: queryKeys.saveData(context),
    mutationFn: async (updateData: Unary<Array<PersistenceData>>) => {
      const saveData = queryClient.setQueryData<PersistenceEditorData>(queryKeys.data(context), prevData => {
        if (prevData) {
          return { ...prevData, data: updateData(prevData.data) };
        }
        return undefined;
      });
      if (saveData) {
        return client.saveData({ context, data: saveData.data, directSave: directSave ?? false });
      }
      return Promise.resolve();
    }
  });

  const detailRef = useRef<HTMLDivElement>(null);
  const hotkeys = useKnownHotkeys();
  useHotkeys(
    hotkeys.focusInscription.hotkey,
    () => {
      setDetail(true);
      detailRef.current?.focus();
    },
    {
      scopes: ['global']
    }
  );

  if (isPending) {
    return (
      <Flex alignItems='center' justifyContent='center' className='size-full'>
        <Spinner />
      </Flex>
    );
  }
  if (isError) {
    return <PanelMessage icon={IvyIcons.ErrorXMark} message={t('common.message.errorOccurred', { message: error.message })} />;
  }
  if (data.data === undefined) {
    return <PanelMessage icon={IvyIcons.ErrorXMark} message={t('message.notFound')} />;
  }

  return (
    <AppProvider
      value={{
        data: data.data,
        setData: mutation.mutate,
        selectedIndex,
        setSelectedIndex,
        context: data.context,
        history,
        detail,
        setDetail,
        helpUrl: data.helpUrl
      }}
    >
      <ResizableGroup orientation='horizontal' defaultLayout={defaultLayout} onLayoutChanged={onLayoutChanged}>
        <ResizablePanel id='persistence-editor-main' defaultSize='50%' minSize='30%' className='bg-n75'>
          <Flex direction='column' className='h-full'>
            <PersistenceToolbar />
            <ErrorBoundary FallbackComponent={ErrorFallback} resetKeys={[data]}>
              <Main />
            </ErrorBoundary>
          </Flex>
        </ResizablePanel>
        {detail && (
          <>
            <ResizableHandle />
            <ResizablePanel id='persistence-editor-detail' defaultSize='25%' minSize='20%'>
              <Flex direction='column' className='h-full'>
                <Sidebar ref={detailRef} />
              </Flex>
            </ResizablePanel>
          </>
        )}
      </ResizableGroup>
    </AppProvider>
  );
};
