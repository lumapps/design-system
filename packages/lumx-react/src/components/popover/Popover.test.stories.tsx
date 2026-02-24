import { useEffect, useRef, useState } from 'react';

import { mdiAccount, mdiBell } from '@lumx/icons';
import { Emphasis, Text, Icon, IconButton, List, ListItem, Size, Message, FlexBox, IconButtonProps } from '@lumx/react';
import range from 'lodash/range';

import { Popover, Placement } from '.';

export default {
    title: 'LumX components/popover/Popover/Tests',
    parameters: { chromatic: { disable: true } },
    tags: ['!snapshot'],
};

/**
 * Testing update of the popover on anchor and popover resize and move
 */
export const TestUpdatingChildrenAndMovingAnchor = () => {
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
};

/**
 * Testing popover with scroll inside
 */
export const TestScrollingPopover = () => {
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
};
