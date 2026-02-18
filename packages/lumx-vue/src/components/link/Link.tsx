import { computed, defineComponent, useAttrs, useSlots } from 'vue';

import {
    Link as LinkUI,
    type LinkProps as UIProps,
    CLASSNAME,
    COMPONENT_NAME,
    DEFAULT_PROPS,
} from '@lumx/core/js/components/Link';

import { useTheme } from '../../composables/useTheme';
import { useDisableStateProps } from '../../composables/useDisableStateProps';
import { keysOf, VueToJSXProps } from '../../utils/VueToJSX';
import { JSXElement } from '@lumx/core/js/types';

export type LinkProps = VueToJSXProps<UIProps, 'label'>;

export const emitSchema = {
    click: (event: Event) => event instanceof Event,
};

export { CLASSNAME, COMPONENT_NAME, DEFAULT_PROPS };

/**
 * Link component.
 *
 * @param  props Component props.
 * @return Vue element.
 */
const Link = defineComponent(
    (props: LinkProps, { emit }) => {
        const attrs = useAttrs();
        const slots = useSlots();
        const defaultTheme = useTheme();
        const { class: className, ...restOfProps } = props;

        const { isAnyDisabled, disabledStateProps, otherProps } = useDisableStateProps(
            computed(() => ({ ...restOfProps, ...attrs })),
        );

        const handleClick = (event: any) => {
            if (isAnyDisabled.value) {
                return;
            }

            // IMPORTANT: Prevent double event emission when using JSX syntax.
            // Vue's JSX transform treats props starting with 'on' (e.g., onClick) as both:
            // 1. A prop passed to the component
            // 2. An automatic event listener for matching emitted events
            // Without stopImmediatePropagation, the 'click' event would be emitted twice:
            // - Once when the core component calls the onClick prop
            // - Again when Vue's event system catches the emitted 'click' event
            event?.stopImmediatePropagation?.();
            emit('click', event);
        };

        return () => {
            const slotContent = slots.default?.();
            const labelContent = slotContent || (otherProps.value as any).label;

            return (
                <LinkUI
                    {...otherProps.value}
                    {...disabledStateProps.value}
                    {...{ onClick: handleClick }}
                    className={className}
                    theme={props.theme || defaultTheme.value}
                    isDisabled={isAnyDisabled.value}
                    label={labelContent as JSXElement}
                />
            );
        };
    },
    {
        name: 'LumxLink',
        inheritAttrs: false,
        // Redefine properties so that they come in as `props` on the `defineComponent` function
        props: keysOf<LinkProps>()(
            'as',
            'class',
            'color',
            'colorVariant',
            'disabled',
            'href',
            'isDisabled',
            'leftIcon',
            'rightIcon',
            'target',
            'theme',
            'typography',
            'aria-disabled',
        ),
        emits: emitSchema,
        // Enable compatibility with @vue/compat for event listeners
        compatConfig: {
            MODE: 3, // Use Vue 3 behavior for this component
        },
    } as any,
);

export default Link;
