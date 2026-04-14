import { computed, defineComponent, ref, type Ref } from 'vue';

import { Lightbox as UI, type BaseLightboxProps } from '@lumx/core/js/components/Lightbox';
import { DIALOG_TRANSITION_DURATION } from '@lumx/core/js/constants';
import type { JSXElement } from '@lumx/core/js/types';

import { Portal } from '../../utils/Portal/Portal';
import { ClickAwayProvider } from '../../utils/ClickAway/ClickAwayProvider';
import { ThemeProvider } from '../../utils/theme/ThemeProvider';
import HeadingLevelProvider from '../heading/HeadingLevelProvider';
import IconButton from '../button/IconButton';

import { useCallbackOnEscape } from '../../composables/useCallbackOnEscape';
import { useClassName } from '../../composables/useClassName';
import { useFocusTrap } from '../../composables/useFocusTrap';
import { useRestoreFocusOnClose } from '../../composables/useRestoreFocusOnClose';
import { useTransitionVisibility } from '../../composables/useTransitionVisibility';
import { useDisableBodyScroll } from '../../composables/useDisableBodyScroll';
import { keysOf, VueToJSXProps } from '../../utils/VueToJSX';

export type LightboxProps = VueToJSXProps<BaseLightboxProps, 'theme' | 'aria-label' | 'aria-labelledby'> & {
    /** Reference to the element that triggered lightbox opening (gets focus back on close). */
    parentElement?: HTMLElement;
    /** Element that should receive focus when the lightbox opens. By default the first focusable child. */
    focusElement?: HTMLElement;
    /** Props to pass to the close button. */
    closeButtonProps?: any;
};
// theme, aria-label, aria-labelledby pass through via attrs

export const emitSchema = {
    close: () => true,
};

const Lightbox = defineComponent(
    (props: LightboxProps, { emit, slots, attrs }) => {
        const className = useClassName(() => props.class);

        // Root div ref — used as focus zone and click-away zone
        const wrapperRef = ref<HTMLDivElement | null>(null);
        // Close button ref (passed to core; only mounted when closeButtonProps is provided)
        const closeButtonRef = ref<HTMLButtonElement | null>(null);

        const handleClose = () => emit('close');

        // Escape key closes the lightbox
        useCallbackOnEscape(
            handleClose,
            computed(() => Boolean(props.isOpen && !props.preventAutoClose)),
        );

        // Focus trap inside the lightbox root
        const focusZoneElement = computed(() => {
            if (!props.isOpen) return false as const;
            return wrapperRef.value || false;
        });

        useFocusTrap(
            focusZoneElement,
            computed(() => {
                // closeButtonRef holds a Vue component instance; unwrap to the underlying DOM element via $el
                const closeButtonEl = (closeButtonRef.value as any)?.$el ?? closeButtonRef.value;
                return props.focusElement || closeButtonEl || wrapperRef.value;
            }),
        );

        // Restore focus to parentElement when lightbox closes
        useRestoreFocusOnClose(
            computed(() => true),
            computed(() => undefined) as Ref<HTMLElement | undefined>,
            computed(() => props.parentElement) as Ref<HTMLElement | undefined>,
            wrapperRef as Ref<HTMLElement | undefined>,
            computed(() => Boolean(props.isOpen)),
        );

        // Disable body scroll when lightbox is open
        useDisableBodyScroll(computed(() => Boolean(props.isOpen)));

        // Track animation state: keeps lightbox mounted during close animation
        const isVisible = useTransitionVisibility(
            computed(() => Boolean(props.isOpen)),
            DIALOG_TRANSITION_DURATION,
        );

        // Mount guard: keep mounted while open or animating closed
        const isMounted = computed(() => props.isOpen || isVisible.value);

        // Click-away: treat the full root div as the "inside" zone
        const clickAwayRefs = computed(() => [wrapperRef]) as Ref<Array<Ref<HTMLElement | undefined>>>;

        return () => {
            if (!isMounted.value) return null;

            return UI({
                ...attrs,
                ClickAwayProvider,
                HeadingLevelProvider,
                IconButton,
                Portal,
                ThemeProvider,
                className: className.value,
                clickAwayRefs,
                closeButtonProps: props.closeButtonProps,
                closeButtonRef,
                isOpen: props.isOpen,
                isVisible: isVisible.value,
                handleClose,
                preventAutoClose: props.preventAutoClose,
                ref: wrapperRef,
                zIndex: props.zIndex,
                children: slots.default?.() as JSXElement,
            });
        };
    },
    {
        name: 'LumxLightbox',
        inheritAttrs: false,
        props: keysOf<LightboxProps>()(
            'class',
            'closeButtonProps',
            'focusElement',
            'isOpen',
            'parentElement',
            'preventAutoClose',
            'zIndex',
        ),
        emits: emitSchema,
    },
);

export default Lightbox;
