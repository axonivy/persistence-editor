import type { EditorFileContent, PersistenceContext, PersistenceEditorData, PersistenceSaveDataArgs } from './data/persistence';
import type { FunctionRequestTypes, MetaRequestTypes, PersistenceActionArgs } from './persistence-protocol';

export interface Event<T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (listener: (e: T) => any, thisArgs?: any, disposables?: Disposable[]): Disposable;
}

export interface Disposable {
  dispose(): void;
}

export interface PersistenceClient {
  initialize(context: PersistenceContext): Promise<void>;
  data(context: PersistenceContext): Promise<PersistenceEditorData>;
  saveData(saveData: PersistenceSaveDataArgs): Promise<EditorFileContent>;

  meta<TMeta extends keyof MetaRequestTypes>(path: TMeta, args: MetaRequestTypes[TMeta][0]): Promise<MetaRequestTypes[TMeta][1]>;
  functions<TFunction extends keyof FunctionRequestTypes>(
    path: TFunction,
    args: FunctionRequestTypes[TFunction][0]
  ): Promise<FunctionRequestTypes[TFunction][1]>;
  action(action: PersistenceActionArgs): void;
  onDataChanged: Event<void>;
}
