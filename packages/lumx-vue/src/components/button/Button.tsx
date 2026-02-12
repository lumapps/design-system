import isEmpty from 'lodash/isEmpty';
import { computed, defineComponent, useAttrs, useSlots } from 'vue';

import {
    Button as ButtonUI,
    type ButtonProps as UIProps,
    CLASSNAME,
    COMPONENT_NAME,
    DEFAULT_PROPS,
} from '@lumx/core/js/components/Button/Button';

import { useTheme } from '../../composables/useTheme';
import { useDisableStateProps } from '../../composables/useDisableStateProps';
import { keysOf, VueToJSXProps } from '../../utils/VueToJSX';
import { ResetTheme } from '../../utils/ResetTheme';
import { Icon } from '../icon';
import Text from '../text/Text';
import { JSXElement } from '@lumx/core/js/types';

export type ButtonProps = VueToJSXProps<UIProps>;

export const emitSchema = {
    click: (event: MouseEvent) => event instanceof MouseEvent,
};

export { CLASSNAME, COMPONENT_NAME, DEFAULT_PROPS };

/**
 * Button component.
 *
 * @param  props Component props.
 * @return Vue element.
 */
const Button = defineComponent(
    (props: ButtonProps, { emit }) => {
        const slots = useSlots();
        const attrs = useAttrs();
        const defaultTheme = useTheme();

        const { isAnyDisabled, disabledStateProps, otherProps } = useDisableStateProps(
            computed(() => ({ ...props, ...attrs })),
        );

        const handleClick = (event: MouseEvent) => {
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
            event.stopImmediatePropagation();
            emit('click', event);
        };

        /**
         * Render button content.
         * Prevents unnecessary wrapping:
         * - If the child is a single <Text> component, render it directly.
         * - Otherwise, wrap the content in a <span> for correct layout.
         */
        const renderContent = () => {
            const children = slots.default?.();
            if (!children || children.length === 0) return null;

            // If single Text component, render directly
            if (children.length === 1 && children[0].type === Text) {
                return children[0];
            }

            // Otherwise wrap in span
            return <span>{children}</span>;
        };

        return () => {
            const children = (
                <>
                    {props.leftIcon && !isEmpty(props.leftIcon) && (
                        <ResetTheme>
                            <Icon icon={props.leftIcon} />
                        </ResetTheme>
                    )}
                    {renderContent()}
                    {props.rightIcon && !isEmpty(props.rightIcon) && (
                        <ResetTheme>
                            <Icon icon={props.rightIcon} />
                        </ResetTheme>
                    )}
                </>
            );

            return (
                <ButtonUI
                    {...otherProps.value}
                    {...disabledStateProps.value}
                    className={props.class}
                    theme={props.theme || defaultTheme.value}
                    onClick={handleClick as any}
                    children={children as JSXElement}
                />
            );
        };
    },
    {
        name: 'LumxButton',
        inheritAttrs: false,
        // Redefine properties so that they come in as `props` on the `defineComponent` function
        props: keysOf<ButtonProps>()(
            'leftIcon',
            'rightIcon',
            'color',
            'emphasis',
            'hasBackground',
            'href',
            'isDisabled',
            'isSelected',
            'name',
            'size',
            'theme',
            'class',
            'aria-expanded',
            'aria-disabled',
            'aria-haspopup',
            'aria-label',
            'aria-pressed',
            'disabled',
            'fullWidth',
            'isActive',
            'isFocused',
            'isHovered',
            'linkAs',
            'target',
            'type',
        ),
        emits: emitSchema,
    },
);

export default Button;
