import {
  BasicTooltip,
  Button,
  Flex,
  Separator,
  Toolbar,
  ToolbarContainer,
  ToolbarTitle,
  useHotkeys,
  useReadonly,
  useRedoHotkey,
  useUndoHotkey
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../context/AppContext';
import { useKnownHotkeys } from '../../utils/useKnownHotkeys';

export const PersistenceToolbar = () => {
  const { detail, setDetail, context } = useAppContext();
  const readonly = useReadonly();
  const { t } = useTranslation();

  const firstElementRef = useRef<HTMLDivElement>(null);
  const hotkeys = useKnownHotkeys();
  useHotkeys(hotkeys.focusToolbar.hotkey, () => firstElementRef.current?.focus(), { scopes: ['global'] });

  return (
    <Toolbar tabIndex={-1} ref={firstElementRef}>
      <ToolbarTitle>{t('title.main', { name: context.pmv })}</ToolbarTitle>
      <Flex gap={1}>
        {!readonly && <EditButtons />}
        <BasicTooltip content={t('common.label.details')}>
          <Button
            icon={IvyIcons.LayoutSidebarRightCollapse}
            size='large'
            onClick={() => setDetail(!detail)}
            aria-label={t('common.label.details')}
          />
        </BasicTooltip>
      </Flex>
    </Toolbar>
  );
};

const EditButtons = () => {
  const { history, setUnhistoriedVariables } = useAppContext();
  const hotkeys = useKnownHotkeys();
  const undo = () => history.undo(setUnhistoriedVariables);
  const redo = () => history.redo(setUnhistoriedVariables);
  useUndoHotkey(undo, { scopes: ['global'] });
  useRedoHotkey(redo, { scopes: ['global'] });
  return (
    <ToolbarContainer maxWidth={450}>
      <Flex>
        <Flex gap={1}>
          <BasicTooltip content={hotkeys.undo.label}>
            <Button aria-label={hotkeys.undo.label} icon={IvyIcons.Undo} size='large' onClick={undo} disabled={!history.canUndo} />
          </BasicTooltip>
          <BasicTooltip content={hotkeys.redo.label}>
            <Button aria-label={hotkeys.redo.label} icon={IvyIcons.Redo} size='large' onClick={redo} disabled={!history.canRedo} />
          </BasicTooltip>
        </Flex>
        <Separator orientation='vertical' className='mx-2! h-6.5!' />
      </Flex>
    </ToolbarContainer>
  );
};
