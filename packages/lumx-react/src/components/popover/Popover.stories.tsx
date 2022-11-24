import React, { RefObject, useEffect, useRef, useState } from 'react';

import { mdiAccount, mdiBell } from '@lumx/icons';
import {
    Alignment,
    Chip,
    Button,
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

export const Positions = ({ theme }: any) => {
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
                        <Chip ref={ref} theme={theme} size={Size.s}>
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

export const Auto = ({ theme }: any) => {
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

    const anchorRef = useRef(null);

    return (
        <div style={container}>
            <div>
                <Chip ref={anchorRef} theme={theme} size={Size.s}>
                    Anchor
                </Chip>
            </div>
            <Popover theme={theme} anchorRef={anchorRef} placement={Placement.AUTO} isOpen>
                <div style={demoPopperStyle}>Popover</div>
            </Popover>
        </div>
    );
};

export const Top = ({ theme }: any) => {
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

    const anchorRef = useRef(null);

    return (
        <div style={container}>
            <div>
                <Chip ref={anchorRef} theme={theme} size={Size.s}>
                    Anchor
                </Chip>
            </div>
            <Popover theme={theme} anchorRef={anchorRef} placement={Placement.TOP} isOpen>
                <div style={demoPopperStyle}>Popover</div>
            </Popover>
        </div>
    );
};

export const WithUpdatingChildren = ({ theme }: any) => {
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

export const WithScrollingPopover = ({ theme }: any) => {
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

export const WithoutPortal = ({ theme }: any) => {
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
                        <Chip ref={ref} theme={theme} size={Size.s}>
                            {startCase(placementVariant).toUpperCase()}
                        </Chip>

                        <Popover
                            isOpen
                            theme={theme}
                            anchorRef={ref}
                            placement={placementVariant}
                            elevation={elevation}
                            hasArrow={hasArrow}
                            usePortal={false}
                        >
                            <div className="lumx-spacing-margin-huge">Popover</div>
                        </Popover>
                    </FlexBox>
                );
            })}
        </FlexBox>
    );
};

export const NestedWithoutPortal = () => {
    const boundaryRef = React.useRef(document.querySelector('body'));

    const Entry = ({ children, placement = Placement.RIGHT_START }: any) => {
        const rootButtonRef = React.useRef(null);
        const [rootOpen, setRootOpen] = React.useState(false);

        return (
            <>
                <li ref={rootButtonRef}>
                    <Button onClick={() => setRootOpen(!rootOpen)}>Click</Button>
                </li>
                {children && (
                    <Popover
                        boundaryRef={boundaryRef}
                        fitWithinViewportHeight
                        //offset={{ along: -16 }}
                        placement={placement}
                        isOpen={rootOpen}
                        anchorRef={rootButtonRef}
                        usePortal={false}
                    >
                        <div className="lumx-spacing-margin-huge" style={{ overflowY: 'auto' }}>
                            <List style={{ minWidth: '150px' }}>{children}</List>
                        </div>
                    </Popover>
                )}
            </>
        );
    };

    return (
        <div style={{ height: '100vh', width: '50px' }}>
            <List>
                <Entry placement={Placement.BOTTOM_START}>
                    <Entry />
                    <Entry />
                    <Entry>
                        <Entry />
                        <Entry />
                        <Entry>
                            <Entry>
                                <Entry />
                            </Entry>
                        </Entry>
                    </Entry>
                </Entry>
            </List>
        </div>
    );
};

export const FitToAnchorWidth = ({ theme }: any) => {
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
                <Chip ref={maxWidthAnchorRef} theme={theme} size={Size.s}>
                    Anchor
                </Chip>
            </div>
            <Popover theme={theme} anchorRef={maxWidthAnchorRef} fitToAnchorWidth="maxWidth" isOpen placement="top">
                <div style={demoPopperStyle}>Popover maxWidth</div>
            </Popover>
            <div>
                <Chip ref={widthSmallAnchorRef} theme={theme} size={Size.s}>
                    Anchor
                </Chip>
            </div>
            <Popover theme={theme} anchorRef={widthSmallAnchorRef} fitToAnchorWidth="width" isOpen placement="top">
                <div style={demoPopperStyle}>Popover width small anchor</div>
            </Popover>
            <div>
                <Chip ref={widthLargeAnchorRef} theme={theme} size={Size.s}>
                    VeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryLargeAnchor
                </Chip>
            </div>
            <Popover theme={theme} anchorRef={widthLargeAnchorRef} fitToAnchorWidth="width" isOpen placement="top">
                <div style={demoPopperStyle}>Popover width large anchor</div>
            </Popover>
            <div>
                <Chip ref={minWidthAnchorRef} theme={theme} size={Size.s}>
                    VeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryLargeAnchor
                </Chip>
            </div>
            <Popover theme={theme} anchorRef={minWidthAnchorRef} fitToAnchorWidth="minWidth" isOpen placement="top">
                <div style={demoPopperStyle}>Popover minWidth</div>
            </Popover>
            <div>
                <Chip ref={defaultWidthAnchorRef} theme={theme} size={Size.s}>
                    VeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryLargeAnchor
                </Chip>
            </div>
            <Popover theme={theme} anchorRef={defaultWidthAnchorRef} isOpen placement="top">
                <div style={demoPopperStyle}>Popover default</div>
            </Popover>
        </div>
    );
};
