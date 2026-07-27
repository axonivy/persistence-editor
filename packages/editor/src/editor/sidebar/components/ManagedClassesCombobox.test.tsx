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
