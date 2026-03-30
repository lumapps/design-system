/* eslint-disable vue/one-component-per-file */
/* eslint-disable vue/require-prop-types */
import { defineComponent, ref, useAttrs } from 'vue';

import { ExpansionPanel, Text } from '@lumx/vue';
import { withNestedProps } from '@lumx/vue/stories/decorators/withNestedProps';
import { setup } from '@lumx/core/js/components/ExpansionPanel/Stories';

/** Stateful wrapper that manages isOpen per instance, enabling independent toggle per panel. */
const StatefulExpansionPanel = defineComponent(
    (props: { isOpen?: boolean; className?: string }, { slots }) => {
        const attrs = useAttrs();
        const isOpen = ref(props.isOpen);

        return () => (
            <ExpansionPanel
                {...attrs}
                class={props.className}
                isOpen={isOpen.value}
                onToggleOpen={(shouldOpen: boolean) => {
                    isOpen.value = shouldOpen;
                }}
            >
                {slots.default?.()}
            </ExpansionPanel>
        );
    },
    {
        name: 'StatefulExpansionPanel',
        inheritAttrs: false,
        props: ['isOpen', 'className'],
    },
);

const { meta, ...stories } = setup({
    component: ExpansionPanel,
    components: { Text, StatefulExpansionPanel },
    decorators: { withNestedProps },
});

export default {
    title: 'LumX components/expansion-panel/ExpansionPanel',
    ...meta,
};

export const Default = { ...stories.Default };
export const HasBackground = { ...stories.HasBackground };
export const HasHeaderDivider = { ...stories.HasHeaderDivider };
export const Nested = { ...stories.Nested };
export const HideChildren = { ...stories.HideChildren };
