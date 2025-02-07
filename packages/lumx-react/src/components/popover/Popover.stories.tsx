/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useRef, useState } from 'react';

import { mdiAccount, mdiBell } from '@lumx/icons';
import {
    Chip,
    Emphasis,
    Text,
    Icon,
    IconButton,
    List,
    ListItem,
    Placement,
    Popover,
    Size,
    Elevation,
    Message,
    FlexBox,
    IconButtonProps,
} from '@lumx/react';
import range from 'lodash/range';
import { withCombinations } from '@lumx/react/stories/decorators/withCombinations';
import { getSelectArgType } from '@lumx/react/stories/controls/selectArgType';
import { withChromaticForceScreenSize } from '@lumx/react/stories/decorators/withChromaticForceScreenSize';
import { FitAnchorWidth } from '@lumx/react/components/popover/constants';
import { withUndefined } from '@lumx/react/stories/controls/withUndefined';

export default {
    title: 'LumX components/popover/Popover',
    component: Popover,
    args: Popover.defaultProps,
    argTypes: {
        isOpen: { control: 'boolean' },
        hasArrow: { control: 'boolean' },
        placement: getSelectArgType(Placement),
        elevation: getSelectArgType<Elevation>([1, 2, 3, 4, 5]),
        ref: { control: false },
        parentElement: { control: false },
        focusElement: { control: false },
        anchorRef: { control: false },
        boundaryRef: { control: false },
        children: { control: false },
    },
    decorators: [
        // Force minimum chromatic screen size to make sure the dialog appears in view.
        withChromaticForceScreenSize(),
    ],
};

/**
 * Simple
 */
export const Simple = {
    args: {
        children: (
            <Text as="p" className="lumx-spacing-padding-big">
                Popover
            </Text>
        ),
    },
    render(props: any) {
        const anchorRef = React.useRef(null);
        return (
            <>
                <Chip ref={anchorRef} size="s" className="lumx-spacing-margin-big">
                    Anchor
                </Chip>
                <Popover anchorRef={anchorRef} isOpen {...props} />
            </>
        );
    },
};

/**
 * Dark theme
 */
export const DarkTheme = {
    ...Simple,
    args: {
        theme: 'dark',
        children: (
            <Text as="p" color="light" className="lumx-spacing-padding-big">
                Popover
            </Text>
        ),
        hasArrow: true,
    },
};

/**
 * Popover not using React.createPortal
 */
export const WithoutPortal = { ...Simple, args: { ...Simple.args, usePortal: false } };

/**
 * All base placements
 */
export const Placements = {
    ...Simple,
    argTypes: {
        placement: { control: false },
    },
    decorators: [
        withCombinations({
            cellStyle: {
                padding: 80,
            },
            combinations: {
                cols: {
                    key: 'placement',
                    options: [Placement.TOP, Placement.RIGHT, Placement.BOTTOM, Placement.LEFT],
                },
            },
        }),
    ],
};

/**
 * Demo all fitAnchorWidth configurations
 */
export const FitToAnchorWidth = {
    render({ anchorText, fitAnchorWidth }: any) {
        const anchorRef = useRef(null);
        return (
            <>
                <Chip className="lumx-spacing-margin-huge" ref={anchorRef} size="s">
                    {anchorText}
                </Chip>
                <Popover
                    isOpen
                    className="lumx-spacing-padding"
                    placement="top"
                    anchorRef={anchorRef}
                    fitToAnchorWidth={fitAnchorWidth}
                >
                    Popover {fitAnchorWidth}
                </Popover>
            </>
        );
    },
    decorators: [
        withCombinations({
            combinations: {
                cols: {
                    'Small Anchor': { anchorText: 'Small' },
                    'Large Anchor': { anchorText: 'Very very very very large anchor' },
                },
                rows: { key: 'fitAnchorWidth', options: withUndefined(Object.values(FitAnchorWidth)) },
            },
            cellStyle: { padding: 16 },
        }),
    ],
};

/**
 * Testing update of the popover on anchor and popover resize and move
 */
export const TestUpdatingChildrenAndMovingAnchor = {
    render() {
        const anchorRef = useRef(null);
        const [isOpen, setIsOpen] = useState(false);

        const toggleOpen = () => setIsOpen(!isOpen);

        const [text, setText] = useState('Initial large span of text');
        const [anchorSize, setAnchorSize] = useState<IconButtonProps['size']>('m');
        useEffect(() => {
            if (isOpen) {
                const timers = [
                    // Update popover size
                    setTimeout(() => setText('Text'), 1000),
                    // Update anchor size
                    setTimeout(() => setAnchorSize('s'), 1000),
                ];
                return () => timers.forEach(clearTimeout);
            }
            setText('Initial large span of text');
            setAnchorSize('m');
            return undefined;
        }, [isOpen]);

        return (
            <FlexBox orientation="vertical" gap="huge">
                <Message kind="info">Test popover text resize (after 1sec) and anchor resize (after 1.5sec)</Message>
                <FlexBox orientation="horizontal" vAlign="center">
                    <IconButton
                        label="Notifications"
                        className="lumx-spacing-margin-right-huge"
                        ref={anchorRef}
                        emphasis={Emphasis.low}
                        icon={mdiBell}
                        size={anchorSize}
                        onClick={toggleOpen}
                    />
                    <Popover
                        closeOnClickAway
                        closeOnEscape
                        isOpen={isOpen}
                        anchorRef={anchorRef}
                        placement={Placement.BOTTOM_END}
                        onClose={toggleOpen}
                        fitWithinViewportHeight
                        hasArrow
                    >
                        <Text as="p" className="lumx-spacing-padding-huge">
                            {text}
                        </Text>
                    </Popover>
                </FlexBox>
            </FlexBox>
        );
    },
    parameters: { chromatic: { disable: true } },
};

/**
 * Testing popover with scroll inside
 */
export const TestScrollingPopover = {
    render() {
        const anchorRef = useRef(null);
        const [isOpen, setIsOpen] = useState(false);

        const toggleOpen = () => setIsOpen(!isOpen);

        return (
            <div style={{ float: 'right' }} className="lumx-spacing-margin-right-huge">
                <IconButton
                    label="Notifications"
                    className="lumx-spacing-margin-right-huge"
                    ref={anchorRef}
                    emphasis={Emphasis.low}
                    icon={mdiBell}
                    size={Size.m}
                    onClick={toggleOpen}
                />
                <Popover
                    closeOnClickAway
                    closeOnEscape
                    isOpen={isOpen}
                    anchorRef={anchorRef}
                    placement={Placement.BOTTOM_END}
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
    },
    parameters: { chromatic: { disable: true } },
};
