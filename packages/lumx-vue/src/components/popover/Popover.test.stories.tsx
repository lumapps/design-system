/* eslint-disable vue/one-component-per-file */
import { defineComponent, ref } from 'vue';
import { Text, IconButton, FlexBox, Message } from '@lumx/vue';
import { Emphasis } from '@lumx/core/js/constants';
import { mdiBell } from '@lumx/icons';
import { CLASSNAME } from '@lumx/core/js/components/Popover';
import { Placement } from '@lumx/core/js/components/Popover/constants';
import { expect, screen, waitFor } from 'storybook/test';

import { Popover } from '.';

export default {
    title: 'LumX components/popover/Popover/Tests',
    parameters: { chromatic: { disable: true } },
    tags: ['!snapshot'],
};

/**
 * Testing update of the popover on anchor and popover resize and move
 */
export const TestUpdatingChildrenAndMovingAnchor = {
    render() {
        const anchorRef = ref<HTMLElement>();
        const isOpen = ref(false);
        const text = ref('Initial large span of text');
        const anchorSize = ref<string>('m');

        const toggleOpen = () => {
            isOpen.value = !isOpen.value;
            if (isOpen.value) {
                setTimeout(() => {
                    text.value = 'Text';
                    anchorSize.value = 's';
                }, 1000);
            } else {
                text.value = 'Initial large span of text';
                anchorSize.value = 'm';
            }
        };

        return (
            <FlexBox orientation="vertical" gap="huge">
                <Message kind="info">Test popover text resize (after 1sec) and anchor resize (after 1sec)</Message>
                <FlexBox orientation="horizontal" verticalAlign="center">
                    <IconButton
                        label="Notifications"
                        class="lumx-spacing-margin-right-huge"
                        ref={anchorRef}
                        emphasis={Emphasis.low}
                        icon={mdiBell}
                        size={anchorSize.value as any}
                        onClick={toggleOpen}
                    />
                    <Popover
                        closeOnClickAway
                        closeOnEscape
                        isOpen={isOpen.value}
                        anchorRef={anchorRef}
                        placement={Placement.BOTTOM_END}
                        onClose={toggleOpen}
                        fitWithinViewportHeight
                        hasArrow
                    >
                        <Text as="p" class="lumx-spacing-padding-huge">
                            {text.value}
                        </Text>
                    </Popover>
                </FlexBox>
            </FlexBox>
        );
    },
};

const CloseModeHideStory = defineComponent(
    () => {
        const anchorRef = ref<HTMLElement>();
        const isOpen = ref(false);
        const toggleOpen = () => {
            isOpen.value = !isOpen.value;
        };

        return () => (
            <>
                <IconButton
                    label="Toggle popover"
                    ref={anchorRef}
                    emphasis={Emphasis.low}
                    icon={mdiBell}
                    onClick={toggleOpen}
                />
                <Popover
                    closeMode="hide"
                    isOpen={isOpen.value}
                    anchorRef={anchorRef}
                    placement={Placement.BOTTOM}
                    onClose={toggleOpen}
                    closeOnEscape
                >
                    <Text as="p" class="lumx-spacing-padding-big">
                        Popover content
                    </Text>
                </Popover>
            </>
        );
    },
    { name: 'CloseModeHideStory' },
);

/** Test: closeMode="hide" keeps the popover in the DOM but hidden when closed */
export const TestCloseModeHide = {
    render: () => () => <CloseModeHideStory />,
    async play({ userEvent }: any) {
        const popover = document.querySelector(`.${CLASSNAME}`) as HTMLElement;

        // Popover should be in the DOM but hidden
        expect(popover).toBeInTheDocument();
        expect(popover).toHaveClass(`${CLASSNAME}--is-hidden`);

        // Click to open
        const trigger = screen.getByRole('button', { name: 'Toggle popover' });
        await userEvent.click(trigger);

        // Popover should be visible (no is-hidden class)
        await waitFor(() => expect(popover).not.toHaveClass(`${CLASSNAME}--is-hidden`));

        // Click to close
        await userEvent.click(trigger);

        // Popover should still be in the DOM but hidden again
        await waitFor(() => expect(popover).toHaveClass(`${CLASSNAME}--is-hidden`));
    },
};

const CloseModeUnmountStory = defineComponent(
    () => {
        const anchorRef = ref<HTMLElement>();
        const isOpen = ref(false);
        const toggleOpen = () => {
            isOpen.value = !isOpen.value;
        };

        return () => (
            <>
                <IconButton
                    label="Toggle popover"
                    ref={anchorRef}
                    emphasis={Emphasis.low}
                    icon={mdiBell}
                    onClick={toggleOpen}
                />
                <Popover
                    closeMode="unmount"
                    isOpen={isOpen.value}
                    anchorRef={anchorRef}
                    placement={Placement.BOTTOM}
                    onClose={toggleOpen}
                    closeOnEscape
                >
                    <Text as="p" class="lumx-spacing-padding-big">
                        Popover content
                    </Text>
                </Popover>
            </>
        );
    },
    { name: 'CloseModeUnmountStory' },
);

/** Test: closeMode="unmount" removes the popover from the DOM when closed (default) */
export const TestCloseModeUnmount = {
    render: () => () => <CloseModeUnmountStory />,
    async play({ userEvent }: any) {
        // Popover should not be in the DOM when closed
        expect(document.querySelector(`.${CLASSNAME}`)).not.toBeInTheDocument();

        // Click to open
        const trigger = screen.getByRole('button', { name: 'Toggle popover' });
        await userEvent.click(trigger);

        // Popover should be in the DOM
        await waitFor(() => expect(document.querySelector(`.${CLASSNAME}`)).toBeInTheDocument());

        // Click to close
        await userEvent.click(trigger);

        // Popover should be removed from the DOM
        await waitFor(() => expect(document.querySelector(`.${CLASSNAME}`)).not.toBeInTheDocument());
    },
};
