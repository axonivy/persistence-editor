import { BrowsersView, type BrowsersViewProps } from '@axonivy/ui-components';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { usePropertiesBrowser } from './usePropertiesBrowser';

export type BrowserType = 'PROPERTIES';

type BrowserProps = {
  value: string;
  onChange: (value: string) => void;
  activeBrowsers: Array<BrowserType>;
  close: () => void;
};

export const Browser = ({ value, onChange, activeBrowsers, close }: BrowserProps) => {
  const { t } = useTranslation();
  const propertiesBrowser = usePropertiesBrowser(value);
  const browsers = activeBrowsers
    .map(browser => {
      switch (browser) {
        case 'PROPERTIES':
          return propertiesBrowser;
      }
    })
    .filter(browser => browser !== null);

  const options = useMemo<BrowsersViewProps['options']>(
    () => ({
      applyBtn: { label: t('common.label.apply') },
      cancelBtn: { label: t('common.label.cancel') },
      info: { label: t('common.label.info'), defaultOpen: true },
      search: { placeholder: t('common.label.search') }
    }),
    [t]
  );

  return (
    <BrowsersView
      browsers={browsers}
      apply={(_, result) => {
        if (result) {
          onChange(result.value);
        }
        close();
      }}
      options={options}
    />
  );
};
