import range from 'lodash/range';
import type { SetupStoriesOptions } from '@lumx/core/stories/types';
import { getSelectArgType } from '@lumx/core/stories/controls/selectArgType';
import { loremIpsum } from '@lumx/core/stories/utils/lorem';
import { Size } from '../../constants';
import { DEFAULT_PROPS } from './GridColumn';
import type { GridColumnProps } from './GridColumn';

const gapSizes: Array<GridColumnProps['gap']> = [Size.tiny, Size.regular, Size.big, Size.huge];

const genericBlockStyle = { border: '1px solid red', padding: '2px 8px' };
const getItems = (nb: number) =>
    range(nb).map((key) => (
        <div key={key} style={genericBlockStyle}>
            <h2>Column {key}</h2>
            <p>{loremIpsum('tiny')}</p>
        </div>
    ));

export function setup({
    component: GridColumn,
}: SetupStoriesOptions<{
    decorators?: never;
}>) {
    const meta = {
        component: GridColumn,
        render: ({ nbItems = 5, ...props }: any) => <GridColumn {...props}>{getItems(nbItems)}</GridColumn>,
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
    };

    /** Default grid column displaying a single column */
    const Default = {};

    /** Grid column with max 4 columns (responsive) */
    const Columns = {
        args: { maxColumns: 4, itemMinWidth: 200 },
    };

    return { meta, Default, Columns };
}
