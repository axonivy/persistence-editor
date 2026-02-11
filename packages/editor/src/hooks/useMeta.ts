import type { PersistenceMetaRequestTypes } from '@axonivy/persistence-editor-protocol';
import { useQuery } from '@tanstack/react-query';
import { useClient } from '../context/ClientContext';
import { genQueryKey } from '../query/query-client';

type NonUndefinedGuard<T> = T extends undefined ? never : T;

export function useMeta<TMeta extends keyof PersistenceMetaRequestTypes>(
  path: TMeta,
  args: PersistenceMetaRequestTypes[TMeta][0],
  initialData: NonUndefinedGuard<PersistenceMetaRequestTypes[TMeta][1]>,
  options?: { disable?: boolean }
): { data: PersistenceMetaRequestTypes[TMeta][1] } {
  const client = useClient();
  return useQuery({
    enabled: !options?.disable,
    queryKey: genQueryKey(path, args),
    queryFn: () => client.meta(path, args),
    initialData: initialData
  });
}
