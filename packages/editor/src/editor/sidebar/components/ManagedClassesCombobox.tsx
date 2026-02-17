import type { DataclassType } from '@axonivy/persistence-editor-protocol';
import { Button, cn, Flex, IvyIcon, useField, useReadonly } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { Combobox } from '@base-ui/react/combobox';
import { useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './ManagedClassesCombobox.module.css';

type ManagedClassesComboboxProps = {
  value: string[];
  onChange: (value: string[]) => void;
  entityClasses: Array<DataclassType>;
};

export default function ManagedClassesCombobox({ value, onChange, entityClasses }: ManagedClassesComboboxProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { inputProps } = useField();
  const { t } = useTranslation();
  const readonly = useReadonly();
  const items = useMemo(() => {
    const merged = [...entityClasses];
    const mergedIds = merged.map(item => item.fullQualifiedName);
    value.filter(v => !mergedIds.includes(v)).forEach(v => merged.push({ fullQualifiedName: v, name: v, packageName: v, path: '' }));
    return merged;
  }, [entityClasses, value]);
  return (
    <Combobox.Root items={items.map(item => item.fullQualifiedName)} multiple value={value} onValueChange={onChange} disabled={readonly}>
      <Combobox.Chips className={cn(styles.Chips, 'ui-combobox-root')} ref={containerRef}>
        <Combobox.Value>
          {(managedClasses: string[]) => (
            <>
              {managedClasses.map(managedClass => (
                <Combobox.Chip key={managedClass} className={styles.Chip} aria-label={managedClass}>
                  {managedClass}
                  <Combobox.ChipRemove aria-label={t('common.label.remove')} render={<Button icon={IvyIcons.Close} />} />
                </Combobox.Chip>
              ))}
              <Flex alignItems='center' gap={1} className={styles.InputGroup}>
                <Combobox.Input
                  className={styles.Input}
                  {...inputProps}
                  data-value={managedClasses.join(',')}
                  aria-label={t('label.managedClasses')}
                />
                <Combobox.Trigger className={styles.Trigger} render={<Button icon={IvyIcons.Chevron} rotate={90} />} />
              </Flex>
            </>
          )}
        </Combobox.Value>
      </Combobox.Chips>

      <Combobox.Portal>
        <Combobox.Positioner className={styles.Positioner} sideOffset={4} anchor={containerRef}>
          <Combobox.Popup className={styles.Popup}>
            <Combobox.Empty className={styles.Empty}>{t('label.noManagedClassesFound')}</Combobox.Empty>
            <Combobox.List>
              {(managedClassesId: string) => (
                <Combobox.Item key={managedClassesId} className={styles.Item} value={managedClassesId}>
                  <Combobox.ItemIndicator className={styles.ItemIndicator}>
                    <IvyIcon icon={IvyIcons.Check} />
                  </Combobox.ItemIndicator>
                  <div className={styles.ItemText}>{listItem(managedClassesId, items)}</div>
                </Combobox.Item>
              )}
            </Combobox.List>
          </Combobox.Popup>
        </Combobox.Positioner>
      </Combobox.Portal>
    </Combobox.Root>
  );
}

const listItem = (managedClassId: string, items: Array<DataclassType>) => {
  const managedClass = items.find(c => c.fullQualifiedName === managedClassId);
  return managedClass ? managedClassLabel(managedClass) : managedClassId;
};

export const managedClassLabel = (managedClass: Pick<DataclassType, 'name' | 'packageName'>) =>
  `${managedClass.packageName}.${managedClass.name}`;
