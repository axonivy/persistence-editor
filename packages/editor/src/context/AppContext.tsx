import { type PersistenceContext, type PersistenceData } from '@axonivy/persistence-editor-protocol';
import { type useHistoryData } from '@axonivy/ui-components';
import { createContext, use } from 'react';
import type { UpdateConsumer } from '../types/types';

export type AppContext = {
  data: Array<PersistenceData>;
  setData: UpdateConsumer<Array<PersistenceData>>;
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
  context: PersistenceContext;
  history: ReturnType<typeof useHistoryData<Array<PersistenceData>>>;
  detail: boolean;
  setDetail: (visible: boolean) => void;
  helpUrl: string;
};

export const AppContext = createContext<AppContext>({
  data: [],
  setData: data => data,
  selectedIndex: -1,
  setSelectedIndex: () => {},
  context: { app: '', pmv: '', file: '' },
  history: { push: () => {}, undo: () => {}, redo: () => {}, canUndo: false, canRedo: false },
  detail: true,
  setDetail: () => {},
  helpUrl: ''
});

export const AppProvider = AppContext.Provider;

export const useAppContext = (): AppContext & { setUnhistoriedVariables: UpdateConsumer<Array<PersistenceData>> } => {
  const context = use(AppContext);
  return {
    ...context,
    setData: updateData => {
      context.setData(old => {
        const newData = updateData(old);
        context.history.push(newData);
        return newData;
      });
    },
    setUnhistoriedVariables: context.setData
  };
};
