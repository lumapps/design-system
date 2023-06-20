import React from 'react';
import map from 'lodash/map';

import { withCombinations } from '@lumx/react/stories/decorators/withCombinations';
import { iconArgType } from '@lumx/react/stories/controls/icons';
import { withNestedProps } from '@lumx/react/stories/decorators/withNestedProps';
import { withWrapper } from '@lumx/react/stories/decorators/withWrapper';

import { AspectRatio, GridColumn, Size, Uploader, UploaderVariant } from '@lumx/react';
import { mdiTextBoxPlus } from '@lumx/icons';

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

export const WithLabel = {
    args: { label: 'Pick a file' },
};

export const WithLabelAndIcon = {
    args: { label: 'Pick a file', icon: mdiTextBoxPlus },
};

// Decorator handling the file input change
function withFileInputChange() {
    // eslint-disable-next-line react/display-name
    return (Story: any, ctx: any) => {
        const [files, onChange] = React.useState<File[]>([]);
        return (
            <>
                <Story args={{ ...ctx.args, fileInputProps: { ...ctx.args.fileInputProps, onChange } }} />
                <p>Selection: {map(files, 'name').join(', ')}</p>
            </>
        );
    };
}

/**
 * Use the embedded native input file which also make it possible to drop files onto it.
 */
export const FileInput = {
    ...WithLabelAndIcon,
    decorators: [
        withNestedProps(),
        withFileInputChange(),
        withCombinations({
            combinations: {
                sections: {
                    'Single file': { fileInputProps: {} },
                    'Multiple files': { fileInputProps: { multiple: true } },
                    'Images only': { fileInputProps: { multiple: true, accept: 'image/*' } },
                },
            },
        }),
        withWrapper({ maxColumns: 3, itemMinWidth: 200 }, GridColumn),
    ],
};

/** All variants */
export const Variants = {
    args: WithLabelAndIcon.args,
    decorators: [
        withCombinations({
            combinations: {
                rows: { key: 'variant', options: UPLOADER_VARIANTS },
                sections: {
                    Button: {},
                    'File input': { fileInputProps: {} },
                },
            },
        }),
        withWrapper({ maxColumns: 2, itemMinWidth: 300 }, GridColumn),
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
                sections: {
                    Button: {},
                    'File input': { fileInputProps: {} },
                },
            },
        }),
        withWrapper({ maxColumns: 2, itemMinWidth: 200 }, GridColumn),
    ],
};
