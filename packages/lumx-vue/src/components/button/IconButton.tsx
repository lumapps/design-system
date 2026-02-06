import { computed, defineComponent, useAttrs } from 'vue';

import {
    IconButton as IconButtonUI,
    type IconButtonProps as UIProps,
} from '@lumx/core/js/components/Button/IconButton';

import { useTheme } from '../../composables/useTheme';
import { useDisableStateProps } from '../../composables/useDisableStateProps';
import { keysOf, VueToJSXProps } from '../../utils/VueToJSX';

export type IconButtonProps = VueToJSXProps<UIProps, 'onClick'>;

export const emitSchema = {
    click: (event: MouseEvent) => event instanceof MouseEvent,
};

/**
 * IconButton component.
 *
 * @param  props Component props.
 * @return Vue element.
 */
const IconButton = defineComponent(
    (props: IconButtonProps, { emit }) => {
        const attrs = useAttrs();
        const defaultTheme = useTheme();

        const { isAnyDisabled, disabledStateProps, otherProps } = useDisableStateProps(
            computed(() => ({ ...props, ...attrs })),
        );

        const handleClick = (event: MouseEvent) => {
            if (isAnyDisabled.value) {
                return;
            }

            event.stopImmediatePropagation();
            emit('click', event);
        };

        return () => (
            <IconButtonUI
                {...otherProps.value}
                {...disabledStateProps.value}
                className={props.class}
                theme={props.theme || defaultTheme}
                title={props.label}
                onClick={handleClick as any}
            />
        );
    },
    {
        name: 'IconButton',
        inheritAttrs: false,
        // Redefine properties so that they come in as `props` on the `defineComponent` function
        props: keysOf<IconButtonProps>()(
            'icon',
            'image',
            'label',
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
            'isDisabled',
            'linkAs',
            'target',
            'type',
            'title',
        ),
        emits: emitSchema,
    },
);

export default IconButton;
