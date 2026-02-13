import {
  BasicDialogHeader,
  Button,
  Dialog,
  DialogContent,
  DialogTrigger,
  IvyIcon,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  useReadonly
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Browser } from '../../browser/Browser';
import './ManagedClassesSelect.css';

export const BROWSER_BTN_ID = 'browser-btn';

type ManagedClassesSelectProps = {
  value: string[];
  onChange: (value: string[]) => void;
};

export const ManagedClassesSelect = ({ value, onChange }: ManagedClassesSelectProps) => {
  const { t } = useTranslation();
  const [newClass, setNewClass] = useState('');
  const readonly = useReadonly();
  const addManagedClass = (tag: string) => {
    const nextTag = tag.trim();
    setNewClass(nextTag);
    if (!nextTag || value.includes(nextTag)) {
      return;
    }
    onChange([...value, nextTag]);
  };
  const removeManagedClass = (removeTag: string) => {
    const newClazz = value.filter(tag => tag !== removeTag);
    onChange(newClazz);
  };

  return (
    <div className='tags'>
      {value.map((clazz, index) => (
        <div key={`${clazz}-${index}`} className='added-tag' role='gridcell'>
          <span>{clazz}</span>
          <button
            className='tag-remove'
            onClick={() => {
              removeManagedClass(clazz);
            }}
            aria-label={t('label.removeManagedClass', { tag: clazz })}
            disabled={readonly}
          >
            <IvyIcon icon={IvyIcons.Close} />
          </button>
        </div>
      ))}
      <TypeBrowserButton value={newClass} onChange={addManagedClass} />
    </div>
  );
};

export const TypeBrowserButton = ({ value, onChange }: { value: string; onChange: (value: string) => void }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const readonly = useReadonly();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button
                icon={IvyIcons.Plus}
                id={BROWSER_BTN_ID}
                aria-label={t('label.addManagedClass')}
                variant='outline'
                size='large'
                disabled={readonly}
                style={{ borderRadius: 'var(--border-r3)', color: 'var(--N500)' }}
              />
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>{t('label.addManagedClass')}</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DialogContent style={{ height: '80vh' }}>
        <BasicDialogHeader title={t('dialog.typeBrowser.title')} description={t('dialog.typeBrowser.description')} />
        <Browser onChange={onChange} close={() => setOpen(false)} value={value} />
      </DialogContent>
    </Dialog>
  );
};
