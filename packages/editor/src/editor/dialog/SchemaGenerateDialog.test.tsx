import { type Result } from '@axonivy/persistence-editor-protocol';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { customRender } from 'test-utils';
import { describe, expect } from 'vitest';
import { getSchemaStatus, SubmitButton } from './SchemaGenerateDialog';

const createResult = (script = 'SQL', errors: Result['errors'] = []): Result => ({
  script,
  errors
});

describe('getSchemaStatus', () => {
  test('returns loading when show is pending', () => {
    expect(getSchemaStatus(true, false)).toBe('loading');
  });

  test('returns loading when execute is pending', () => {
    expect(getSchemaStatus(false, true)).toBe('loading');
  });

  test('returns executionSuccess when executeResult has no errors', () => {
    const executeResult = createResult('sql');
    expect(getSchemaStatus(false, false, undefined, executeResult)).toBe('executionSuccess');
  });

  test('returns failed when executeResult has errors', () => {
    const executeResult = createResult('sql', [{ message: 'err', title: 'Error', type: 'ERROR' }]);

    expect(getSchemaStatus(false, false, undefined, executeResult)).toBe('failed');
  });

  test('returns failed when showResult has errors', () => {
    const showResult = createResult('sql', [{ message: 'err', title: 'Error', type: 'ERROR' }]);

    expect(getSchemaStatus(false, false, showResult)).toBe('failed');
  });

  test('returns nothingToGenerate when script empty', () => {
    const showResult = createResult('');
    expect(getSchemaStatus(false, false, showResult)).toBe('nothingToGenerate');
  });

  test('returns previewSuccess when script exists and no errors', () => {
    const showResult = createResult('CREATE TABLE');
    expect(getSchemaStatus(false, false, showResult)).toBe('previewSuccess');
  });
});

describe('SubmitButton', () => {
  test('calls onExecute when previewSuccess', async () => {
    const onExecute = vi.fn();
    customRender(<SubmitButton status='previewSuccess' onExecute={onExecute} onRetry={vi.fn()} onClose={vi.fn()} />);
    await userEvent.click(screen.getByRole('button'));
    expect(onExecute).toHaveBeenCalled();
  });

  test('calls onRetry when failed', async () => {
    const onRetry = vi.fn();
    customRender(<SubmitButton status='failed' onExecute={vi.fn()} onRetry={onRetry} onClose={vi.fn()} />);
    await userEvent.click(screen.getByRole('button'));
    expect(onRetry).toHaveBeenCalled();
  });

  test('calls onClose when executionSuccess', async () => {
    const onClose = vi.fn();
    customRender(<SubmitButton status='executionSuccess' onExecute={vi.fn()} onRetry={vi.fn()} onClose={onClose} />);
    await userEvent.click(screen.getByRole('button'));
    expect(onClose).toHaveBeenCalled();
  });

  test('button is disabled while loading', () => {
    customRender(<SubmitButton status='loading' onExecute={vi.fn()} onRetry={vi.fn()} onClose={vi.fn()} />);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
