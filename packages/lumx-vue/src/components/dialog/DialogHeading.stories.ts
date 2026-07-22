import { setup } from '@lumx/core/js/components/Dialog/DialogHeadingStories';

import DialogHeading from './DialogHeading';

const { meta, ...stories } = setup({ component: DialogHeading });

export default {
    title: 'LumX components/dialog/DialogHeading',
    ...meta,
};

export const Default = { ...stories.Default };
export const CustomTypography = { ...stories.CustomTypography };
