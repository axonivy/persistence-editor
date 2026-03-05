/* eslint-disable @typescript-eslint/no-invalid-void-type */
import type {
  DataclassType,
  EditorFileContent,
  PersistenceContext,
  PersistenceEditorData,
  PersistencePropertyMeta,
  PersistenceSaveDataArgs,
  Result,
  SchemaGenerateArgs
} from './data/persistence';

export interface PersistenceActionArgs {
  actionId: 'openUrl';
  context: PersistenceContext;
  payload: string;
}

export interface FunctionRequestTypes {
  'functions/schemaExecute': [SchemaGenerateArgs, Result];
}

export interface MetaRequestTypes {
  'functions/schemaShow': [SchemaGenerateArgs, Result];
  'meta/dataSources': [PersistenceContext, Array<string>];
  'meta/scripting/entityClasses': [PersistenceContext, Array<DataclassType>];
  'meta/properties/all': [void, Array<PersistencePropertyMeta>];
}

export interface PersistenceRequestTypes extends MetaRequestTypes, FunctionRequestTypes {
  initialize: [PersistenceContext, void];
  data: [PersistenceContext, PersistenceEditorData];
  saveData: [PersistenceSaveDataArgs, EditorFileContent];
}

export interface PersistenceNotificationTypes {
  action: PersistenceActionArgs;
}

export interface PersistenceOnNotificationTypes {
  dataChanged: void;
}
