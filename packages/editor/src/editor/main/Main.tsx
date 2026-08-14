import type { PersistenceData } from '@axonivy/persistence-editor-protocol';
import {
  BasicField,
  BasicTooltip,
  Button,
  dataTableHelper,
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
  TableGlobalFilter,
  TableResizableHeader,
  useHotkeys,
  useReadonly,
  useTableKeyHandler,
  type DataTableFeatures
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { flexRender, useTable, type Table as ReactTable } from '@tanstack/react-table';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../context/AppContext';
import { useKnownHotkeys } from '../../utils/useKnownHotkeys';
import { AddPersistenceDialog } from '../dialog/AddPersistenceDialog';
import { SchemaGenerateDialog } from '../dialog/SchemaGenerateDialog';

const { columnHelper, tableOptions } = dataTableHelper<PersistenceData>();

export const Main = () => {
  const { t } = useTranslation();
  const { data, setData, setSelectedIndex, detail, setDetail } = useAppContext();

  const columns = columnHelper.columns([
    columnHelper.accessor('name', {
      header: ({ column }) => <SortableHeader column={column} name={t('common.label.name')} />,
      cell: cell => (
        <Flex alignItems='center' gap={1}>
          {<IvyIcon icon={IvyIcons.Database} />}
          <span>{cell.getValue()}</span>
        </Flex>
      )
    }),
    columnHelper.accessor('dataSource', {
      header: ({ column }) => <SortableHeader column={column} name={t('label.dataSource')} />,
      cell: cell => <span>{cell.getValue()}</span>
    })
  ]);

  const table = useTable({
    ...tableOptions,
    data,
    columns
  });

  useEffect(() => {
    const subscription = table.atoms.rowSelection.subscribe(selectedRows => {
      const selectedRowIndex = Object.keys(selectedRows).find(key => selectedRows[key]);
      if (selectedRowIndex === undefined) {
        setSelectedIndex(-1);
        return;
      }
      setSelectedIndex(Number(selectedRowIndex));
    });
    return () => subscription.unsubscribe();
  }, [table, setSelectedIndex]);

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
  const firstElementRef = useRef<HTMLDivElement>(null);
  useHotkeys(hotkeys.focusMain.hotkey, () => firstElementRef.current?.focus(), { scopes: ['global'] });

  if (data === undefined || data.length === 0) {
    return (
      <Flex direction='column' alignItems='center' justifyContent='center' className='h-full'>
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
    <Flex direction='column' ref={ref} onClick={resetSelection} className='h-full overflow-auto'>
      <BasicField
        tabIndex={-1}
        ref={firstElementRef}
        className='m-3 min-h-0'
        label={t('label.persistenceUnits')}
        control={
          <Controls table={table} deletePersistence={table.getSelectedRowModel().flatRows.length > 0 ? deletePersistence : undefined} />
        }
        onClick={event => event.stopPropagation()}
      >
        <TableGlobalFilter table={table} />
        <div className='overflow-x-hidden'>
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

const Controls = ({
  table,
  deletePersistence
}: {
  table: ReactTable<DataTableFeatures, PersistenceData>;
  deletePersistence?: () => void;
}) => {
  const { t } = useTranslation();
  const readonly = useReadonly();
  const hotkeys = useKnownHotkeys();
  if (readonly) {
    return null;
  }
  return (
    <Flex gap={2}>
      <SchemaGenerateDialog>
        <Button icon={IvyIcons.SettingsCog} aria-label={t('dialog.generateSchema.title')} disabled={deletePersistence === undefined} />
      </SchemaGenerateDialog>
      <Separator decorative orientation='vertical' className='m-0! h-5!' />
      <AddPersistenceDialog table={table}>
        <Button icon={IvyIcons.Plus} aria-label={hotkeys.addPersistence.label} />
      </AddPersistenceDialog>
      <Separator decorative orientation='vertical' className='m-0! h-5!' />
      <BasicTooltip content={hotkeys.deletePersistence.label}>
        <Button
          icon={IvyIcons.Trash}
          onClick={deletePersistence}
          disabled={deletePersistence === undefined}
          aria-label={hotkeys.deletePersistence.label}
        />
      </BasicTooltip>
    </Flex>
  );
};
