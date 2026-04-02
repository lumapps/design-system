import { computed, defineComponent, ref } from 'vue';

import { useClassName } from '../../composables/useClassName';

import {
    ComboboxOptionMoreInfo as UI,
    type ComboboxOptionMoreInfoProps as UIProps,
    type ComboboxOptionMoreInfoPropsToOverride,
    COMPONENT_NAME,
    CLASSNAME,
} from '@lumx/core/js/components/Combobox/ComboboxOptionMoreInfo';
import type { JSXElement } from '@lumx/core/js/types';

import { keysOf, VueToJSXProps } from '../../utils/VueToJSX';
import { IconButton } from '../button';
import { Popover } from '../popover';
import { useComboboxOptionContext } from './context/ComboboxOptionContext';
import { useComboboxEvent } from './context/useComboboxEvent';

export type ComboboxOptionMoreInfoProps = VueToJSXProps<
    UIProps,
    ComboboxOptionMoreInfoPropsToOverride | 'onMouseEnter' | 'onMouseLeave' | 'buttonProps'
> & {
    /** Callback when the popover opens or closes. */
    onToggle?: (isOpen: boolean) => void;
};

/**
 * Combobox.OptionMoreInfo component.
 *
 * Displays an info icon button on a combobox option that shows a popover with additional details.
 * The popover opens on mouse hover over the icon or when the parent option is keyboard-highlighted.
 *
 * Must be placed in the `after` slot of a `Combobox.Option`.
 *
 * @param props Component props.
 * @return Vue element.
 */
const ComboboxOptionMoreInfo = defineComponent(
    (props: ComboboxOptionMoreInfoProps, { slots, expose }) => {
        const mergedClassName = useClassName(() => props.class);

        // Ref to the IconButton component instance (with exposed `$el`).
        const iconButtonRef = ref<any>(null);

        // Resolved DOM element (<button>) used as the popover anchor.
        const anchorEl = computed(() => iconButtonRef.value?.$el as HTMLElement | undefined);

        // Expose the IconButton's button element: the core template returns a Fragment
        // (<>IconButton + Popover</>), so Vue's built-in $el would resolve to the
        // Fragment start anchor (empty Text node).
        expose({ $el: anchorEl });

        const isHovered = ref(false);

        // Get the parent option ID from the option context
        const { optionId } = useComboboxOptionContext();

        // Subscribe to active descendant changes for keyboard highlight detection
        const activeDescendantId = useComboboxEvent('activeDescendantChange', null);

        const popoverId = `${optionId}-more-info`;

        /**
         * IconButton adapter: maps core `onMouseEnter`/`onMouseLeave`
         * → Vue `onMouseenter`/`onMouseleave` and captures the component ref.
         */
        function IconButtonAdapter(coreProps: any) {
            const { onMouseEnter, onMouseLeave, ...rest } = coreProps;
            return (
                <IconButton
                    ref={iconButtonRef}
                    {...{ onMouseenter: onMouseEnter, onMouseleave: onMouseLeave }}
                    {...rest}
                />
            );
        }
        /**
         * Adapter for Popover (closure): `anchorRef` with the resolved DOM element
         */
        const PopoverAdapter = (coreProps: any, { slots: popoverSlots }: any) => {
            const { anchorRef: _coreAnchorRef, ...rest } = coreProps;
            return (
                <Popover anchorRef={anchorEl} {...rest}>
                    {popoverSlots}
                </Popover>
            );
        };

        return () => {
            const isKeyboardHighlighted = activeDescendantId.value === optionId;
            const isOpen = isHovered.value || isKeyboardHighlighted;
            const children = slots.default?.() as JSXElement;

            return UI(
                {
                    // Pass `undefined` for the core template's `ref` prop. The core template
                    // passes `ref` to `<IconButton ref={ref}>`, but if we pass `iconButtonRef`
                    // here, Vue would bind the outer functional component's VNode ref to
                    // the same target, resolving to a Text node (due to Tooltip fragments)
                    // and overriding the adapter's inner `ref={iconButtonRef}` binding.
                    // By passing `undefined`, the outer VNode has no ref and only the adapter's
                    // inner ref binding takes effect.
                    ref: undefined,
                    className: mergedClassName.value,
                    isOpen,
                    popoverId,
                    children,
                    onMouseEnter: () => {
                        isHovered.value = true;
                    },
                    onMouseLeave: () => {
                        isHovered.value = false;
                    },
                },
                { IconButton: IconButtonAdapter, Popover: PopoverAdapter },
            );
        };
    },
    {
        name: 'LumxComboboxOptionMoreInfo',
        inheritAttrs: false,
        props: keysOf<ComboboxOptionMoreInfoProps>()('class', 'onToggle'),
        emits: {
            toggle: (isOpen: boolean) => typeof isOpen === 'boolean',
        },
    },
);

export { COMPONENT_NAME, CLASSNAME };
export default ComboboxOptionMoreInfo;
