import { withValueOnChange } from '@lumx/react/stories/decorators/withValueOnChange';
import { withWrapper } from '@lumx/react/stories/decorators/withWrapper';

import { RawInputText } from './RawInputText';

export default {
    title: 'LumX components/text-field/RawInputText',
    component: RawInputText,
    decorators: [withValueOnChange(), withWrapper({ style: { border: '1px dashed red' } })],
};

export const Default = {};

export const WithPlaceholder = {
    args: {
        placeholder: 'Input placeholder',
    },
};
