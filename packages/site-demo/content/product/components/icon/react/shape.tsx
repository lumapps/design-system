import { mdiMessageTextOutline } from '@lumx/icons';
import { Icon, Size } from '@lumx/react';

export const App = ({ theme }: any) => (
    <>
        <Icon icon={mdiMessageTextOutline} size={Size.s} hasShape theme={theme} />
        <Icon icon={mdiMessageTextOutline} size={Size.m} hasShape theme={theme} />
        <Icon icon={mdiMessageTextOutline} size={Size.l} hasShape theme={theme} />
        <Icon icon={mdiMessageTextOutline} size={Size.xl} hasShape theme={theme} />
    </>
);
