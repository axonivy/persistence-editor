import { type GenerationType, type PersistenceContext, type PersistenceData, type Result } from '@axonivy/persistence-editor-protocol';
import {
  BasicDialogContent,
  BasicField,
  BasicSelect,
  BasicTooltip,
  Button,
  Dialog,
  DialogContent,
  DialogTrigger,
  Flex,
  Message,
  toast,
  useDialogHotkeys
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useQuery } from '@tanstack/react-query';
import { useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../context/AppContext';
import { useClient } from '../../context/ClientContext';
import { useFunction } from '../../hooks/useFunction';
import { genQueryKey } from '../../query/query-client';

const DIALOG_HOTKEY_IDS = ['schemaGenerateDialog'];

export const SchemaGenerateDialog = ({ children }: { children: ReactNode }) => {
  const { t } = useTranslation();
  const { data, selectedIndex } = useAppContext();
  const { open, onOpenChange } = useDialogHotkeys(DIALOG_HOTKEY_IDS);
  const selectedPersistence = data[selectedIndex];
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <BasicTooltip content={t('dialog.generateSchema.title')}>
        <DialogTrigger asChild>{children}</DialogTrigger>
      </BasicTooltip>
      <DialogContent className='max-h-none! w-[clamp(300px,700px,calc(100%-200px))]! max-w-none!'>
        {selectedPersistence && (
          <SchemaGenerateDialogContent selectedPersistence={selectedPersistence} closeDialog={() => onOpenChange(false)} />
        )}
      </DialogContent>
    </Dialog>
  );
};

type SchemaGenerateDialogContentProps = { closeDialog: () => void; selectedPersistence: PersistenceData };

const SchemaGenerateDialogContent = ({ closeDialog, selectedPersistence }: SchemaGenerateDialogContentProps) => {
  const { t } = useTranslation();
  const { context } = useAppContext();
  const [type, setType] = useState<GenerationType>('CREATE');
  const client = useClient();

  const {
    data: showResult,
    isPending: showIsPending,
    refetch: refetchShow
  } = useQuery({
    queryKey: genQueryKey('functions/schemaShow', buildConfig(context, selectedPersistence, type)),
    queryFn: () => client.meta('functions/schemaShow', buildConfig(context, selectedPersistence, type))
  });

  const {
    data: executeResult,
    isPending: executeIsPending,
    mutate: execute,
    reset: resetExecute
  } = useFunction('functions/schemaExecute', buildConfig(context, selectedPersistence, type), {});

  const status = getSchemaStatus(showIsPending, executeIsPending, showResult, executeResult);
  const resultToShow = executeResult ?? showResult;

  return (
    <BasicDialogContent
      title={t('dialog.generateSchema.title')}
      description={t('dialog.generateSchema.description')}
      submit={
        <SubmitButton
          status={status}
          onExecute={() => execute(buildConfig(context, selectedPersistence, type))}
          onRetry={() => {
            refetchShow();
            resetExecute();
          }}
          onClose={closeDialog}
        />
      }
      cancel={
        <Button variant='outline' size='large'>
          {t('common.label.cancel')}
        </Button>
      }
      tabIndex={-1}
    >
      <BasicField label={t('dialog.generateSchema.type')} aria-label={t('dialog.generateSchema.type')}>
        <BasicSelect
          value={type}
          onValueChange={value => {
            setType(value as GenerationType);
            resetExecute();
          }}
          items={[
            { label: t('dialog.generateSchema.create'), value: 'CREATE' },
            { label: t('dialog.generateSchema.update'), value: 'UPDATE' }
          ]}
          disabled={status === 'executionSuccess'}
        />
      </BasicField>
      {resultToShow && status !== 'loading' && (
        <Flex direction='column' gap={2}>
          {status === 'executionSuccess' && (
            <Message title={t('dialog.generateSchema.successTitle')} message={t('dialog.generateSchema.successMessage')} variant='info' />
          )}
          {status === 'previewSuccess' && (
            <BasicField
              label={t('dialog.generateSchema.sqlTitle')}
              aria-label={t('dialog.generateSchema.sqlTitle')}
              control={<CopyToClipboardButton script={resultToShow.script} />}
            >
              <pre className='max-h-[60vh] overflow-auto rounded-(--border-r1) bg-n50 py-3 font-mono whitespace-pre'>
                {resultToShow.script.replace(/^\n+/, '')}
              </pre>
            </BasicField>
          )}
          {status === 'nothingToGenerate' && (
            <Message
              title={t('dialog.generateSchema.nothingToGenerate')}
              message={t('dialog.generateSchema.nothingToGenerate')}
              variant={'info'}
            />
          )}
          {resultToShow.errors.length > 0 && (
            <Flex direction='column' gap={1} className='max-h-[30vh] overflow-auto'>
              {resultToShow.errors.map(error => (
                <Message key={error.message} variant='error' title={error.title} message={error.message} />
              ))}
            </Flex>
          )}
        </Flex>
      )}
    </BasicDialogContent>
  );
};

