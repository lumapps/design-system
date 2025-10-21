import { withValueOnChange } from '@lumx/react/stories/decorators/withValueOnChange';
import { withWrapper } from '@lumx/react/stories/decorators/withWrapper';

import { RawInputTextarea } from './RawInputTextarea';

export default {
    title: 'LumX components/text-field/RawInputTextarea',
    component: RawInputTextarea,
    decorators: [withValueOnChange(), withWrapper({ style: { border: '1px dashed red' } })],
};

export const Default = {};

export const WithMinimumRows = {
    args: { minimumRows: 3 },
};

export const WithPlaceholder = {
    args: {
        placeholder: 'Input placeholder',
    },
};
