import type { DataclassType } from '@axonivy/persistence-editor-protocol';
import { screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { customRender } from 'test-utils';
import ManagedClassesCombobox from './ManagedClassesCombobox';

const entityClasses: DataclassType[] = [
  {
    fullQualifiedName: 'com.test.Employee',
    name: 'Employee',
    packageName: 'com.test',
    path: ''
  },
  {
    fullQualifiedName: 'com.test.Teamleader',
    name: 'Teamleader',
    packageName: 'com.test',
    path: ''
  },
  {
    fullQualifiedName: 'com.test.Manager',
    name: 'Manager',
    packageName: 'com.test',
    path: ''
  },
  {
    fullQualifiedName: 'com.test.HRManager',
    name: 'HRManager',
    packageName: 'com.test',
    path: ''
  }
];

const renderCombobox = (data?: Array<string>) => {
  let value = data ?? ['com.test.Employee'];
  customRender(<ManagedClassesCombobox value={value} onChange={change => (value = change)} entityClasses={entityClasses} />);
  return { data: () => value };
};

test('select', async () => {
  const { data } = renderCombobox();
  const input = screen.getByRole('combobox');
  expect(input).toHaveAttribute('data-value', 'com.test.Employee');
  expect(screen.queryByRole('listbox')).not.toBeInTheDocument();

  await userEvent.click(input);
  expect(screen.getByRole('listbox')).toBeVisible();
  console.log(screen.getAllByRole('option').map(option => option.textContent));
  expect(screen.getAllByRole('option')).toHaveLength(4);
  expect(screen.getByRole('option', { name: 'com.test.Employee' })).toHaveAttribute('data-selected');
  await userEvent.click(screen.getByRole('option', { name: 'com.test.Teamleader' }));
  expect(data()).toEqual(['com.test.Employee', 'com.test.Teamleader']);
});

test('select can be handled with keyboard', async () => {
  const { data } = renderCombobox();
  const input = screen.getByRole('combobox');
  expect(input).toHaveAttribute('data-value', 'com.test.Employee');
  await userEvent.keyboard('[Tab]');
  expect(input).toHaveFocus();
  expect(screen.queryByRole('listbox')).not.toBeInTheDocument();

  await userEvent.keyboard('[ArrowDown]');
  expect(screen.getByRole('listbox')).toBeInTheDocument();
  expect(screen.getAllByRole('option')).toHaveLength(4);
  expect(screen.getByRole('option', { name: 'com.test.Employee' })).toHaveAttribute('data-selected');
  expect(screen.getByRole('option', { name: 'com.test.Employee' })).toHaveAttribute('data-highlighted');
  await userEvent.keyboard('h');
  expect(screen.getAllByRole('option')).toHaveLength(1);
  await userEvent.keyboard('[ArrowDown]');
  expect(screen.getByRole('option', { name: 'com.test.HRManager' })).toHaveAttribute('data-highlighted');
  await userEvent.keyboard('[Enter]');
  expect(data()).toEqual(['com.test.Employee', 'com.test.HRManager']);
});

test('unknown value', async () => {
  const { data } = renderCombobox(['unknown']);
  const input = screen.getByRole('combobox');
  expect(input).toHaveAttribute('data-value', 'unknown');
  await userEvent.click(input);
  expect(screen.getByRole('listbox')).toBeVisible();
  expect(screen.getAllByRole('option')).toHaveLength(5);
  expect(screen.getByRole('option', { name: 'unknown.unknown' })).toHaveAttribute('data-selected');
  expect(data()).toEqual(['unknown']);
});

test('readonly mode', () => {
  customRender(<ManagedClassesCombobox value={['com.test.Employee']} onChange={() => {}} entityClasses={entityClasses} />, {
    wrapperProps: { readonly: true }
  });
  expect(screen.getByRole('combobox')).toBeDisabled();
});
