import type { PersistenceData } from '@axonivy/persistence-editor-protocol';
import {
  BasicField,
  Button,
  deleteFirstSelectedRow,
  Flex,
  IvyIcon,
  PanelMessage,
  SelectRow,
  selectRow,
  Separator,
  SortableHeader,
  Table,
  TableBody,
  TableCell,
  TableResizableHeader,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  useHotkeys,
  useReadonly,
  useTableGlobalFilter,
  useTableKeyHandler,
  useTableSelect,
  useTableSort
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { flexRender, getCoreRowModel, useReactTable, type ColumnDef, type Table as ReactTable } from '@tanstack/react-table';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../context/AppContext';
import { useKnownHotkeys } from '../../utils/useKnownHotkeys';
import { AddPersistenceDialog } from '../dialog/AddPersistenceDialog';
import './Main.css';

export const Main = () => {
  const { t } = useTranslation();
  const { data, setData, setSelectedIndex, detail, setDetail } = useAppContext();

  const selection = useTableSelect<PersistenceData>({
    onSelect: selectedRows => {
      const selectedRowIndex = Object.keys(selectedRows).find(key => selectedRows[key]);
      if (selectedRowIndex === undefined) {
        setSelectedIndex(-1);
        return;
      }
      setSelectedIndex(Number(selectedRowIndex));
    }
  });
  const globalFilter = useTableGlobalFilter();
  const sort = useTableSort();
  const columns: Array<ColumnDef<PersistenceData, string>> = [
    {
      accessorKey: 'name',
      header: ({ column }) => <SortableHeader column={column} name={t('common.label.name')} />,
      cell: cell => (
        <Flex alignItems='center' gap={1}>
          {<IvyIcon icon={IvyIcons.Database} />}
          <span>{cell.getValue()}</span>
        </Flex>
      )
    },
    {
      accessorKey: 'dataSource',
      header: ({ column }) => <SortableHeader column={column} name={t('label.dataSource')} />,
      cell: cell => <span>{cell.getValue()}</span>
    }
  ];

  const table = useReactTable({
    ...selection.options,
    ...globalFilter.options,
    ...sort.options,
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      ...selection.tableState,
      ...sort.tableState,
      ...globalFilter.tableState
    }
  });

  const { handleKeyDown } = useTableKeyHandler({
    table,
    data
  });

  const deletePersistence = () =>
    setData(old => {
      const selectedRow = table.getSelectedRowModel().flatRows[0];
      if (!selectedRow) {
        return old;
      }
      const newData = deleteFirstSelectedRow(table, old).newData;
      return newData;
    });

  const resetSelection = () => {
    selectRow(table);
  };

  const hotkeys = useKnownHotkeys();
  const readonly = useReadonly();
  const ref = useHotkeys<HTMLDivElement>(hotkeys.deletePersistence.hotkey, () => deletePersistence(), {
    scopes: ['global'],
    enabled: !readonly
  });
  const firstElement = useRef<HTMLDivElement>(null);
  useHotkeys(hotkeys.focusMain.hotkey, () => firstElement.current?.focus(), { scopes: ['global'] });

  if (data === undefined || data.length === 0) {
    return (
      <Flex direction='column' alignItems='center' justifyContent='center' style={{ height: '100%' }}>
        <PanelMessage icon={IvyIcons.Tool} message={t('message.addFirstPersistence')} mode='column'>
          <AddPersistenceDialog table={table}>
            <Button size='large' variant='primary' icon={IvyIcons.Plus}>
              {t('dialog.addPersistence.title')}
            </Button>
          </AddPersistenceDialog>
        </PanelMessage>
      </Flex>
    );
  }

  return (
    <Flex direction='column' ref={ref} onClick={resetSelection} className='persistence-editor-main-content'>
      <BasicField
        tabIndex={-1}
        ref={firstElement}
        className='persistence-editor-table-field'
        label={t('label.persistenceUnits')}
        control={
          <Controls table={table} deletePersistence={table.getSelectedRowModel().flatRows.length > 0 ? deletePersistence : undefined} />
        }
        onClick={event => event.stopPropagation()}
      >
        {globalFilter.filter}
        <div className='persistence-editor-table-container'>
          <Table onKeyDown={e => handleKeyDown(e, () => setDetail(!detail))}>
            <TableResizableHeader headerGroups={table.getHeaderGroups()} onClick={resetSelection} />
            <TableBody>
              {table.getRowModel().rows.map(row => (
                <SelectRow key={row.id} row={row}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id} style={{ width: cell.column.getSize() }}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </SelectRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </BasicField>
    </Flex>
  );
};

const Controls = ({ table, deletePersistence }: { table: ReactTable<PersistenceData>; deletePersistence?: () => void }) => {
  const readonly = useReadonly();
  const hotkeys = useKnownHotkeys();
  if (readonly) {
    return null;
  }
  return (
    <Flex gap={2}>
      <AddPersistenceDialog table={table}>
        <Button icon={IvyIcons.Plus} aria-label={hotkeys.addPersistence.label} />
      </AddPersistenceDialog>
      <Separator decorative orientation='vertical' style={{ height: '20px', margin: 0 }} />
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              icon={IvyIcons.Trash}
              onClick={deletePersistence}
              disabled={deletePersistence === undefined}
              aria-label={hotkeys.deletePersistence.label}
            />
          </TooltipTrigger>
          <TooltipContent>{hotkeys.deletePersistence.label}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </Flex>
  );
};
