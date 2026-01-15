import { mdiTextBoxPlus } from '@lumx/icons';
import { Uploader, Theme } from '@lumx/react';

export default ({ theme }: { theme?: Theme }) => <Uploader icon={mdiTextBoxPlus} label="Add files" theme={theme} />;
