import { mdiTextBoxPlus } from '@lumx/icons';
import { Uploader, type Theme } from '@lumx/react';

export default ({ theme }: { theme?: Theme }) => <Uploader icon={mdiTextBoxPlus} label="Add files" theme={theme} />;
