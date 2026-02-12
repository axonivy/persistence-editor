import type { PersistenceData } from '@axonivy/persistence-editor-protocol';
import { BasicField, Input, type MessageData } from '@axonivy/ui-components';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useValidateName, validateName } from '../../../hooks/useValidateName';

type NameInputProps = {
  value: string;
  onChange: (change: string) => void;
  persistenceUnits: PersistenceData[];
  message?: MessageData;
};

export const NameInput = ({ value, onChange, persistenceUnits, message }: NameInputProps) => {
  const { t } = useTranslation();
  const [currentValue, setCurrentValue] = useState(value ?? '');
  const [prevValue, setPrevValue] = useState(value);
  const nameValidationMessage = useValidateName(currentValue, persistenceUnits);
  if (value !== undefined && prevValue !== value) {
    setCurrentValue(value);
    setPrevValue(value);
  }
  const updateValue = (value: string) => {
    setCurrentValue(value);
    if (validateName(value, persistenceUnits) === undefined) {
      onChange?.(value);
    }
  };
  return (
    <BasicField label={t('common.label.name')} message={nameValidationMessage ?? message}>
      <Input value={currentValue} onChange={event => updateValue(event.target.value)} />
    </BasicField>
  );
};
