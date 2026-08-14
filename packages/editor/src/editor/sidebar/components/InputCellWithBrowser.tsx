import {
  BasicDialogHeader,
  BasicInput,
  BasicTooltip,
  Button,
  Dialog,
  DialogContent,
  DialogTrigger,
  InputGroup,
  selectNextPreviousCell,
  useEditCell,
  type DataTableFeatures,
  type InputProps
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { type CellContext, type RowData } from '@tanstack/react-table';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Browser, type BrowserType } from '../browser/Browser';

type InputCellProps<TData extends RowData> = InputProps & {
  cell: CellContext<DataTableFeatures, TData, string>;
  activeBrowsers: Array<BrowserType>;
};

export const InputCellWithBrowser = <TData extends RowData>({ cell, activeBrowsers }: InputCellProps<TData>) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const { value, setValue, onBlur, updateValue } = useEditCell(cell);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <InputGroup className='border-none! bg-transparent!'>
        <BasicInput
          ref={inputRef}
          value={value}
          onChange={e => setValue(e.target.value)}
          className='bg-transparent! text-inherit!'
          onBlur={e => {
            if (e.relatedTarget && e.currentTarget.parentElement?.contains(e.relatedTarget)) {
              return;
            }
            onBlur?.();
          }}
          onKeyDown={e => {
            if (e.key === 'ArrowDown') {
              e.preventDefault();
              selectNextPreviousCell(e.currentTarget as HTMLInputElement, cell, 1);
            }
            if (e.key === 'ArrowUp') {
              e.preventDefault();
              selectNextPreviousCell(e.currentTarget as HTMLInputElement, cell, -1);
            }
          }}
        />
        {cell.cell.getIsSelected() && (
          <BasicTooltip content={t('common.label.browser')}>
            <DialogTrigger asChild>
              <Button icon={IvyIcons.ListSearch} aria-label={t('common.label.browser')} onBlur={onBlur} />
            </DialogTrigger>
          </BasicTooltip>
        )}
      </InputGroup>
      <DialogContent className='h-[80vh]'>
        <BasicDialogHeader title={t('dialog.browser.title')} description={t('dialog.browser.description')} />
        <Browser value={value} onChange={updateValue} close={() => setOpen(false)} activeBrowsers={activeBrowsers} />
      </DialogContent>
    </Dialog>
  );
};
