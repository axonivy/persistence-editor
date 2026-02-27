import type { DataclassType } from '@axonivy/persistence-editor-protocol';
import { Button, cn, Flex, IvyIcon, useField, useReadonly } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { Combobox } from '@base-ui/react/combobox';
import { useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';

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
      <Combobox.Chips
        className={cn(
          'flex min-h-9 flex-wrap items-center gap-1 rounded-sm border border-border-input-color bg-n25 p-0.75 focus-within:border-border-active focus-within:outline-none',
          'ui-combobox-root'
        )}
        ref={containerRef}
      >
        <Combobox.Value>
          {(managedClasses: string[]) => (
            <>
              {managedClasses.map(managedClass => (
                <Combobox.Chip
                  key={managedClass}
                  className='flex h-5 cursor-default items-center gap-1 overflow-hidden rounded-sm bg-n100 p-0.5 ps-1 text-body outline-none focus-within:bg-p75 [@media(hover:hover)]:data-highlighted:bg-p75'
                  aria-label={managedClass}
                >
                  {managedClass}
                  <Combobox.ChipRemove aria-label={t('common.label.remove')} render={<Button icon={IvyIcons.Close} />} />
                </Combobox.Chip>
              ))}
              <Flex alignItems='center' gap={1} className='flex-1'>
                <Combobox.Input
                  className='m-0 w-full min-w-0 flex-1 shrink-0 basis-12 border-none bg-transparent text-body focus:outline-none'
                  {...inputProps}
                  data-value={managedClasses.join(',')}
                  aria-label={t('label.managedClasses')}
                />
                <Combobox.Trigger render={<Button icon={IvyIcons.Chevron} rotate={90} />} />
              </Flex>
            </>
          )}
        </Combobox.Value>
      </Combobox.Chips>

      <Combobox.Portal>
        <Combobox.Positioner className='z-50 outline-none' sideOffset={4} anchor={containerRef}>
          <Combobox.Popup className='max-h-[min(var(--available-height),23rem)] w-(--anchor-width) max-w-(--available-width) origin-(--transform-origin) scroll-py-2 overflow-auto overscroll-contain rounded-sm border border-n100 bg-background p-1 text-body shadow-lg transition-[transform,scale,opacity] data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0'>
            <Combobox.Empty className='p-2 leading-none text-n700 empty:m-0 empty:p-0'>{t('label.noManagedClassesFound')}</Combobox.Empty>
            <Combobox.List>
              {(managedClassesId: string) => (
                <Combobox.Item
                  key={managedClassesId}
                  className='relative flex h-7.75 items-center py-2 ps-8 pe-2 outline-none select-none data-highlighted:not-data-selected:before:bg-p50 data-selected:z-0 data-selected:bg-p300 data-selected:text-background [@media(hover:hover)]:data-highlighted:relative [@media(hover:hover)]:data-highlighted:z-0 [@media(hover:hover)]:data-highlighted:before:absolute [@media(hover:hover)]:data-highlighted:before:inset-0 [@media(hover:hover)]:data-highlighted:before:z-[-1] [@media(hover:hover)]:data-highlighted:before:bg-p300'
                  value={managedClassesId}
                >
                  <Combobox.ItemIndicator className='absolute left-2 flex size-3.5 items-center justify-center'>
                    <IvyIcon icon={IvyIcons.Check} />
                  </Combobox.ItemIndicator>
                  <div className='truncate'>{listItem(managedClassesId, items)}</div>
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
