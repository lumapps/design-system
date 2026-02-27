import { computed, defineComponent, type Ref, isRef } from 'vue';

import {
    Popover as PopoverUI,
    type PopoverProps as CorePopoverProps,
    DEFAULT_PROPS,
} from '@lumx/core/js/components/Popover';
import { type Placement, POPOVER_ZINDEX } from '@lumx/core/js/components/Popover/constants';
import type { JSXElement } from '@lumx/core/js/types';

import { ThemeProvider } from '../../utils/theme/ThemeProvider';
import { useCallbackOnEscape } from '../../composables/useCallbackOnEscape';
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
        // Convert props to refs for composables (accept both Ref and raw HTMLElement)
        const anchorRef = computed(() => (isRef(props.anchorRef) ? props.anchorRef.value : props.anchorRef));
        const boundaryRef = computed(() => (isRef(props.boundaryRef) ? props.boundaryRef.value : props.boundaryRef));
        const offsetRef = computed(() => props.offset);
        const hasArrowRef = computed(() => props.hasArrow);
        const fitToAnchorWidthRef = computed(() => props.fitToAnchorWidth);
        const fitWithinViewportHeightRef = computed(() => props.fitWithinViewportHeight);
        const placementRef = computed(() => props.placement || (DEFAULT_PROPS.placement as Placement));
        const zIndexRef = computed(() => props.zIndex ?? POPOVER_ZINDEX);
        const focusAnchorOnCloseRef = computed(() => props.focusAnchorOnClose ?? true);
        const parentElementRef = computed(() => props.parentElement);
        const isOpenRef = computed(() => Boolean(props.isOpen));

        const { styles, isPositioned, position, floatingRef, arrowRef } = usePopoverStyle({
            anchorRef: anchorRef as Ref<HTMLElement | undefined>,
            offset: offsetRef,
            hasArrow: hasArrowRef as Ref<boolean | undefined>,
            fitToAnchorWidth: fitToAnchorWidthRef as Ref<string | boolean | undefined>,
            fitWithinViewportHeight: fitWithinViewportHeightRef as Ref<boolean | undefined>,
            boundaryRef: boundaryRef as Ref<HTMLElement | undefined>,
            placement: placementRef as Ref<Placement | undefined>,
            style: computed(() => undefined),
            zIndex: zIndexRef,
        });

        // Focus restore on close
        useRestoreFocusOnClose(
            focusAnchorOnCloseRef,
            anchorRef as Ref<HTMLElement | undefined>,
            parentElementRef as Ref<HTMLElement | undefined>,
            floatingRef,
            isOpenRef,
        );

        // Close handler using emit
        const handleClose = () => {
            emit('close');
        };

        // Escape key handling
        const onCloseCallback = computed(() => handleClose);
        const closeOnEscapeEnabled = computed(() => Boolean(props.isOpen && props.closeOnEscape));
        useCallbackOnEscape(onCloseCallback, closeOnEscapeEnabled);

        // Focus management
        const focusElementRef = computed(() => props.focusElement);
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

        return () => {
            const theme = props.theme;
            const { class: className, isOpen, ...restProps } = props;

            // Extract only forwardable props (not framework-specific ones)
            const {
                anchorRef: _a,
                boundaryRef: _b,
                closeOnClickAway: _c,
                closeOnEscape: _d,
                focusElement: _e,
                focusAnchorOnClose: _f,
                fitToAnchorWidth: _g,
                fitWithinViewportHeight: _h,
                offset: _i,
                parentElement: _j,
                placement: _k,
                usePortal: _l,
                focusTrapZoneElement: _m,
                zIndex: _n,
                withFocusTrap: _o,
                theme: _p,
                as: _q,
                elevation: _r,
                hasArrow: _s,
                ...forwardedProps
            } = restProps;

            const clickAwayCallback = props.closeOnClickAway ? handleClose : undefined;

            return PopoverUI(
                {
                    ...forwardedProps,
                    ...attrs,
                    as: props.as,
                    children: slots.default?.() as JSXElement,
                    className,
                    elevation: props.elevation,
                    hasArrow: props.hasArrow,
                    isOpen: Boolean(isOpen),
                    position: position.value,
                    popoverStyle: styles.popover.value,
                    arrowStyle: styles.arrow.value,
                    theme,
                    ref: floatingRef,
                    arrowRef: arrowRef,
                    usePortal: props.usePortal ?? true,
                    clickAwayCallback,
                    clickAwayRefs,
                },
                { Portal, ClickAwayProvider, ThemeProvider },
            );
        };
    },
    {
        name: 'LumxPopover',
        inheritAttrs: false,
        props: keysOf<PopoverProps>()(
            'anchorRef',
            'as',
            'boundaryRef',
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
