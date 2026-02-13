import { screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { customRender } from 'test-utils';
import { ManagedClassesSelect } from './ManagedClassesSelect';

const renderSelect = () => {
  let value = ['com.company.project.order.OrderItem', 'com.company.project.user.UserAccount'];
  customRender(<ManagedClassesSelect value={value} onChange={change => (value = change)} />);
  return { data: () => value };
};

test('display tag', async () => {
  const user = userEvent.setup();
  renderSelect();

  expect(screen.getByText('com.company.project.user.UserAccount')).toBeInTheDocument();
  expect(screen.getByText('com.company.project.order.OrderItem')).toBeInTheDocument();
  expect(screen.getAllByRole('button', { name: 'Remove Managed Class' })).toHaveLength(2);

  await user.click(screen.getByRole('button', { name: 'Add Managed Class' }));
  expect(screen.getByRole('dialog')).toBeInTheDocument();
});

test('readonly mode', () => {
  customRender(<ManagedClassesSelect value={['Boolean']} onChange={() => {}} />, { wrapperProps: { readonly: true } });
  expect(screen.getByRole('button', { name: 'Add Managed Class' })).toBeDisabled();
  expect(screen.getByRole('button', { name: 'Remove Managed Class' })).toBeDisabled();
});
