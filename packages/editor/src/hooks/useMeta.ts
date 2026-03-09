import type { MetaRequestTypes } from '@axonivy/persistence-editor-protocol';
import { useQuery } from '@tanstack/react-query';
import { useClient } from '../context/ClientContext';
import { genQueryKey } from '../query/query-client';

type NonUndefinedGuard<T> = T extends undefined ? never : T;

export function useMeta<TMeta extends keyof MetaRequestTypes>(
  path: TMeta,
  args: MetaRequestTypes[TMeta][0],
  initialData: NonUndefinedGuard<MetaRequestTypes[TMeta][1]>,
  options?: { disable?: boolean }
) {
  const client = useClient();
  return useQuery({
    enabled: !options?.disable,
    queryKey: genQueryKey(path, args),
    queryFn: () => client.meta(path, args),
    initialData
  });
}
