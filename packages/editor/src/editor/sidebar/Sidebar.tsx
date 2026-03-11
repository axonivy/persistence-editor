import { BasicTooltip, Button, SidebarHeader, useHotkeys } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../context/AppContext';
import { useAction } from '../../hooks/useAction';
import { useKnownHotkeys } from '../../utils/useKnownHotkeys';
import { DetailContent } from './DetailContent';

export const Sidebar = ({ ref }: { ref: React.Ref<HTMLDivElement> }) => {
  const { data, helpUrl, selectedIndex } = useAppContext();
  const persistence = data[selectedIndex];
  const { t } = useTranslation();
  const openUrl = useAction('openUrl');
  const { openHelp: helpText } = useKnownHotkeys();
  useHotkeys(helpText.hotkey, () => openUrl(helpUrl), { scopes: ['global'] });

  return (
    <>
      <SidebarHeader title={persistence?.name ?? t('title.detail')} icon={IvyIcons.PenEdit} ref={ref} tabIndex={-1}>
        <BasicTooltip content={helpText.label}>
          <Button icon={IvyIcons.Help} onClick={() => openUrl(helpUrl)} aria-label={helpText.label} />
        </BasicTooltip>
      </SidebarHeader>
      <DetailContent />
    </>
  );
};
