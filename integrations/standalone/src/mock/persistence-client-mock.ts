import { Emitter } from '@axonivy/jsonrpc';
import type {
  EditorFileContent,
  FunctionRequestTypes,
  MetaRequestTypes,
  PersistenceActionArgs,
  PersistenceClient,
  PersistenceEditorData,
  PersistenceSaveDataArgs,
  SchemaGenerateArgs
} from '@axonivy/persistence-editor-protocol';
import { data } from './data-mock';
import { DATACLASSES, DATASOURCES, PROPERTIES, SCHEMA_EXECUTE, SCHEMA_EXECUTE_ERROR, SCHEMA_SHOW, SCHEMA_SHOW_UPDATE } from './meta-mock';

export class PersistenceClientMock implements PersistenceClient {
  private persistenceData: PersistenceEditorData;
  constructor() {
    this.persistenceData = {
      context: { app: 'mockApp', project: 'mockproject', file: 'persistence.yaml' },
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

  async meta<TMeta extends keyof MetaRequestTypes>(path: TMeta, args: MetaRequestTypes[TMeta][0]): Promise<MetaRequestTypes[TMeta][1]> {
    console.log('Meta:', path, args);
    switch (path) {
      case 'meta/scripting/entityClasses':
        return Promise.resolve(DATACLASSES);
      case 'meta/dataSources':
        return Promise.resolve(DATASOURCES);
      case 'meta/properties/all':
        return Promise.resolve(PROPERTIES);
      case 'functions/schemaShow':
        if ((args as SchemaGenerateArgs).config.generationType === 'CREATE') {
          return Promise.resolve(SCHEMA_SHOW);
        } else {
          return Promise.resolve(SCHEMA_SHOW_UPDATE);
        }
      default:
        throw Error('mock meta path not programmed');
    }
  }

  functions<TFunction extends keyof FunctionRequestTypes>(
    path: TFunction,
    args: FunctionRequestTypes[TFunction][0]
  ): Promise<FunctionRequestTypes[TFunction][1]> {
    switch (path) {
      case 'functions/schemaExecute':
        if (args.config.generationType === 'CREATE') {
          return Promise.resolve(SCHEMA_EXECUTE_ERROR);
        } else {
          return Promise.resolve(SCHEMA_EXECUTE);
        }
      default:
        throw Error('mock function path not programmed');
    }
  }

  action(action: PersistenceActionArgs): void {
    console.log('action', JSON.stringify(action));
  }
}
