import { defineComponent, computed, useAttrs } from 'vue';

import { IconButton as IconButtonUI, IconButtonProps as UIProps } from '@lumx/core/js/components/Button/IconButton';

import { useTheme } from '../../composables/useTheme';
import { useDisableStateProps } from '../../composables/useDisableStateProps';
import { keysOf, VueToJSXProps } from '../../utils/VueToJSX';

export type IconButtonProps = VueToJSXProps<UIProps, 'onClick'>;

export interface IconButtonEmits {
    click: [event: MouseEvent];
}

/**
 * IconButton component.
 *
 * @param  props Component props.
 * @return Vue element.
 */
const IconButton = defineComponent(
    (props: IconButtonProps, { emit }) => {
        const defaultTheme = useTheme();
        const attrs = useAttrs();

        const { isAnyDisabled, disabledStateProps } = useDisableStateProps(computed(() => ({ ...props, ...attrs })));

        const handleClick = (event: MouseEvent) => {
            event.stopImmediatePropagation();
            emit('click', event);
        };

        return () => {
            return (
                <IconButtonUI
                    {...attrs}
                    {...props}
                    {...disabledStateProps.value}
                    className={props.class}
                    theme={props.theme || defaultTheme}
                    aria-disabled={isAnyDisabled.value ? 'true' : undefined}
                    onClick={handleClick}
                />
            );
        };
    },
    {
        inheritAttrs: false,
        // Redefine properties so that they come in as `props` on the `defineComponent` function
        props: keysOf<IconButtonProps>()(
            'class',
            'color',
            'emphasis',
            'fullWidth',
            'hasBackground',
            'href',
            'icon',
            'image',
            'isActive',
            'isDisabled',
            'disabled',
            'isFocused',
            'isHovered',
            'isSelected',
            'label',
            'linkAs',
            'name',
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

export default IconButton;
