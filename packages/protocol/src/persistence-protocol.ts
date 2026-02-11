/* eslint-disable @typescript-eslint/no-invalid-void-type */
import type { EditorFileContent, PersistenceContext, PersistenceEditorData, PersistenceSaveDataArgs } from './data/persistence';

export interface PersistenceActionArgs {
  actionId: 'openUrl';
  context: PersistenceContext;
  payload: string;
}

export interface PersistenceRequestTypes {
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
