import type { PersistenceFunctionRequestTypes } from '@axonivy/persistence-editor-protocol';
import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { useClient } from '../context/ClientContext';
import { genQueryKey } from '../query/query-client';

type UseFunctionOptions<TData> = {
  onSuccess?: (data: TData) => void;
  onError?: (error: Error) => void;
};

export function useFunction<TFunct extends keyof PersistenceFunctionRequestTypes>(
  path: TFunct,
  initialArgs: PersistenceFunctionRequestTypes[TFunct][0],
  options?: UseFunctionOptions<PersistenceFunctionRequestTypes[TFunct][1]>
): UseMutationResult<PersistenceFunctionRequestTypes[TFunct][1], Error, PersistenceFunctionRequestTypes[TFunct][0] | undefined> {
  const client = useClient();

  return useMutation({
    mutationKey: genQueryKey(path, initialArgs),
    mutationFn: (args?: PersistenceFunctionRequestTypes[TFunct][0]) => client.functions(path, args ?? initialArgs),
    onSuccess: options?.onSuccess,
    onError: options?.onError
  });
}
