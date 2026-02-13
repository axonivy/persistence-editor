/* eslint-disable @typescript-eslint/no-invalid-void-type */
import type {
  DataclassType,
  EditorFileContent,
  JavaType,
  PersistenceContext,
  PersistenceEditorData,
  PersistenceSaveDataArgs,
  TypeSearchRequest
} from './data/persistence';

export interface PersistenceActionArgs {
  actionId: 'openUrl';
  context: PersistenceContext;
  payload: string;
}

export interface PersistenceMetaRequestTypes {
  'meta/dataSources': [PersistenceContext, Array<string>];
  'meta/scripting/dataClasses': [PersistenceContext, Array<DataclassType>];
  'meta/scripting/ivyTypes': [void, Array<JavaType>];
  'meta/scripting/allTypes': [TypeSearchRequest, Array<JavaType>];
  'meta/scripting/ownTypes': [TypeSearchRequest, Array<JavaType>];
}

export interface PersistenceRequestTypes extends PersistenceMetaRequestTypes {
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
