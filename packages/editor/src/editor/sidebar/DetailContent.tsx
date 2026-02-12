import type { PersistenceData } from '@axonivy/persistence-editor-protocol';
import { BasicCheckbox, BasicField, BasicInput, BasicSelect, Flex, PanelMessage } from '@axonivy/ui-components';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../context/AppContext';
import { useMeta } from '../../hooks/useMeta';
import './DetailContent.css';
import ManagedClassesCombobox from './components/ManagedClassesCombobox';
import { NameInput } from './components/NameInput';
import { PropertiesTable } from './components/PropertiesTable';

export const DetailContent = () => {
  const { t } = useTranslation();
  const { data, setData, selectedIndex, context } = useAppContext();
  const dataSources = useMeta('meta/dataSources', context, []).data;
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
    <Flex direction='column' gap={4} className='persistence-editor-detail-content'>
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

      <BasicCheckbox
        label={t('label.excludeUnlistedClasses')}
        checked={persistence.excludeUnlistedClasses}
        onCheckedChange={checked => handleAttributeChange('excludeUnlistedClasses', checked === true)}
      />
      <BasicField label={t('label.managedClasses')}>
        <ManagedClassesCombobox value={persistence.managedClasses} onChange={value => handleAttributeChange('managedClasses', value)} />
      </BasicField>
      <PropertiesTable
        key={persistence.name}
        data={Object.entries(persistence.properties || {}).map(([key, value]) => ({ key, value }))}
        onChange={change => handleAttributeChange('properties', Object.fromEntries(change.map(({ key, value }) => [key, value])))}
      />
    </Flex>
  );
};
