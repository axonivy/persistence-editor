/* eslint-disable @typescript-eslint/no-invalid-void-type */
import type {
  DataclassType,
  EditorFileContent,
  PersistenceContext,
  PersistenceEditorData,
  PersistenceSaveDataArgs
} from './data/persistence';

export interface PersistenceActionArgs {
  actionId: 'openUrl';
  context: PersistenceContext;
  payload: string;
}

export interface PersistenceMetaRequestTypes {
  'meta/dataSources': [PersistenceContext, Array<string>];
  'meta/scripting/entityClasses': [PersistenceContext, Array<DataclassType>];
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
