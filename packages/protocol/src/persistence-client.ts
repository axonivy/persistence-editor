import type { EditorFileContent, PersistenceContext, PersistenceEditorData, PersistenceSaveDataArgs } from './data/persistence';
import type { PersistenceActionArgs, PersistenceFunctionRequestTypes, PersistenceMetaRequestTypes } from './persistence-protocol';

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

  meta<TMeta extends keyof PersistenceMetaRequestTypes>(
    path: TMeta,
    args: PersistenceMetaRequestTypes[TMeta][0]
  ): Promise<PersistenceMetaRequestTypes[TMeta][1]>;
  functions<TFunction extends keyof PersistenceFunctionRequestTypes>(
    path: TFunction,
    args: PersistenceFunctionRequestTypes[TFunction][0]
  ): Promise<PersistenceFunctionRequestTypes[TFunction][1]>;

  action(action: PersistenceActionArgs): void;
}
