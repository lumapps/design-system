import { ref } from 'vue';
import { Text, IconButton, FlexBox, Message } from '@lumx/vue';
import { Emphasis } from '@lumx/core/js/constants';
import { mdiBell } from '@lumx/icons';
import { Placement } from '@lumx/core/js/components/Popover/constants';

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
