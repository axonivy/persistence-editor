import type { BrowserNode } from '@axonivy/ui-components';
import type { UseQueryResult } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export const useBrowserData = <T>(queryResult: UseQueryResult<Array<T>, Error>, mapper: (item: T) => BrowserNode<T>) => {
  const { data, isPending, isError } = queryResult;
  const { t } = useTranslation();
  return useMemo(() => {
    if (isPending) {
      return [
        {
          value: t('dialog.browser.loading'),
          info: '',
          children: [],
          notSelectable: true
        }
      ];
    }
    if (isError) {
      return [
        {
          value: t('dialog.browser.loadError'),
          info: '',
          children: [],
          notSelectable: true
        }
      ];
    }
    return data.map<BrowserNode<T>>(feature => mapper(feature));
  }, [data, isError, isPending, t, mapper]);
};
