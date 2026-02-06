import { defineComponent, VNode, PropType } from 'vue';

import Text from '../text/Text.vue';

/**
 * Functional component to handle button content.
 * It prevents unnecessary wrapping:
 * - If the child is a single <Text> component, it renders it directly.
 * - Otherwise, it wraps the content in a <span> to ensure correct layout within the button.
 */
export const ButtonContent = defineComponent({
    props: {
        content: {
            type: Array as PropType<VNode[]>,
            default: () => [],
        },
    },
    setup(props) {
        return () => {
            const children = props.content;
            if (!children || children.length === 0) return null;

            if (children.length === 1 && children[0].type === Text) {
                return children[0];
            }
            return <span>{children}</span>;
        };
    },
});
