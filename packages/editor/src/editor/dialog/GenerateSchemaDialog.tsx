import type { GenerationType, PersistenceData, Result } from '@axonivy/persistence-editor-protocol';
import {
  BasicDialogContent,
  BasicField,
  BasicSelect,
  Button,
  Dialog,
  DialogContent,
  DialogTrigger,
  Flex,
  hotkeyText,
  Spinner,
  toast,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  useDialogHotkeys,
  useHotkeys
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../context/AppContext';
import { useFunction } from '../../hooks/useFunction';
import { useKnownHotkeys } from '../../utils/useKnownHotkeys';

const DIALOG_HOTKEY_IDS = ['generateSchemaDialog'];

export const GenerateSchemaDialog = ({ children, selectedPU }: { children: ReactNode; selectedPU?: PersistenceData }) => {
  const { open, onOpenChange } = useDialogHotkeys(DIALOG_HOTKEY_IDS);
  const { generateSchema: shortcut } = useKnownHotkeys();
  useHotkeys(shortcut.hotkey, () => onOpenChange(true), { scopes: ['global'], keyup: true, enabled: !open });
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>{children}</DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>{shortcut.label}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DialogContent
        onCloseAutoFocus={e => e.preventDefault()}
        style={{ maxWidth: 'unset', maxHeight: 'unset', width: 'clamp(300px, 700px, calc(100% - 200px))' }}
      >
        <AddDialogContent
          selectedPU={
            selectedPU ?? {
              name: '',
              dataSource: '',
              description: '',
              excludeUnlistedClasses: false,
              managedClasses: [],
              properties: {}
            }
          }
        />
      </DialogContent>
    </Dialog>
  );
};
type FieldOption<TValue> = {
  label: string;
  value: TValue;
};

const AddDialogContent = ({ selectedPU }: { selectedPU: PersistenceData }) => {
  const { context } = useAppContext();
  const { t } = useTranslation();
  const typeOptions: FieldOption<GenerationType>[] = [
    { label: t('dialog.generateSchema.create'), value: 'CREATE' },
    { label: t('dialog.generateSchema.update'), value: 'UPDATE' }
  ];
  const [result, setResult] = useState<Result>();
  const [type, setType] = useState<GenerationType>('CREATE');
  const [preview, setPreview] = useState(true);
  const { mutate: executeSql, isPending } = useFunction(
    'function/generateSchema',
    {
      context,
      config: {
        data: selectedPU ?? {
          name: '',
          dataSource: '',
          description: '',
          excludeUnlistedClasses: false,
          managedClasses: [],
          properties: {}
        },
        generationType: type,
        preview: preview
      }
    },
    {
      onSuccess: data => {
        setResult(data);
        setPreview(!preview);
      },
      onError: error => {
        toast.error('Failed to ' + type + ' Schema', { description: error.message });
      }
    }
  );

  // const enter = useHotkeys<HTMLDivElement>(['Enter', 'mod+Enter'], executeSql, { scopes: DIALOG_HOTKEY_IDS, enableOnFormTags: true });
  return (
    <BasicDialogContent
      title={t('dialog.generateSchema.title')}
      description={t('dialog.generateSchema.desc')}
      submit={
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant='primary'
                size='large'
                icon={preview ? IvyIcons.Eye : IvyIcons.Plus}
                aria-label={t(preview ? 'dialog.generateSchema.title' : 'dialog.generateSchema.execute')}
                onClick={e => {
                  e.preventDefault();
                  executeSql({
                    context,
                    config: {
                      data: selectedPU,
                      generationType: type,
                      preview: preview
                    }
                  });
                }}
              >
                {t(preview ? 'dialog.generateSchema.title' : 'dialog.generateSchema.execute')}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {t(preview ? 'dialog.generateSchema.title' : 'dialog.generateSchema.createTooltip', { modifier: hotkeyText('mod') })}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      }
      cancel={
        <Button variant='outline' size='large'>
          {t('common.label.cancel')}
        </Button>
      }
      // ref={enter}
      tabIndex={-1}
    >
      <BasicField label={t('common.label.name')} aria-label={t('common.label.name')}>
        <BasicSelect items={typeOptions} value={type} onValueChange={v => setType(v as GenerationType)} />
      </BasicField>
      {isPending && (
        <Flex alignItems='center' justifyContent='center' style={{ width: '100%', height: '100%' }}>
          <Spinner />
        </Flex>
      )}
      {result && result.throwables.length === 0 && result.script.length > 0 && (
        <BasicField label={t('dialog.generateSchema.result')} aria-label={t('dialog.generateSchema.result')}>
          <pre
            style={{
              whiteSpace: 'pre-wrap',
              fontFamily: 'monospace',
              background: '#f5f5f5',
              padding: '1rem',
              borderRadius: '4px',
              overflowX: 'auto'
            }}
          >
            {result.script}
          </pre>
        </BasicField>
      )}
      {result && result.throwables.length > 0 && (
        <BasicField label={t('dialog.generateSchema.result')} aria-label={t('dialog.generateSchema.result')}>
          <pre>{JSON.stringify(result.throwables, null, 2)}</pre>
        </BasicField>
      )}
    </BasicDialogContent>
  );
};
