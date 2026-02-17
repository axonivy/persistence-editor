import { Emitter } from '@axonivy/jsonrpc';
import type {
  EditorFileContent,
  PersistenceActionArgs,
  PersistenceClient,
  PersistenceEditorData,
  PersistenceMetaRequestTypes,
  PersistenceSaveDataArgs
} from '@axonivy/persistence-editor-protocol';
import { data } from './data-mock';
import { DATACLASSES, DATASOURCES } from './meta-mock';

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

  protected onDataChangedEmitter = new Emitter<void>();
  onDataChanged = this.onDataChangedEmitter.event;

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

  async meta<TMeta extends keyof PersistenceMetaRequestTypes>(
    path: TMeta,
    args: PersistenceMetaRequestTypes[TMeta][0]
  ): Promise<PersistenceMetaRequestTypes[TMeta][1]> {
    console.log('Meta:', args);
    switch (path) {
      case 'meta/scripting/entityClasses':
        return Promise.resolve(DATACLASSES);
      case 'meta/dataSources':
        return Promise.resolve(DATASOURCES);
      default:
        throw Error('mock meta path not programmed');
    }
  }

  action(action: PersistenceActionArgs): void {
    console.log('action', JSON.stringify(action));
  }
}
