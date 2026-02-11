import type { PersistenceData } from '@axonivy/persistence-editor-protocol';
import type { MessageData } from '@axonivy/ui-components';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export const useValidateName = (name: string, persistences: Array<PersistenceData>) => {
  const { t } = useTranslation();
  return useMemo<MessageData | undefined>(() => {
    switch (validateName(name, persistences)) {
      case 'emptyName':
        return toErrorMessage(t('message.emptyName'));
      case 'persistenceAlreadyExists':
        return toErrorMessage(t('message.persistenceAlreadyExists'));
      default:
        return;
    }
  }, [name, persistences, t]);
};

export const validateName = (name: string, persistences: Array<PersistenceData>) => {
  const trimmedName = name.trim();
  if (trimmedName === '') {
    return 'emptyName';
  }
  if (persistences.map(persistence => persistence.id).includes(trimmedName)) {
    return 'persistenceAlreadyExists';
  }
  return undefined;
};

const toErrorMessage = (message: string): MessageData => ({ message: message, variant: 'error' });
