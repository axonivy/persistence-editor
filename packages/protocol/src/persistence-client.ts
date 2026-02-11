import type { EditorFileContent, PersistenceContext, PersistenceEditorData, PersistenceSaveDataArgs } from './data/persistence';
import type { PersistenceActionArgs } from './persistence-protocol';

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

  action(action: PersistenceActionArgs): void;
}
