import type { PersistenceData } from '@axonivy/persistence-editor-protocol';

import { customRenderHook } from 'test-utils';
import { useValidateName } from './useValidateName';

const data: Array<PersistenceData> = [
  { id: 'Employee', name: 'Employee', dataSource: 'Employee', excludeUnlistedClasses: false, managedClasses: [], properties: {} },
  { id: 'Teamleader', name: 'Teamleader', dataSource: 'Teamleader', excludeUnlistedClasses: false, managedClasses: [], properties: {} },
  { id: 'Manager', name: 'Manager', dataSource: 'Manager', excludeUnlistedClasses: false, managedClasses: [], properties: {} },
  { id: 'HR Manager', name: 'HR Manager', dataSource: 'HR Manager', excludeUnlistedClasses: false, managedClasses: [], properties: {} }
];

const validate = (name: string) => {
  const { result } = customRenderHook(() => useValidateName(name, data));
  return result.current;
};

test('validate', () => {
  expect(validate('Name')).toBeUndefined();
  const emptyError = { message: 'Name cannot be empty.', variant: 'error' };
  expect(validate('')).toEqual(emptyError);
  expect(validate('   ')).toEqual(emptyError);
  const alreadyExistError = { message: 'Persistence already exists.', variant: 'error' };
  expect(validate('Employee')).toEqual(alreadyExistError);
  expect(validate('Teamleader    ')).toEqual(alreadyExistError);
});
