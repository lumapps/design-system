import { computed, defineComponent, type Ref, unref, toRef } from 'vue';

import {
    Popover as PopoverUI,
    type PopoverProps as CorePopoverProps,
    DEFAULT_PROPS,
} from '@lumx/core/js/components/Popover';
import { type Placement, POPOVER_ZINDEX } from '@lumx/core/js/components/Popover/constants';
import type { JSXElement } from '@lumx/core/js/types';

import { ThemeProvider } from '../../utils/theme/ThemeProvider';
import { useCallbackOnEscape } from '../../composables/useCallbackOnEscape';
import { useClassName } from '../../composables/useClassName';
import { Portal } from '../../utils/Portal/Portal';
import { ClickAwayProvider } from '../../utils/ClickAway/ClickAwayProvider';
import { keysOf, VueToJSXProps } from '../../utils/VueToJSX';

import { usePopoverStyle } from './usePopoverStyle';
import { useFocusTrap } from '../../composables/useFocusTrap';
import { useFocus } from '../../composables/useFocus';
import { useRestoreFocusOnClose } from '../../composables/useRestoreFocusOnClose';

/**
 * Vue Popover props derived from core PopoverProps.
 * Omits framework-specific props and narrows element ref types to raw HTMLElement.
 * `isOpen` is made optional (defaults to false at runtime via keysOf).
 */
export type PopoverProps = VueToJSXProps<
    CorePopoverProps,
    'anchorRef' | 'boundaryRef' | 'focusElement' | 'parentElement' | 'focusTrapZoneElement' | 'isOpen'
> & {
    /** Reference to the DOM element used to set the position of the popover. Accepts a Vue Ref for reactive positioning. */
    anchorRef?: Ref<HTMLElement | undefined> | HTMLElement;
    /** Element which will act as boundary when opening the popover. Accepts a Vue Ref for reactive positioning. */
    boundaryRef?: Ref<HTMLElement | undefined> | HTMLElement;
    /** Element to focus when opening the popover. */
    focusElement?: HTMLElement;
    /** Whether the popover is open or not. */
    isOpen?: boolean;
    /** Reference to the parent element that triggered the popover. */
    parentElement?: HTMLElement;
    /** The element in which the focus trap should be set. Default to popover. */
    focusTrapZoneElement?: HTMLElement;
};

export const emitSchema = {
    close: () => true,
};

const Popover = defineComponent(
    (props: PopoverProps, { emit, slots, attrs }) => {
        const className = useClassName(() => props.class);
        // Unwrap anchorRef (accepts both Vue Ref and raw HTMLElement) — reused across composables
        const anchorRef = computed(() => unref(props.anchorRef));
        // Reused across useFocus and useFocusTrap
        const focusElementRef = toRef(props, 'focusElement');

        // Positioning
        const { styles, isPositioned, position, floatingRef, arrowRef } = usePopoverStyle({
            anchorRef: anchorRef as Ref<HTMLElement | undefined>,
            boundaryRef: computed(() => unref(props.boundaryRef)) as Ref<HTMLElement | undefined>,
            offset: toRef(props, 'offset'),
            hasArrow: toRef(props, 'hasArrow'),
            fitToAnchorWidth: toRef(props, 'fitToAnchorWidth'),
            fitWithinViewportHeight: toRef(props, 'fitWithinViewportHeight'),
            placement: computed(() => props.placement || (DEFAULT_PROPS.placement as Placement)),
            style: computed(() => undefined),
            zIndex: computed(() => props.zIndex ?? POPOVER_ZINDEX),
        });

        // Focus restore on close
        useRestoreFocusOnClose(
            computed(() => props.focusAnchorOnClose ?? true),
            anchorRef as Ref<HTMLElement | undefined>,
            computed(() => props.parentElement) as Ref<HTMLElement | undefined>,
            floatingRef,
            computed(() => Boolean(props.isOpen)),
        );

        // Close handler using emit
        const handleClose = () => {
            emit('close');
        };

        // Escape key handling
        useCallbackOnEscape(
            computed(() => handleClose),
            computed(() => Boolean(props.isOpen && props.closeOnEscape)),
        );

        // Focus management
        const shouldFocus = computed(() => !props.withFocusTrap && Boolean(props.isOpen) && isPositioned.value);
        useFocus(focusElementRef, shouldFocus);

        // Focus trap
        const focusZoneElement = computed(() => {
            if (!props.withFocusTrap || !props.isOpen) return false as const;
            return props.focusTrapZoneElement || floatingRef.value || false;
        });
        useFocusTrap(focusZoneElement, focusElementRef);

        // Click-away refs: popover ref + anchor ref
        const clickAwayRefs = computed(() => [floatingRef, anchorRef]) as Ref<Array<Ref<HTMLElement | undefined>>>;

        return () =>
            PopoverUI(
                {
                    ...attrs,
                    as: props.as,
                    closeMode: props.closeMode,
                    elevation: props.elevation,
                    hasArrow: props.hasArrow,
                    usePortal: props.usePortal,
                    children: slots.default?.() as JSXElement,
                    className: className.value,
                    isOpen: Boolean(props.isOpen),
                    position: position.value,
                    popoverStyle: styles.popover.value,
                    arrowStyle: styles.arrow.value,
                    theme: props.theme,
                    ref: floatingRef,
                    arrowRef,
                    clickAwayCallback: props.closeOnClickAway ? handleClose : undefined,
                    clickAwayRefs,
                },
                { Portal, ClickAwayProvider, ThemeProvider },
            );
    },
    {
        name: 'LumxPopover',
        inheritAttrs: false,
        props: keysOf<PopoverProps>()(
            'anchorRef',
            'as',
            'boundaryRef',
            'closeMode',
            'closeOnClickAway',
            'closeOnEscape',
            'elevation',
            'fitToAnchorWidth',
            'fitWithinViewportHeight',
            'focusElement',
            'focusAnchorOnClose',
            'hasArrow',
            'isOpen',
            'offset',
            'parentElement',
            'placement',
            'usePortal',
            'focusTrapZoneElement',
            'zIndex',
            'withFocusTrap',
            'theme',
            'class',
        ),
        emits: emitSchema,
    },
);

export default Popover;
