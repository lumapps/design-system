/* eslint-disable vue/one-component-per-file */
import { defineComponent, ref } from 'vue';
import { Button, Text, Tooltip } from '@lumx/vue';
import { useOverflowTooltipLabel } from '@lumx/vue/utils';
import { setup } from '@lumx/core/js/components/Tooltip/TestStories';
import { keysOf } from '../../utils/VueToJSX';

interface ToggleTooltipProps {
    getLabel: (isExpanded: boolean) => string;
    isFunction?: boolean;
}

const ToggleTooltip = defineComponent(
    (props: ToggleTooltipProps) => {
        const isExpanded = ref(false);
        return () => (
            <>
                <Tooltip
                    label={props.isFunction ? () => props.getLabel(isExpanded.value) : props.getLabel(isExpanded.value)}
                >
                    <Button
                        onClick={() => {
                            isExpanded.value = !isExpanded.value;
                        }}
                    >
                        Anchor
                    </Button>
                </Tooltip>
                <Button
                    onClick={() => {
                        isExpanded.value = false;
                    }}
                >
                    Collapse
                </Button>
            </>
        );
    },
    { name: 'ToggleTooltip', props: keysOf<ToggleTooltipProps>()('getLabel', ['isFunction', Boolean]) },
);

const OverflowTooltip = defineComponent(
    (props: { text: string }) => {
        const { labelRef, tooltipLabel } = useOverflowTooltipLabel();
        return () => (
            <Tooltip label={tooltipLabel}>
                <button type="button" style={{ maxWidth: '100%' }}>
                    <Text as="span" truncate ref={labelRef}>
                        {props.text}
                    </Text>
                </button>
            </Tooltip>
        );
    },
    { name: 'OverflowTooltip', props: keysOf<{ text: string }>()('text') },
);

const { meta, ...testStories } = setup({
    component: Tooltip,
    components: { Button, ToggleTooltip, OverflowTooltip },
});

export default {
    title: 'LumX components/tooltip/Tooltip/Tests',
    ...meta,
};

export const TestActivateOnHover = { ...testStories.TestActivateOnHover };
export const TestHoverAnchorThenTooltip = { ...testStories.TestHoverAnchorThenTooltip };
export const TestFocusVisibleAndEscape = { ...testStories.TestFocusVisibleAndEscape };
export const TestNoActivateOnClickFocus = { ...testStories.TestNoActivateOnClickFocus };
export const TestCloseModeHide = { ...testStories.TestCloseModeHide };
export const TestAriaDescribedByOnHover = { ...testStories.TestAriaDescribedByOnHover };
export const TestAriaDescribedByOnWrapperHover = { ...testStories.TestAriaDescribedByOnWrapperHover };
export const TestAriaLabelledByOnHover = { ...testStories.TestAriaLabelledByOnHover };
export const TestAriaLabelledByOnWrapperHover = { ...testStories.TestAriaLabelledByOnWrapperHover };
export const TestFunctionLabelFollowsKeyboardToggle = { ...testStories.TestFunctionLabelFollowsKeyboardToggle };
export const TestStringLabelBackAfterKeyboardToggle = { ...testStories.TestStringLabelBackAfterKeyboardToggle };
export const TestFunctionLabelBackAfterKeyboardToggle = { ...testStories.TestFunctionLabelBackAfterKeyboardToggle };
export const TestOverflowLabel = { ...testStories.TestOverflowLabel };
export const TestNoOverflowLabel = { ...testStories.TestNoOverflowLabel };
export const TestOverflowLabelHiddenMount = { ...testStories.TestOverflowLabelHiddenMount };
