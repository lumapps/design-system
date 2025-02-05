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
} from '@lumx/react';
import range from 'lodash/range';
import { withCombinations } from '@lumx/react/stories/decorators/withCombinations';
import { getSelectArgType } from '@lumx/react/stories/controls/selectArgType';
import { withChromaticForceScreenSize } from '@lumx/react/stories/decorators/withChromaticForceScreenSize';

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

export const WithUpdatingChildren = () => {
    const anchorRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);

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
        return undefined;
    }, [isOpen]);

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
                <List>
                    <ListItem before={<Icon icon={mdiAccount} />} className="lumx-spacing-margin-right-huge">
                        <span>{text}</span>
                    </ListItem>
                </List>
            </Popover>
        </div>
    );
};

export const WithScrollingPopover = () => {
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

export const FitToAnchorWidth = () => {
    const demoPopperStyle = {
        alignItems: 'center',
        display: 'flex',
        height: 100,
        justifyContent: 'center',
        width: 200,
    };

    const container = {
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 150,
        marginTop: 150,
    } as const;

    const maxWidthAnchorRef = useRef(null);
    const widthSmallAnchorRef = useRef(null);
    const widthLargeAnchorRef = useRef(null);
    const minWidthAnchorRef = useRef(null);
    const defaultWidthAnchorRef = useRef(null);

    return (
        <div style={container}>
            <div>
                <Chip ref={maxWidthAnchorRef} size={Size.s}>
                    Anchor
                </Chip>
            </div>
            <Popover anchorRef={maxWidthAnchorRef} fitToAnchorWidth="maxWidth" isOpen placement="top">
                <div style={demoPopperStyle}>Popover maxWidth</div>
            </Popover>
            <div>
                <Chip ref={widthSmallAnchorRef} size={Size.s}>
                    Anchor
                </Chip>
            </div>
            <Popover anchorRef={widthSmallAnchorRef} fitToAnchorWidth="width" isOpen placement="top">
                <div style={demoPopperStyle}>Popover width small anchor</div>
            </Popover>
            <div>
                <Chip ref={widthLargeAnchorRef} size={Size.s}>
                    VeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryLargeAnchor
                </Chip>
            </div>
            <Popover anchorRef={widthLargeAnchorRef} fitToAnchorWidth="width" isOpen placement="top">
                <div style={demoPopperStyle}>Popover width large anchor</div>
            </Popover>
            <div>
                <Chip ref={minWidthAnchorRef} size={Size.s}>
                    VeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryLargeAnchor
                </Chip>
            </div>
            <Popover anchorRef={minWidthAnchorRef} fitToAnchorWidth="minWidth" isOpen placement="top">
                <div style={demoPopperStyle}>Popover minWidth</div>
            </Popover>
            <div>
                <Chip ref={defaultWidthAnchorRef} size={Size.s}>
                    VeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryLargeAnchor
                </Chip>
            </div>
            <Popover anchorRef={defaultWidthAnchorRef} isOpen placement="top">
                <div style={demoPopperStyle}>Popover default</div>
            </Popover>
        </div>
    );
};
