import { mdiImagePlus } from '@lumx/icons';
import { Uploader, UploaderVariant } from '@lumx/react';

export const App = ({ theme }: any) => (
    <Uploader icon={mdiImagePlus} label="Add picture" theme={theme} variant={UploaderVariant.rounded} />
);
