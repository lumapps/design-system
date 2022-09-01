import { mdiPencil } from '@lumx/icons';
import { Alignment, Button, Icon, Orientation, Size } from '@lumx/react';
import { boolean, number, select, text } from '@storybook/addon-knobs';
import fromPairs from 'lodash/fromPairs';
import React from 'react';

import isArray from 'lodash/isArray';
import { FlexBox, FlexBoxProps } from './FlexBox';

export default { title: 'LumX components/flex-box/FlexBox' };

const DEFAULT_PROPS: any = {};

type FlexBoxPropName = keyof FlexBoxProps;
const flexViewKnobConfigs: Array<
    [FlexBoxPropName, typeof boolean] | [string & FlexBoxPropName, typeof select, any[] | Record<any, any>]
> = [
    ['fillSpace', boolean],
    ['noShrink', boolean],
    ['wrap', boolean],
    ['gap', select, [DEFAULT_PROPS.gap, Size.tiny, Size.regular, Size.medium, Size.big, Size.huge]],
    [
        'hAlign',
        select,
        [
            DEFAULT_PROPS.hAlign,
            Alignment.center,
            Alignment.top,
            Alignment.bottom,
            Alignment.spaceAround,
            Alignment.spaceBetween,
            Alignment.spaceEvenly,
        ],
    ],
    [
        'vAlign',
        select,
        [
            DEFAULT_PROPS.vAlign,
            Alignment.center,
            Alignment.right,
            Alignment.left,
            Alignment.spaceAround,
            Alignment.spaceBetween,
            Alignment.spaceEvenly,
        ],
    ],
    ['orientation', select, [undefined, Orientation.horizontal, Orientation.vertical]],
    [
        'marginAuto',
        select,
        {
            default: DEFAULT_PROPS.marginAuto,
            bottom: Alignment.bottom,
            top: Alignment.top,
            right: Alignment.right,
            left: Alignment.left,
            'left & right': [Alignment.left, Alignment.right],
            'top & bottom': [Alignment.top, Alignment.bottom],
            'all around': [Alignment.top, Alignment.bottom, Alignment.left, Alignment.right],
        },
    ],
];

const setupFlexBoxKnobs = (group: string, knobs: FlexBoxPropName[] = []) =>
    fromPairs(
        knobs.map((knob: FlexBoxPropName) => {
            const [prop, knobFn, selectOptions] = flexViewKnobConfigs.find(([k]) => k === knob) as any;
            if (selectOptions) {
                const defaultValue = isArray(selectOptions) ? selectOptions[0] : DEFAULT_PROPS[prop];
                return [prop, knobFn(prop, selectOptions, defaultValue, group)];
            }
            return [prop, knobFn(prop, DEFAULT_PROPS[prop], group)];
        }),
    );

const flexChildKnobs: FlexBoxPropName[] = ['fillSpace', 'noShrink', 'marginAuto'];

export const Flex = () => (
    <FlexBox {...setupFlexBoxKnobs('-flex container', ['orientation', 'hAlign', 'vAlign', 'wrap', 'gap'])}>
        <FlexBox {...setupFlexBoxKnobs('start', flexChildKnobs)}>
            <Icon icon={mdiPencil} />
        </FlexBox>
        <FlexBox {...setupFlexBoxKnobs('middle', flexChildKnobs)}>
            {text('Text content', 'Some text in a div', 'middle')}
        </FlexBox>
        <FlexBox {...setupFlexBoxKnobs('end', flexChildKnobs)}>
            <Button>OK</Button>
        </FlexBox>
    </FlexBox>
);

const hAlign = (prefix?: string) =>
    select(
        `${prefix ? `${prefix}: ` : ''}Horizontal align`,
        [
            Alignment.center,
            Alignment.top,
            Alignment.bottom,
            Alignment.spaceAround,
            Alignment.spaceBetween,
            Alignment.spaceEvenly,
        ],
        Alignment.center,
    );
const vAlign = (prefix?: string) =>
    select(
        `${prefix ? `${prefix}: ` : ''}Vertical align`,
        [
            Alignment.center,
            Alignment.left,
            Alignment.right,
            Alignment.spaceAround,
            Alignment.spaceBetween,
            Alignment.spaceEvenly,
        ],
        Alignment.center,
    );

