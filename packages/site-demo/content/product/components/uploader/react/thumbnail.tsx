import { mdiImagePlus } from '@lumx/icons';
import { Uploader, UploaderVariant, type Theme } from '@lumx/react';

export default ({ theme }: { theme?: Theme }) => (
    <Uploader icon={mdiImagePlus} label="Add picture" theme={theme} variant={UploaderVariant.rounded} />
);
