/* eslint-disable vue/one-component-per-file */
import { defineComponent, ref } from 'vue';
import { Text, Button } from '@lumx/vue';
import { withCombinations } from '@lumx/vue/stories/decorators/withCombinations';
import { withChromaticForceScreenSize } from '@lumx/vue/stories/decorators/withChromaticForceScreenSize';
import { setup } from '@lumx/core/js/components/Popover/Stories';

import { Popover } from '.';

/**
 * Story render component for Popover.
 *
 * Defined as a standalone component so that:
 * - The anchor template ref is created inside a proper Vue setup context.
 * - Storybook can pass args as reactive props (avoiding stale closure captures).
 */
const PopoverStory = defineComponent(
    (_props: any, { attrs }: any) => {
        const anchorRef = ref<HTMLElement>();
        return () => {
            const { anchorText, anchorClassName, popoverClassName, textColor, fitAnchorWidth, ...props } = attrs;
            return (
                <>
                    <Button ref={anchorRef} size="s" emphasis="medium" class={anchorClassName}>
                        {anchorText}
                    </Button>
                    <Popover
                        anchorRef={anchorRef}
                        class={popoverClassName}
                        fitToAnchorWidth={fitAnchorWidth}
                        {...props}
                    >
                        {fitAnchorWidth != null ? (
                            <>Popover {fitAnchorWidth}</>
                        ) : (
                            <Text as="p" color={textColor} class="lumx-spacing-padding-big">
                                Popover
                            </Text>
                        )}
                    </Popover>
                </>
            );
        };
    },
    { name: 'PopoverStory', inheritAttrs: false },
);

const { meta, ...stories } = setup({
    component: Popover,
    decorators: { withCombinations, withChromaticForceScreenSize },
    render: (args: any) => () => <PopoverStory {...args} />,
});

export default {
    title: 'LumX components/popover/Popover',
    ...meta,
};

export const Simple = { ...stories.Simple };
export const DarkTheme = { ...stories.DarkTheme };
export const WithoutPortal = { ...stories.WithoutPortal };
export const Placements = { ...stories.Placements };
export const FitToAnchorWidth = { ...stories.FitToAnchorWidth };
