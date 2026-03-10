import React from 'react';
import map from 'lodash/map';

import { withCombinations } from '@lumx/react/stories/decorators/withCombinations';
import { withNestedProps } from '@lumx/react/stories/decorators/withNestedProps';
import { withWrapper } from '@lumx/react/stories/decorators/withWrapper';
import { setup } from '@lumx/core/js/components/Uploader/Stories';

import { GridColumn, Uploader } from '@lumx/react';

const { meta, ...stories } = setup({
    component: Uploader,
    components: { GridColumn },
    decorators: { withCombinations, withWrapper },
});

export default { title: 'LumX components/uploader/Uploader', ...meta };

export const WithLabel = { ...stories.WithLabel };
export const WithLabelAndIcon = { ...stories.WithLabelAndIcon };
export const Variants = { ...stories.Variants };
export const RatioAndSize = { ...stories.RatioAndSize };

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
    ...stories.WithLabelAndIcon,
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
