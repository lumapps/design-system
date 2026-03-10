import type { SetupStoriesOptions } from '@lumx/core/stories/types';
import { iconArgType } from '@lumx/core/stories/controls/icons';
import { getSelectArgType } from '@lumx/core/stories/controls/selectArgType';
import { withUndefined } from '@lumx/core/stories/controls/withUndefined';
import { mdiTextBoxPlus } from '@lumx/icons';
import { AspectRatio, Size } from '../../constants';
import { DEFAULT_PROPS, UploaderVariant } from '.';

const UPLOADER_VARIANTS = [UploaderVariant.square, UploaderVariant.rounded, UploaderVariant.circle];
const UPLOADER_SIZES = [Size.xl, Size.xxl];
const ASPECT_RATIOS = [AspectRatio.wide, AspectRatio.horizontal, AspectRatio.vertical, AspectRatio.square];

export function setup({
    component: Uploader,
    components: { GridColumn },
    decorators: { withCombinations, withWrapper },
}: SetupStoriesOptions<{
    decorators: 'withCombinations' | 'withWrapper';
    components: { GridColumn: any };
}>) {
    const meta = {
        component: Uploader,
        render: (args: any) => <Uploader {...args} />,
        argTypes: {
            onClick: { action: true },
            icon: iconArgType,
            aspectRatio: getSelectArgType(AspectRatio),
        },
        args: DEFAULT_PROPS,
    };

    const WithLabel = {
        args: { label: 'Pick a file' },
    };

    const WithLabelAndIcon = {
        args: { label: 'Pick a file', icon: mdiTextBoxPlus },
    };

    /** All variants */
    const Variants = {
        args: WithLabelAndIcon.args,
        decorators: [
            withCombinations({
                combinations: {
                    rows: { key: 'variant', options: UPLOADER_VARIANTS },
                    cols: {
                        Default: {},
                        Disabled: { isDisabled: true },
                        'Aria Disabled': { 'aria-disabled': true },
                    },
                    sections: {
                        Button: {},
                        'File input': { fileInputProps: {} },
                    },
                },
            }),
            withWrapper({ maxColumns: 2, itemMinWidth: 470 }, GridColumn),
        ],
    };

    /** All sizes & ratio */
    const RatioAndSize = {
        args: WithLabelAndIcon.args,
        decorators: [
            withCombinations({
                combinations: {
                    cols: { key: 'size', options: UPLOADER_SIZES },
                    rows: { key: 'aspectRatio', options: withUndefined(ASPECT_RATIOS) },
                    sections: {
                        Button: {},
                        'File input': { fileInputProps: {} },
                    },
                },
            }),
            withWrapper({ maxColumns: 2, itemMinWidth: 470 }, GridColumn),
        ],
    };

    return { meta, WithLabel, WithLabelAndIcon, Variants, RatioAndSize };
}
