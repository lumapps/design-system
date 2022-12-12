import React from 'react';

import { GridColumn } from '@lumx/react/components/grid-column/GridColumn';

import range from 'lodash/range';
import { Size } from '@lumx/react';

const genericBlockStyle = { border: '1px solid red', padding: '2px 8px' };

export default {
    title: 'LumX components/grid-column/GridColumn',
    argTypes: {
        nbItems: {
            control: 'number',
            defaultValue: 6,
            min: 0,
        },
        gap: {
            control: 'select',
            options: [Size.tiny, Size.regular, Size.big, Size.huge],
            defaultValue: Size.regular,
        },
        itemMinWidth: {
            control: 'number',
            defaultValue: 200,
        },
        maxColumns: {
            control: 'number',
            defaultValue: 4,
        },
    },
    args: {
        style: {
            overflow: 'hidden',
            resize: 'horizontal',
        },
    },
};

const getItems = (nb) =>
    range(nb).map((key) => (
        // eslint-disable-next-line react/jsx-key
        <div style={genericBlockStyle}>
            <h2>Column {key}</h2>
            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua. Nulla pharetra diam sit amet nisl suscipit adipiscing bibendum. Iaculis at erat
                pellentesque adipiscing commodo elit at imperdiet dui. Ultricies integer quis auctor elit sed vulputate.
                Mattis enim ut tellus elementum. Ipsum suspendisse ultrices gravida dictum fusce ut..
            </p>
        </div>
    ));

const Template = ({ nbItems = 5, ...props }) => <GridColumn {...props}>{getItems(nbItems)}</GridColumn>;

export const Default = Template.bind({});
