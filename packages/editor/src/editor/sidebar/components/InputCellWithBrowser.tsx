import {
  BasicDialogHeader,
  BasicInput,
  Button,
  Dialog,
  DialogContent,
  DialogTrigger,
  InputGroup,
  selectNextPreviousCell,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  useEditCell,
  type InputProps
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { type CellContext } from '@tanstack/react-table';
import { useRef, useState } from 'react';
import { useFocusWithin } from 'react-aria';
import { useTranslation } from 'react-i18next';
import { Browser, type BrowserType } from '../browser/Browser';
import './InputCellWithBrowser.css';

type InputCellProps<TData> = InputProps & { cell: CellContext<TData, string>; activeBrowsers: Array<BrowserType> };

export const InputCellWithBrowser = <TData,>({ cell, activeBrowsers }: InputCellProps<TData>) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const { value, setValue, onBlur, updateValue } = useEditCell(cell);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocusWithin, setFocusWithin] = useState(false);
  const { focusWithinProps } = useFocusWithin({
    onFocusWithinChange: setFocusWithin
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <InputGroup className='input-cell-with-browser' {...focusWithinProps}>
        <BasicInput
          ref={inputRef}
          value={value}
          onChange={e => setValue(e.target.value)}
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
        {isFocusWithin && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <DialogTrigger asChild>
                  <Button icon={IvyIcons.ListSearch} aria-label={t('common.label.browser')} onBlur={onBlur} />
                </DialogTrigger>
              </TooltipTrigger>
              <TooltipContent>{t('common.label.browser')}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </InputGroup>
      <DialogContent style={{ height: '80vh' }}>
        <BasicDialogHeader title={t('dialog.browser.title')} description={t('dialog.browser.description')} />
        <Browser value={value} onChange={updateValue} close={() => setOpen(false)} activeBrowsers={activeBrowsers} />
      </DialogContent>
    </Dialog>
  );
};
