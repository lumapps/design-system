import type { SetupStoriesOptions } from '@lumx/core/stories/types';
import { getSelectArgType } from '@lumx/core/stories/controls/selectArgType';
import { Size } from '../../constants';
import { DEFAULT_PROPS } from './GridColumn';
import type { GridColumnProps } from './GridColumn';

const gapSizes: Array<GridColumnProps['gap']> = [Size.tiny, Size.regular, Size.big, Size.huge];

export function setup({
    component,
    render,
}: SetupStoriesOptions<{
    decorators?: never;
}>) {
    return {
        meta: {
            component,
            render,
            argTypes: {
                nbItems: { control: 'number' },
                gap: getSelectArgType(gapSizes),
                itemMinWidth: { control: 'number' },
                maxColumns: { control: 'number' },
            },
            args: {
                ...DEFAULT_PROPS,
                nbItems: 5,
            },
        },

        /** Default grid column displaying a single column */
        Default: {},

        /** Grid column with max 4 columns (responsive) */
        Columns: {
            args: { maxColumns: 4, itemMinWidth: 200 },
        },
    };
}
