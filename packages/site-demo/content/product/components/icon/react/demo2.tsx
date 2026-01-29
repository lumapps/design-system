import { mdiMessageTextOutline } from '@lumx/icons';
import { Icon, type Theme } from '@lumx/react';

export default ({ theme }: { theme?: Theme }) => (
    <>
        <Icon icon={mdiMessageTextOutline} size="s" hasShape theme={theme} />
        <Icon icon={mdiMessageTextOutline} size="m" hasShape theme={theme} />
        <Icon icon={mdiMessageTextOutline} size="l" hasShape theme={theme} />
        <Icon icon={mdiMessageTextOutline} size="xl" hasShape theme={theme} />
    </>
);
