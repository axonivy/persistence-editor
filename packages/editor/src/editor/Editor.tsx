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
  type Unary
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';
import { AppProvider } from '../context/AppContext';
import { useClient } from '../context/ClientContext';
import { genQueryKey } from '../query/query-client';
import './Editor.css';
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
    },
    onSuccess: () => queryClient.invalidateQueries()
  });

  if (isPending) {
    return (
      <Flex alignItems='center' justifyContent='center' style={{ width: '100%', height: '100%' }}>
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
      <ResizableGroup orientation='horizontal' defaultLayout={defaultLayout} onLayoutChanged={onLayoutChanged} className='persistence-editor'>
        <ResizablePanel id='main' defaultSize='50%' minSize='30%' className='persistence-editor-main-panel'>
          <Flex direction='column' className='panel'>
            <PersistenceToolbar />
            <ErrorBoundary FallbackComponent={ErrorFallback} resetKeys={[data]}>
              <Main />
            </ErrorBoundary>
          </Flex>
        </ResizablePanel>
        {detail && (
          <>
            <ResizableHandle />
            <ResizablePanel id='properties' defaultSize='25%' minSize='20%' className='persistence-editor-detail-panel'>
              <Flex direction='column' className='panel'>
                <Sidebar />
              </Flex>
            </ResizablePanel>
          </>
        )}
      </ResizableGroup>
    </AppProvider>
  );
};
