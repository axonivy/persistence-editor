import type { PersistencePropertyMeta } from '@axonivy/persistence-editor-protocol';
import { Flex, useBrowser, type Browser, type BrowserNode } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useTranslation } from 'react-i18next';
import { useMeta } from '../../../hooks/useMeta';
import { useBrowserData } from './browser-data';

export const PROPERTIES_BROWSER_ID = 'Properties';

export const usePropertiesBrowser = (initialSearch: string): Browser => {
  const meta = useMeta('meta/properties/all', undefined, []);
  const properties = useBrowserData(meta, propertiesToBrowserNode);
  const browser = useBrowser(properties, { initialSearch });
  return {
    name: PROPERTIES_BROWSER_ID,
    icon: IvyIcons.ChangeType,
    browser,
    infoProvider: row => <PropertyInfo property={row?.original.data as PersistencePropertyMeta} />,
    applyModifier: row => ({ value: row?.original.value ?? '' })
  };
};

const propertiesToBrowserNode = (prop: PersistencePropertyMeta): BrowserNode<PersistencePropertyMeta> => {
  return {
    value: prop.property,
    info: prop.description,
    data: prop,
    children: []
  };
};

const PropertyInfo = ({ property }: { property?: PersistencePropertyMeta }) => {
  const { t } = useTranslation();
  if (!property) {
    return null;
  }
  return (
    <Flex direction='column' gap={1}>
      <span>{property.description}</span>
      {property.defaultValue && <span>{t('label.defaultValue', { defaultValue: property.defaultValue })}</span>}
      {property.examples?.length > 0 && <span>{t('label.examples', { examples: property.examples.join(', ') })}</span>}
    </Flex>
  );
};
