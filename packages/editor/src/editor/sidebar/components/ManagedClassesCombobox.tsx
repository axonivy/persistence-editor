import type { DataclassType } from '@axonivy/persistence-editor-protocol';
import { BasicMultiCombobox, useField, useReadonly } from '@axonivy/ui-components';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

type ManagedClassesComboboxProps = {
  value: string[];
  onChange: (value: string[]) => void;
  entityClasses: Array<DataclassType>;
};

export default function ManagedClassesCombobox({ value, onChange, entityClasses }: ManagedClassesComboboxProps) {
  const { inputProps } = useField();
  const { t } = useTranslation();
  const readonly = useReadonly();
  const items = useMemo(() => {
    const merged = [...entityClasses];
    const mergedIds = merged.map(item => item.fullQualifiedName);
    value.filter(v => !mergedIds.includes(v)).forEach(v => merged.push({ fullQualifiedName: v, name: v, packageName: v, path: '' }));
    return merged.map(member => ({ value: member.fullQualifiedName, label: managedClassLabel(member) }));
  }, [entityClasses, value]);
  const comboValue = useMemo(() => value.map(v => items.find(r => r.value === v) ?? { value: v, label: v }), [value, items]);
  return (
    <BasicMultiCombobox
      items={items}
      isItemEqualToValue={(itemValue, value) => itemValue.value === value.value}
      value={comboValue}
      onValueChange={items => onChange(items.map(item => item.value))}
      disabled={readonly}
      chipRenderer={item => item.value}
      chipRemoveLabel={t('common.label.remove')}
      emptyLabel={t('label.noManagedClassesFound')}
      {...inputProps}
    />
  );
}

export const managedClassLabel = (managedClass: Pick<DataclassType, 'name' | 'packageName'>) =>
  `${managedClass.packageName}.${managedClass.name}`;
