import { mdiPencil } from '@lumx/icons';
import { Alignment, Button, Icon, Orientation } from '@lumx/react';
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
    ['hAlign', select, [DEFAULT_PROPS.hAlign, Alignment.center, Alignment.top, Alignment.bottom]],
    ['vAlign', select, [DEFAULT_PROPS.vAlign, Alignment.center, Alignment.right, Alignment.left]],
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
    <FlexBox {...setupFlexBoxKnobs('-flex container', ['orientation', 'hAlign', 'vAlign', 'wrap'])}>
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
        [Alignment.center, Alignment.top, Alignment.bottom],
        Alignment.center,
    );
const vAlign = (prefix?: string) =>
    select(
        `${prefix ? `${prefix}: ` : ''}Vertical align`,
        [Alignment.center, Alignment.left, Alignment.right],
        Alignment.center,
    );

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
