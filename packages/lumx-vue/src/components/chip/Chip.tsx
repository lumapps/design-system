import { computed, defineComponent, useAttrs, useSlots } from 'vue';

import {
    Chip as ChipUI,
    type ChipProps as UIProps,
    type ChipPropsToOverride,
    CLASSNAME,
    COMPONENT_NAME,
    DEFAULT_PROPS,
} from '@lumx/core/js/components/Chip';
import { JSXElement } from '@lumx/core/js/types';

import { useTheme } from '../../composables/useTheme';
import { useDisableStateProps } from '../../composables/useDisableStateProps';
import { useHasEventListener } from '../../composables/useHasEventListener';
import { keysOf, VueToJSXProps } from '../../utils/VueToJSX';

export type ChipProps = VueToJSXProps<UIProps, ChipPropsToOverride>;

export const emitSchema = {
    click: (event: MouseEvent) => event instanceof MouseEvent,
    afterClick: (event: MouseEvent) => event instanceof MouseEvent,
    beforeClick: (event: MouseEvent) => event instanceof MouseEvent,
    keydown: (event: KeyboardEvent) => event instanceof KeyboardEvent,
};

export { CLASSNAME, COMPONENT_NAME, DEFAULT_PROPS };

/**
 * Chip component.
 *
 * @param  props Component props.
 * @return Vue element.
 */
const Chip = defineComponent(
    (props: ChipProps, { emit }) => {
        const slots = useSlots();
        const attrs = useAttrs();
        const defaultTheme = useTheme();

        const hasOnClick = useHasEventListener('onClick');
        const hasAfterClick = useHasEventListener('onAfterClick');
        const hasBeforeClick = useHasEventListener('onBeforeClick');

        const { isAnyDisabled, disabledStateProps, otherProps } = useDisableStateProps(
            computed(() => ({ ...props, ...attrs })),
        );

        const handleClick = (event: MouseEvent) => {
            if (isAnyDisabled.value) {
                return;
            }

            emit('click', event);
        };

        const handleAfterClick = (event: MouseEvent) => {
            if (isAnyDisabled.value) {
                return;
            }

            emit('afterClick', event);
            event?.stopPropagation();
        };

        const handleBeforeClick = (event: MouseEvent) => {
            if (isAnyDisabled.value) {
                return;
            }

            emit('beforeClick', event);
            event?.stopPropagation();
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (isAnyDisabled.value) {
                return;
            }

            emit('keydown', event);
        };

        return () => (
            <ChipUI
                {...otherProps.value}
                className={props.class}
                theme={props.theme || defaultTheme.value}
                handleClick={handleClick as any}
                handleAfterClick={handleAfterClick as any}
                handleBeforeClick={handleBeforeClick as any}
                handleKeyDown={handleKeyDown as any}
                hasOnClick={hasOnClick}
                hasAfterClick={hasAfterClick}
                hasBeforeClick={hasBeforeClick}
                isAnyDisabled={isAnyDisabled.value}
                disabledStateProps={disabledStateProps.value}
                before={(slots.before?.() as JSXElement) || undefined}
                after={(slots.after?.() as JSXElement) || undefined}
                children={(slots.default?.() as JSXElement) || undefined}
                keyDownProp="onKeydown"
                tabIndexProp="tabindex"
            />
        );
    },
    {
        name: 'LumxChip',
        inheritAttrs: false,
        props: keysOf<ChipProps>()(
            'color',
            'href',
            'isClickable',
            'isDisabled',
            'isHighlighted',
            'isSelected',
            'size',
            'theme',
            'class',
            'aria-disabled',
            'disabled',
        ),
        emits: emitSchema,
    },
);

export default Chip;
