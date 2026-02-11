import { Button, cn, Flex, IvyIcon, useField, useReadonly } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { Combobox } from '@base-ui/react/combobox';
import { useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../../context/AppContext';

import type { ManagedClassesMeta } from '@axonivy/persistence-editor-protocol';
import { useMeta } from '../../../hooks/useMeta';
import styles from './ManagedClassesCombobox.module.css';

type ManagedClassesComboboxProps = {
  value: string[];
  onChange: (value: string[]) => void;
};

export default function ManagedClassesCombobox({ value, onChange }: ManagedClassesComboboxProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { inputProps } = useField();
  const { t } = useTranslation();
  const readonly = useReadonly();
  const { context } = useAppContext();

  const managedClasses = useMeta('meta/managedClasses', context, []).data;
  const items = useMemo(() => {
    const merged = [...managedClasses];
    const mergedIds = merged.map(r => r.id);
    value.filter(v => !mergedIds.includes(v)).forEach(v => merged.push({ id: v, label: '' }));
    return merged;
  }, [managedClasses, value]);

  return (
    <Combobox.Root items={items.map(item => item.id)} multiple value={value} onValueChange={onChange} disabled={readonly}>
      <Combobox.Chips className={cn(styles.Chips, 'ui-combobox-root')} ref={containerRef}>
        <Combobox.Value>
          {(roles: string[]) => (
            <>
              {roles.map(role => (
                <Combobox.Chip key={role} className={styles.Chip} aria-label={role}>
                  {role}
                  <Combobox.ChipRemove aria-label={t('common.label.remove')} render={<Button icon={IvyIcons.Close} />} />
                </Combobox.Chip>
              ))}
              <Flex alignItems='center' gap={1} className={styles.InputGroup}>
                <Combobox.Input className={styles.Input} {...inputProps} data-value={roles.join(',')} />
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
              {(role: string) => (
                <Combobox.Item key={role} className={styles.Item} value={role}>
                  <Combobox.ItemIndicator className={styles.ItemIndicator}>
                    <IvyIcon icon={IvyIcons.Check} />
                  </Combobox.ItemIndicator>
                  <div className={styles.ItemText}>{listItem(role, items)}</div>
                </Combobox.Item>
              )}
            </Combobox.List>
          </Combobox.Popup>
        </Combobox.Positioner>
      </Combobox.Portal>
    </Combobox.Root>
  );
}

const listItem = (item: string, items: Array<ManagedClassesMeta>) => {
  const role = items.find(i => i.id === item);
  return role ? roleLabel(role) : item;
};

export const roleLabel = (role: ManagedClassesMeta) => `${role.id}${role.label ? ` (${role.label})` : ''}`;
