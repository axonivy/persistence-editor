import type { EntityDiscoveryMode, PersistenceData } from '@axonivy/persistence-editor-protocol';
import {
  BasicField,
  BasicInput,
  BasicSelect,
  Button,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Flex,
  PanelMessage,
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverTrigger
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../context/AppContext';
import { useMeta } from '../../hooks/useMeta';
import ManagedClassesCombobox from './components/ManagedClassesCombobox';
import { NameInput } from './components/NameInput';
import { PropertiesTable } from './components/PropertiesTable';

export const DetailContent = () => {
  const { t } = useTranslation();
  const { data, setData, selectedIndex } = useAppContext();
  const persistence = useMemo(() => data[selectedIndex], [data, selectedIndex]);
  if (persistence === undefined) {
    return <PanelMessage message={t('label.noPersistenceSelected')} />;
  }
  const handleAttributeChange = <T extends keyof PersistenceData>(key: T, value: PersistenceData[T]) =>
    setData(old => {
      const oldPersistence = old[selectedIndex];
      if (oldPersistence) {
        oldPersistence[key] = value;
      }
      return structuredClone(old);
    });

  return (
    <Flex direction='column' gap={4} className='min-h-0 overflow-auto p-3'>
      <GeneralCollapsible persistence={persistence} handleAttributeChange={handleAttributeChange} />
      <ManagedClassesCollapsible persistence={persistence} handleAttributeChange={handleAttributeChange} />
      <PropertiesTable
        key={persistence.name}
        data={Object.entries(persistence.properties || {}).map(([key, value]) => ({ key, value }))}
        onChange={change => handleAttributeChange('properties', Object.fromEntries(change.map(({ key, value }) => [key, value])))}
      />
    </Flex>
  );
};

const GeneralCollapsible = ({
  persistence,
  handleAttributeChange
}: {
  persistence: PersistenceData;
  handleAttributeChange: <T extends keyof PersistenceData>(key: T, value: PersistenceData[T]) => void;
}) => {
  const { context, data } = useAppContext();
  const { t } = useTranslation();
  const dataSources = useMeta('meta/dataSources', context, []).data;
  return (
    <Collapsible defaultOpen={true}>
      <CollapsibleTrigger>{t('common.label.general')}</CollapsibleTrigger>
      <CollapsibleContent>
        <Flex direction='column' gap={4}>
          <NameInput
            value={persistence.name}
            onChange={value => handleAttributeChange('name', value)}
            persistenceUnits={data.filter(u => u.name !== persistence.name)}
          />
          <BasicField label={t('label.description')}>
            <BasicInput value={persistence.description} onChange={event => handleAttributeChange('description', event.target.value)} />
          </BasicField>
          <BasicField label={t('label.dataSource')}>
            <BasicSelect
              value={persistence.dataSource}
              emptyItem={true}
              items={dataSources.map(source => ({ label: source, value: source }))}
              onValueChange={value => handleAttributeChange('dataSource', value)}
            />
          </BasicField>
        </Flex>
      </CollapsibleContent>
    </Collapsible>
  );
};

const ManagedClassesCollapsible = ({
  persistence,
  handleAttributeChange
}: {
  persistence: PersistenceData;
  handleAttributeChange: <T extends keyof PersistenceData>(key: T, value: PersistenceData[T]) => void;
}) => {
  const { context } = useAppContext();
  const { t } = useTranslation();
  const entityClasses = useMeta('meta/scripting/entityClasses', context, []).data;

  return (
    <Collapsible defaultOpen={true}>
      <CollapsibleTrigger> {t('label.managedClasses')} </CollapsibleTrigger>
      <CollapsibleContent>
        <Flex direction='column' gap={3}>
          <BasicField
            label={t('label.discoveryMode.title')}
            control={
              <Popover>
                <PopoverTrigger asChild>
                  <Button icon={IvyIcons.InfoCircle} />
                </PopoverTrigger>
                <PopoverContent collisionPadding={10} className='max-w-125'>
                  {t('info.managedClasses')}
                  <PopoverArrow />
                </PopoverContent>
              </Popover>
            }
          >
            <BasicSelect
              items={[
                { label: t('label.discoveryMode.PROJECT'), value: 'PROJECT', info: t('info.mode_Project') },
                { label: t('label.discoveryMode.PROJECT_REQUIRED'), value: 'PROJECT_AND_REQUIRED', info: t('info.mode_ProjectRequired') },
                { label: t('label.discoveryMode.LISTED_ONLY'), value: 'LISTED_ONLY', info: t('info.mode_ListedOnly') }
              ]}
              defaultValue='PROJECT'
              value={persistence.mode}
              onValueChange={value => handleAttributeChange('mode', value as EntityDiscoveryMode)}
            />
          </BasicField>
          <BasicField label={t('label.manualIncludedClasses')}>
            <ManagedClassesCombobox
              value={persistence.managedClasses}
              onChange={value => handleAttributeChange('managedClasses', value)}
              entityClasses={entityClasses}
            />
          </BasicField>
        </Flex>
      </CollapsibleContent>
    </Collapsible>
  );
};
