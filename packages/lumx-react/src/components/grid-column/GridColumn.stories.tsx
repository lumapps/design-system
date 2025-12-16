/* eslint-disable react/display-name */
import range from 'lodash/range';

import { GridColumn, GridColumnProps } from '@lumx/react/components/grid-column/GridColumn';
import { getSelectArgType } from '@lumx/react/stories/controls/selectArgType';
import { Size } from '@lumx/react';
import { loremIpsum } from '@lumx/react/stories/utils/lorem';

const genericBlockStyle = { border: '1px solid red', padding: '2px 8px' };

const gapSizes: Array<GridColumnProps['gap']> = [Size.tiny, Size.regular, Size.big, Size.huge];

const getItems = (nb: number) =>
    range(nb).map((key) => (
        // eslint-disable-next-line react/jsx-key
        <div key={key} style={genericBlockStyle}>
            <h2>Column {key}</h2>
            <p>{loremIpsum('tiny')}</p>
        </div>
    ));

export default {
    title: 'LumX components/grid-column/GridColumn',
    component: GridColumn,
    argTypes: {
        nbItems: { control: 'number', min: 0 },
        gap: getSelectArgType(gapSizes),
        itemMinWidth: { control: 'number' },
        maxColumns: { control: 'number' },
    },
    args: GridColumn.defaultProps,
    render: ({ nbItems = 5, ...props }) => <GridColumn {...props}>{getItems(nbItems)}</GridColumn>,
};

/**
 * Default grid column displaying a single column
 */
export const Default = {};

/**
 * Grid column with max 4 columns (responsive)
 */
export const Columns = {
    args: { maxColumns: 4, itemMinWidth: 200 },
};
