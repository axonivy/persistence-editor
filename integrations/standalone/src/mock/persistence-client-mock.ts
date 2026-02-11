import type {
  EditorFileContent,
  PersistenceActionArgs,
  PersistenceClient,
  PersistenceEditorData,
  PersistenceSaveDataArgs
} from '@axonivy/persistence-editor-protocol';
import { data } from './data-mock';

export class PersistenceClientMock implements PersistenceClient {
  private persistenceData: PersistenceEditorData;
  constructor() {
    this.persistenceData = {
      context: { app: 'mockApp', pmv: 'mockPmv', file: 'persistence.yaml' },
      data: data,
      helpUrl: 'https://dev.axonivy.com',
      readonly: false
    };
  }
  
  initialize(): Promise<void> {
    return Promise.resolve();
  }

  data(): Promise<PersistenceEditorData> {
    return Promise.resolve(this.persistenceData);
  }

  saveData(saveData: PersistenceSaveDataArgs): Promise<EditorFileContent> {
    this.persistenceData.data = saveData.data;
    return Promise.resolve({ content: '' });
  }
  
  action(action: PersistenceActionArgs): void {
    console.log('action', JSON.stringify(action));
  }
}
