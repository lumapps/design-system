import { mdiPencil } from '@lumx/icons';
import { Alignment, Button, Icon, Orientation } from '@lumx/react';
import { boolean, number, select, text } from '@storybook/addon-knobs';
import React from 'react';

import { DEFAULT_PROPS, FlexView, FlexViewProps } from './FlexView';
/*  tslint:disable object-literal-sort-keys */

export default { title: 'FlexView' };

type FlexViewPropName = keyof FlexViewProps;
const flexViewKnobConfigs: Array<
    [FlexViewPropName, typeof boolean] | [string & FlexViewPropName, typeof select, any[] | Record<any, any>]
> = [
    ['fillSpace', boolean],
    ['noShrink', boolean],
    ['wrap', boolean],
    ['hAlign', select, [DEFAULT_PROPS.hAlign, Alignment.center, Alignment.top, Alignment.bottom]],
    ['vAlign', select, [DEFAULT_PROPS.vAlign, Alignment.center, Alignment.right, Alignment.left]],
    ['orientation', select, Orientation],
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

const setupFlexViewKnobs = (group: string, knobs: FlexViewPropName[] = []) =>
    Object.fromEntries(
        knobs.map((knob: FlexViewPropName) => {
            const [prop, knobFn, selectOptions] = flexViewKnobConfigs.find(([k]) => k === knob)! as any;
            if (selectOptions) {
                return [prop, knobFn(prop, selectOptions, DEFAULT_PROPS[prop], group)];
            }
            return [prop, knobFn(prop, DEFAULT_PROPS[prop], group)];
        }),
    );

const flexChildKnobs: FlexViewPropName[] = ['fillSpace', 'noShrink', 'marginAuto'];

export const Flex = () => (
    <FlexView {...setupFlexViewKnobs('-flex container', ['orientation', 'hAlign', 'vAlign', 'wrap'])}>
        <FlexView {...setupFlexViewKnobs('start', flexChildKnobs)}>
            <Icon icon={mdiPencil} />
        </FlexView>
        <FlexView {...setupFlexViewKnobs('middle', flexChildKnobs)}>
            {text('Text content', 'Some text in a div', 'middle')}
        </FlexView>
        <FlexView {...setupFlexViewKnobs('end', flexChildKnobs)}>
            <Button>OK</Button>
        </FlexView>
    </FlexView>
);

const hAlign = (prefix?: string) =>
    select(
        `${prefix ? prefix + ': ' : ''}Horizontal align`,
        [Alignment.center, Alignment.top, Alignment.bottom],
        Alignment.center,
    );
const vAlign = (prefix?: string) =>
    select(
        `${prefix ? prefix + ': ' : ''}Vertical align`,
        [Alignment.center, Alignment.left, Alignment.right],
        Alignment.center,
    );

export const HorizontalFlex = () => (
    <FlexView
        orientation={Orientation.horizontal}
        style={{ height: `${number('height (px)', 300)}px`, border: '1px solid red' }}
    >
        <Button>Default</Button>
        <FlexView hAlign={Alignment.top}>
            <Button>Top</Button>
        </FlexView>
        <FlexView
            fillSpace={boolean('Center button: fill space', true)}
            hAlign={hAlign('Center button')}
            vAlign={vAlign('Center button')}
        >
            <Button>Center button</Button>
        </FlexView>
        <FlexView hAlign={Alignment.bottom}>
            <Button>Bottom</Button>
        </FlexView>
    </FlexView>
);

export const VerticalFlex = () => (
    <>
        <FlexView
            orientation={Orientation.vertical}
            style={{ height: `${number('height (px)', 300)}px`, border: '1px solid red' }}
        >
            <Button>Default</Button>
            <FlexView vAlign={Alignment.left}>
                <Button>Left</Button>
            </FlexView>
            <FlexView
                fillSpace={boolean('Center button: fill space', true)}
                hAlign={hAlign('Center button')}
                vAlign={vAlign('Center button')}
            >
                <Button>Center button</Button>
            </FlexView>
            <FlexView vAlign={Alignment.right}>
                <Button>Right</Button>
            </FlexView>
        </FlexView>
    </>
);

export const WrapFlex = () => (
    <FlexView
        orientation={Orientation.horizontal}
        wrap={boolean('wrap', true)}
        style={{ width: `${number('width (px)', 150)}px`, border: '1px solid red' }}
    >
        <FlexView fillSpace orientation={Orientation.vertical}>
            <Button>Button</Button>
        </FlexView>
        <Button>Button</Button>
        <Button>Button</Button>
    </FlexView>
);

export const NoShrinkFlex = () => (
    <FlexView
        orientation={Orientation.horizontal}
        style={{ width: `${number('width (px)', 150)}px`, border: '1px solid red' }}
    >
        <Button>Button</Button>
        <FlexView noShrink={boolean('no shrink', true)}>{text('Center text', 'Some long text')}</FlexView>
        <Button>Button</Button>
    </FlexView>
);

export const Align = () => (
    <FlexView orientation={Orientation.horizontal} vAlign={vAlign()} hAlign={hAlign()}>
        <Button style={{ height: 200 }}>Button</Button>
        <FlexView style={{ height: 'fit-content' }}>Some text</FlexView>
    </FlexView>
);
