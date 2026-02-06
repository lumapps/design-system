import isEmpty from 'lodash/isEmpty';
import { defineComponent, computed } from 'vue';

import { Button as ButtonUI, ButtonProps as UIProps } from '@lumx/core/js/components/Button/Button';

import { useTheme } from '../../composables/useTheme';
import { useDisableStateProps } from '../../composables/useDisableStateProps';
import { keysOf, VueToJSXProps } from '../../utils/VueToJSX';
import { ResetTheme } from '../../utils/ResetTheme';
import Icon from '../icon/Icon.vue';

export type ButtonProps = VueToJSXProps<UIProps, 'onClick'>;

export interface ButtonEmits {
    click: [event: MouseEvent];
}

const keysOfButton = keysOf<ButtonProps>();

/**
 * Button component.
 *
 * @param  props Component props.
 * @return Vue element.
 */
const Button = defineComponent(
    (props: ButtonProps, { slots, emit }) => {
        const defaultTheme = useTheme();

        const { isAnyDisabled, disabledStateProps } = useDisableStateProps(computed(() => props));

        const handleClick = (event: MouseEvent) => {
            emit('click', event);
        };

        return () => (
            <ButtonUI
                {...props}
                {...disabledStateProps.value}
                className={props.class}
                theme={props.theme || defaultTheme}
                aria-disabled={isAnyDisabled.value}
                onClick={handleClick}
                children={
                    <>
                        {!isEmpty(props.leftIcon) && props.leftIcon && (
                            <ResetTheme>
                                <Icon icon={props.leftIcon} />
                            </ResetTheme>
                        )}
                        <span>{slots.default?.()}</span>
                        {!isEmpty(props.rightIcon) && props.rightIcon && (
                            <ResetTheme>
                                <Icon icon={props.rightIcon} />
                            </ResetTheme>
                        )}
                    </>
                }
            />
        );
    },
    {
        inheritAttrs: false,
        // Redefine properties so that they come in as `props` on the `defineComponent` function
        props: keysOfButton(
            'class',
            'color',
            'emphasis',
            'fullWidth',
            'hasBackground',
            'href',
            'isActive',
            'isDisabled',
            'isFocused',
            'isHovered',
            'isSelected',
            'leftIcon',
            'linkAs',
            'name',
            'rightIcon',
            'size',
            'target',
            'theme',
            'type',
            'aria-disabled',
            'aria-expanded',
            'aria-haspopup',
            'aria-label',
            'aria-pressed',
        ),
        emits: ['click'],
    },
);

export default Button;