const orientation = (prefix?: string) =>
    select(
        `${prefix ? `${prefix}: ` : ''}Set orientation`,
        [Orientation.vertical, Orientation.horizontal],
        Orientation.vertical,
    );

const gapSize = (prefix?: string) =>
    select(`${prefix ? `${prefix}: ` : ''}Gap size`, [Size.regular, Size.medium, Size.big, Size.huge], Size.regular);

export const HorizontalFlex = () => (
    <FlexBox
        orientation={Orientation.horizontal}
        style={{ height: `${number('height (px)', 300)}px`, border: '1px solid red' }}
    >
        <Button>Default</Button>
        <FlexBox hAlign={Alignment.top}>
            <Button>Top</Button>
        </FlexBox>
        <FlexBox
            fillSpace={boolean('Center button: fill space', true)}
            hAlign={hAlign('Center button')}
            vAlign={vAlign('Center button')}
        >
            <Button>Center button</Button>
        </FlexBox>
        <FlexBox hAlign={Alignment.bottom}>
            <Button>Bottom</Button>
        </FlexBox>
    </FlexBox>
);

export const VerticalFlex = () => (
    <FlexBox
        orientation={Orientation.vertical}
        style={{ height: `${number('height (px)', 300)}px`, border: '1px solid red' }}
    >
        <Button>Default</Button>
        <FlexBox vAlign={Alignment.left}>
            <Button>Left</Button>
        </FlexBox>
        <FlexBox
            fillSpace={boolean('Center button: fill space', true)}
            hAlign={hAlign('Center button')}
            vAlign={vAlign('Center button')}
        >
            <Button>Center button</Button>
        </FlexBox>
        <FlexBox vAlign={Alignment.right}>
            <Button>Right</Button>
        </FlexBox>
    </FlexBox>
);

export const GapSizeFlex = () => (
    <FlexBox orientation={orientation()} gap={gapSize()}>
        <Button>Item 1</Button>
        <FlexBox vAlign={Alignment.left}>
            <Button>Item 2</Button>
        </FlexBox>
        <FlexBox>
            <Button>Item 3</Button>
        </FlexBox>
        <FlexBox vAlign={Alignment.right}>
            <Button>Item 4</Button>
        </FlexBox>
    </FlexBox>
);

export const WrapFlex = () => (
    <FlexBox
        orientation={Orientation.horizontal}
        wrap={boolean('wrap', true)}
        style={{ width: `${number('width (px)', 150)}px`, border: '1px solid red' }}
    >
        <FlexBox fillSpace orientation={Orientation.vertical}>
            <Button>Button</Button>
        </FlexBox>
        <Button>Button</Button>
        <Button>Button</Button>
    </FlexBox>
);

export const NoShrinkFlex = () => (
    <FlexBox
        orientation={Orientation.horizontal}
        style={{ width: `${number('width (px)', 150)}px`, border: '1px solid red' }}
    >
        <Button>Button</Button>
        <FlexBox noShrink={boolean('no shrink', true)}>{text('Center text', 'Some long text')}</FlexBox>
        <Button>Button</Button>
    </FlexBox>
);

export const Align = () => (
    <FlexBox orientation={Orientation.horizontal} vAlign={vAlign()} hAlign={hAlign()}>
        <Button style={{ height: 200 }}>Button</Button>
        <FlexBox style={{ height: 'fit-content' }}>Some text</FlexBox>
    </FlexBox>
);

export const Distribution = () => (
    <FlexBox
        style={{
            width: `${number('width (px)', 720)}px`,
            height: `${number('height (px)', 300)}px`,
            border: '1px solid red',
        }}
        orientation={orientation()}
        gap={gapSize()}
        vAlign={vAlign()}
        hAlign={hAlign()}
    >
        <Button>Button 1</Button>
        <Button>Button 2</Button>
        <Button>Button 3</Button>
    </FlexBox>
);

export const CustomizeElement = () => (
    <FlexBox as="header" orientation="horizontal" gap="regular">
        <div>Element 1</div>
        <div>Element 2</div>
        <div>Element 2</div>
    </FlexBox>
);
