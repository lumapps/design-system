import React, { RefObject, useEffect, useRef, useState } from 'react';

import { mdiAccount, mdiBell } from '@lumx/icons';
import {
    Alignment,
    Chip,
    Emphasis,
    FlexBox,
    Icon,
    IconButton,
    List,
    ListItem,
    Orientation,
    Placement,
    Popover,
    Size,
} from '@lumx/react';
import { boolean, select } from '@storybook/addon-knobs';
import range from 'lodash/range';
import startCase from 'lodash/startCase';

export default { title: 'LumX components/popover/Popover' };

const DEFAULT_PROPS = Popover.defaultProps as any;

export const positions = ({ theme }: any) => {
    const popovers: Array<[Placement, RefObject<any>]> = [
        [Placement.LEFT, useRef(null)],
        [Placement.TOP, useRef(null)],
        [Placement.BOTTOM, useRef(null)],
        [Placement.RIGHT, useRef(null)],
    ];
    const hasArrow = boolean('Has arrow', DEFAULT_PROPS.hasArrow as any);
    const elevation: any = select('Elevation', [5, 4, 3, 2, 1], DEFAULT_PROPS.elevation);
    const alignOptions = { middle: '', start: '-start', end: '-end' };
    const align = select('Placement variant', alignOptions, alignOptions.middle);

    return (
        <FlexBox style={{ padding: 80 }} orientation={Orientation.horizontal}>
            {popovers.map(([placement, ref]) => {
                const placementVariant = (placement + align) as any;
                return (
                    <FlexBox key={placement} fillSpace vAlign={Alignment.center} hAlign={Alignment.center}>
                        <Chip chipRef={ref} theme={theme} size={Size.s}>
                            {startCase(placementVariant).toUpperCase()}
                        </Chip>

                        <Popover
                            isOpen
                            theme={theme}
                            anchorRef={ref}
                            placement={placementVariant}
                            elevation={elevation}
                            hasArrow={hasArrow}
                        >
                            <div className="lumx-spacing-margin-huge">Popover</div>
                        </Popover>
                    </FlexBox>
                );
            })}
        </FlexBox>
    );
};

export const auto = ({ theme }: any) => {
    const demoPopperStyle = {
        alignItems: 'center',
        display: 'flex',
        height: 100,
        justifyContent: 'center',
        width: 200,
    };

    const container = {
        width: '200%',
        height: '2000px',
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center',
    };

    const anchorRef = React.useRef(null);

    return (
        <div style={container}>
            <div>
                <Chip chipRef={anchorRef} theme={theme} size={Size.s}>
                    Anchor
                </Chip>
            </div>
            <Popover theme={theme} anchorRef={anchorRef} placement={Placement.AUTO} isOpen>
                <div style={demoPopperStyle}>{'Popover'}</div>
            </Popover>
        </div>
    );
};

export const top = ({ theme }: any) => {
    const demoPopperStyle = {
        alignItems: 'center',
        display: 'flex',
        height: 100,
        justifyContent: 'center',
        width: 200,
    };

    const container = {
        width: '200%',
        height: '2000px',
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center',
    };

    const anchorRef = React.useRef(null);

    return (
        <div style={container}>
            <div>
                <Chip chipRef={anchorRef} theme={theme} size={Size.s}>
                    Anchor
                </Chip>
            </div>
            <Popover theme={theme} anchorRef={anchorRef} placement={Placement.TOP} isOpen>
                <div style={demoPopperStyle}>{'Popover'}</div>
            </Popover>
        </div>
    );
};

export const withUpdatingChildren = ({ theme }: any) => {
    const anchorRef = React.useRef(null);
    const [isOpen, setIsOpen] = React.useState(false);

    const toggleOpen = () => setIsOpen(!isOpen);

    const [text, setText] = useState('Long loading text with useless words');
    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => {
                setText('Text');
            }, 1000);
            return () => clearTimeout(timer);
        }
        setText('Long loading text with useless words');
    }, [isOpen]);

    return (
        <div style={{ float: 'right' }} className="lumx-spacing-margin-right-huge">
            <IconButton
                className="lumx-spacing-margin-right-huge"
                buttonRef={anchorRef}
                emphasis={Emphasis.low}
                icon={mdiBell}
                size={Size.m}
                onClick={toggleOpen}
            />
            <Popover
                closeOnClickAway
                closeOnEscape
                theme={theme}
                isOpen={isOpen}
                anchorRef={anchorRef}
                placement={Placement.BOTTOM_END}
                onClose={toggleOpen}
                fitWithinViewportHeight
            >
                <List>
                    <ListItem before={<Icon icon={mdiAccount} />} className="lumx-spacing-margin-right-huge">
                        <span>{text}</span>
                    </ListItem>
                </List>
            </Popover>
        </div>
    );
};

export const withScrollingPopover = ({ theme }: any) => {
    const anchorRef = React.useRef(null);
    const [isOpen, setIsOpen] = React.useState(false);

    const toggleOpen = () => setIsOpen(!isOpen);

    return (
        <div style={{ float: 'right' }} className="lumx-spacing-margin-right-huge">
            <IconButton
                className="lumx-spacing-margin-right-huge"
                buttonRef={anchorRef}
                emphasis={Emphasis.low}
                icon={mdiBell}
                size={Size.m}
                onClick={toggleOpen}
            />
            <Popover
                closeOnClickAway
                closeOnEscape
                theme={theme}
                isOpen={isOpen}
                anchorRef={anchorRef}
                placement={Placement.BOTTOM}
                onClose={toggleOpen}
                fitWithinViewportHeight
            >
                <List style={{ overflowY: 'auto' }}>
                    {range(100).map((n: number) => {
                        return (
                            <ListItem
                                key={`key-${n}`}
                                before={<Icon icon={mdiAccount} />}
                                className="lumx-spacing-margin-right-huge"
                            >
                                <span>{`List item ${n} and some text`}</span>
                            </ListItem>
                        );
                    })}
                </List>
            </Popover>
        </div>
    );
};
