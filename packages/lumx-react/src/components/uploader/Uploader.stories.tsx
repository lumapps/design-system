import { AspectRatio, Size, Uploader, UploaderVariant } from '@lumx/react';
import { mdiTextBoxPlus } from '@lumx/icons';
import { withCombinations } from '@lumx/react/stories/decorators/withCombinations';
import { iconArgType } from '@lumx/react/stories/controls/icons';

export default {
    title: 'LumX components/uploader/Uploader',
    component: Uploader,
    argTypes: {
        onClick: { action: true },
        icon: iconArgType,
    },
};

const UPLOADER_VARIANTS = [UploaderVariant.square, UploaderVariant.rounded, UploaderVariant.circle];
const UPLOADER_SIZES = [Size.xl, Size.xxl];

export const Empty = {};

export const WithLabel = {
    args: { label: 'Pick a file' },
};

export const WithLabelAndIcon = {
    args: { label: 'Pick a file', icon: mdiTextBoxPlus },
};

/** All variants */
export const Variants = {
    args: WithLabelAndIcon.args,
    decorators: [
        withCombinations({
            combinations: {
                cols: { key: 'variant', options: UPLOADER_VARIANTS },
            },
        }),
    ],
};

/** All sizes & ratio */
export const RatioAndSize = {
    args: WithLabelAndIcon.args,
    decorators: [
        withCombinations({
            combinations: {
                cols: { key: 'size', options: UPLOADER_SIZES },
                rows: { key: 'aspectRatio', options: Object.values(AspectRatio) },
            },
        }),
    ],
};
