import type { PersistenceData } from '@axonivy/persistence-editor-protocol';
import { BasicField, BasicInput, Flex, PanelMessage } from '@axonivy/ui-components';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../context/AppContext';
import './DetailContent.css';

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
    <Flex direction='column' gap={4} className='persistence-editor-detail-content'>
      <BasicField label={t('common.label.name')}>
        <BasicInput value={persistence.name} onChange={event => handleAttributeChange('name', event.target.value)} />
      </BasicField>
      <BasicField label={t('label.dataSource')}>
        <BasicInput value={persistence.dataSource} onChange={event => handleAttributeChange('dataSource', event.target.value)} />
      </BasicField>
    </Flex>
  );
};
