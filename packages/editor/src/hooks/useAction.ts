import type { PersistenceActionArgs } from '@axonivy/persistence-editor-protocol';
import { useAppContext } from '../context/AppContext';
import { useClient } from '../context/ClientContext';

export function useAction(actionId: PersistenceActionArgs['actionId']) {
  const { context } = useAppContext();
  const client = useClient();

  return (content?: PersistenceActionArgs['payload']) => {
    let payload = content ?? '';
    if (typeof payload === 'object') {
      payload = JSON.stringify(payload);
    }
    client.action({ actionId, context, payload });
  };
}
