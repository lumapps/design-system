import { mdiAlert, mdiAlertCircle, mdiArrowRight, mdiBullhorn, mdiCheck, mdiMessageText } from '@lumx/icons';
import { ColorPalette, Icon, Size, Theme } from '@lumx/react';

export const App = ({ theme = Theme.light }: any) => (
    <>
        <Icon icon={mdiArrowRight} size={Size.s} color={ColorPalette.blue} />
        <Icon icon={mdiCheck} size={Size.s} color={ColorPalette.green} />
        <Icon icon={mdiAlertCircle} size={Size.s} color={ColorPalette.yellow} />
        <Icon icon={mdiAlert} size={Size.s} color={ColorPalette.red} />
        <Icon icon={mdiBullhorn} size={Size.m} color={ColorPalette.blue} theme={theme} hasShape />
        <Icon icon={mdiAlertCircle} size={Size.m} color={ColorPalette.yellow} theme={theme} hasShape />
        <Icon icon={mdiAlert} size={Size.m} theme={theme} color={ColorPalette.red} hasShape />
        <Icon icon={mdiCheck} size={Size.m} theme={theme} color={ColorPalette.green} hasShape />
        <Icon icon={mdiMessageText} size={Size.m} color={ColorPalette.dark} theme={theme} hasShape />
        <span className={theme === 'dark' ? 'lumx-color-font-light-N' : ''}>Without color:</span>
        <Icon icon={mdiMessageText} size={Size.m} theme={theme} hasShape />
    </>
);
