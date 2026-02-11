import type { PersistenceData } from '@axonivy/persistence-editor-protocol';

import { customRenderHook } from 'test-utils';
import { useValidateName } from './useValidateName';

const data: Array<PersistenceData> = [
  {
    name: 'Employee',
    description: 'Employee persistence unit',
    dataSource: 'hr-db',
    excludeUnlistedClasses: false,
    managedClasses: [],
    properties: {}
  },
  {
    name: 'Teamleader',
    description: 'Teamleader persistence unit',
    dataSource: 'hr-db',
    excludeUnlistedClasses: false,
    managedClasses: [],
    properties: {}
  },
  {
    name: 'Manager',
    description: 'Manager persistence unit',
    dataSource: 'hr-db',
    excludeUnlistedClasses: false,
    managedClasses: [],
    properties: {}
  },
  {
    name: 'HR Manager',
    description: 'HR manager persistence unit',
    dataSource: 'hr-db',
    excludeUnlistedClasses: false,
    managedClasses: [],
    properties: {}
  }
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