const buildConfig = (context: PersistenceContext, selectedPersistence: PersistenceData, type: GenerationType) => ({
  context,
  config: {
    dataSource: selectedPersistence.dataSource,
    generationType: type,
    persistenceUnit: selectedPersistence.name
  }
});

type SchemaStatus = 'loading' | 'failed' | 'previewSuccess' | 'executionSuccess' | 'nothingToGenerate';

export const getSchemaStatus = (
  schemaShowPending: boolean,
  schemaExecutePending: boolean,
  showResult?: Result,
  executeResult?: Result
): SchemaStatus => {
  if (schemaExecutePending || schemaShowPending) return 'loading';
  if (executeResult && executeResult.errors.length === 0) return 'executionSuccess';
  if ((executeResult && executeResult.errors.length > 0) || (showResult && showResult.errors.length > 0)) return 'failed';
  if (!executeResult && showResult && showResult.script.length === 0) return 'nothingToGenerate';
  return 'previewSuccess';
};

type SubmitButtonProps = {
  status: SchemaStatus;
  onExecute: () => void;
  onRetry: () => void;
  onClose: () => void;
};

export const SubmitButton = ({ status, onExecute, onRetry, onClose }: SubmitButtonProps) => {
  const { t } = useTranslation();
  return status === 'previewSuccess' ? (
    <BasicTooltip content={t('dialog.executeTooltip')}>
      <Button variant='primary' size='large' icon={IvyIcons.Play} aria-label={t('dialog.execute')} onClick={onExecute}>
        {t('dialog.execute')}
      </Button>
    </BasicTooltip>
  ) : status === 'failed' ? (
    <BasicTooltip content={t('dialog.retryTooltip')}>
      <Button variant='primary' size='large' icon={IvyIcons.Redo} aria-label={t('dialog.retry')} onClick={onRetry}>
        {t('dialog.retry')}
      </Button>
    </BasicTooltip>
  ) : status === 'loading' ? (
    <Button variant='primary' size='large' icon={IvyIcons.Spinner} aria-label={t('dialog.loading')} disabled={true} spin={true}>
      {t('dialog.loading')}
    </Button>
  ) : (
    <Button variant='primary' size='large' icon={IvyIcons.Close} aria-label={t('dialog.close')} onClick={onClose}>
      {t('dialog.close')}
    </Button>
  );
};

const CopyToClipboardButton = ({ script }: { script?: string }) => {
  const { t } = useTranslation();

  const copyScriptToClipboard = async () => {
    if (!script) return;

    try {
      await navigator.clipboard.writeText(script);
      toast.success(t('dialog.generateSchema.copySuccess'));
    } catch (error) {
      toast.error(t('dialog.generateSchema.copyFailed'), {
        description: error instanceof Error ? error.message : undefined
      });
    }
  };

  return (
    <BasicTooltip content={t('dialog.generateSchema.copySql')}>
      <Button icon={IvyIcons.Duplicate} onClick={copyScriptToClipboard} disabled={!script} />
    </BasicTooltip>
  );
};
