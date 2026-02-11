/* eslint-disable @typescript-eslint/no-invalid-void-type */
import type {
  EditorFileContent,
  ManagedClassesMeta,
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
  'meta/managedClasses': [PersistenceContext, Array<ManagedClassesMeta>];
  'meta/dataSources': [PersistenceContext, Array<string>];
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
