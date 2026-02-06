import isEmpty from 'lodash/isEmpty';
import { defineComponent, useAttrs, computed } from 'vue';

import { Button as ButtonUI, ButtonProps as UIProps } from '@lumx/core/js/components/Button/Button';

import { useTheme } from '../../composables/useTheme';
import { useDisableStateProps } from '../../composables/useDisableStateProps';
import { keysOf, VueToJSXProps } from '../../utils/VueToJSX';
import { ResetTheme } from '../../utils/ResetTheme';
import Icon from '../icon/Icon.vue';
import { ButtonContent } from './ButtonContent';

export type ButtonProps = VueToJSXProps<UIProps>;

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
        const attrs = useAttrs();
        const defaultTheme = useTheme();

        const { isAnyDisabled, disabledStateProps } = useDisableStateProps(computed(() => ({ ...props, ...attrs })));

        const hasLeftIcon = computed(() => !isEmpty(props.leftIcon));
        const hasRightIcon = computed(() => !isEmpty(props.rightIcon));

        return () => (
            <ButtonUI
                {...props}
                {...attrs}
                {...disabledStateProps.value}
                className={props.class}
                theme={props.theme || attrs.theme || defaultTheme}
                aria-disabled={isAnyDisabled.value}
                onClick={(event: MouseEvent) => emit('click', event)}
            >
                {hasLeftIcon.value && (
                    <ResetTheme>
                        <Icon icon={props.leftIcon} />
                    </ResetTheme>
                )}
                <ButtonContent content={slots.default?.()} />
                {hasRightIcon.value && (
                    <ResetTheme>
                        <Icon icon={props.rightIcon} />
                    </ResetTheme>
                )}
            </ButtonUI>
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
            'isDisabled',
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
