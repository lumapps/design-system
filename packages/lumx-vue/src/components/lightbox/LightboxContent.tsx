import { computed, defineComponent, ref, type Ref } from 'vue';

import { Lightbox as UI } from '@lumx/core/js/components/Lightbox';
import { DIALOG_TRANSITION_DURATION } from '@lumx/core/js/constants';
import type { JSXElement } from '@lumx/core/js/types';
import { DIALOG_LABEL_KEY } from '@lumx/core/js/components/Dialog/constants';

import { Portal } from '../../utils/Portal/Portal';
import { ClickAwayProvider } from '../../utils/ClickAway/ClickAwayProvider';
import { ThemeProvider } from '../../utils/theme/ThemeProvider';
import HeadingLevelProvider from '../heading/HeadingLevelProvider';
import IconButton from '../button/IconButton';

import { useCallbackOnEscape } from '../../composables/useCallbackOnEscape';
import { useClassName } from '../../composables/useClassName';
import { useFocusTrap } from '../../composables/useFocusTrap';
import { useRegisteredId } from '../../utils/IdsRegistryContext';
import { getName } from '../../utils/VueToJSX';
import { useRestoreFocusOnClose } from '../../composables/useRestoreFocusOnClose';
import { useTransitionVisibility } from '../../composables/useTransitionVisibility';
import { useDisableBodyScroll } from '../../composables/useDisableBodyScroll';

import { emitSchema, LIGHTBOX_PROP_KEYS } from './constants';
import type { LightboxProps } from './types';

/**
 * Renders the core Lightbox UI, resolving its `aria-labelledby` from the ids registry.
 *
 * Owns the lightbox logic (focus trap, escape, transition, body scroll) and must render as a
 * descendant of the `IdsRegistryProvider` set up by `Lightbox` - the subscription composable needs
 * to run below the provider. Internal to the lightbox family - not exported from the package barrel.
 */
const LightboxContent = defineComponent(
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

        // Mount guard: keep rendered while open or animating closed
        const isMounted = computed(() => props.isOpen || isVisible.value);

        // Click-away: treat the full root div as the "inside" zone
        const clickAwayRefs = computed(() => [wrapperRef]) as Ref<Array<Ref<HTMLElement | undefined>>>;

        const labelId = useRegisteredId(DIALOG_LABEL_KEY);

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
                labelId: labelId.value,
                handleClose,
                preventAutoClose: props.preventAutoClose,
                ref: wrapperRef,
                zIndex: props.zIndex,
                children: slots.default?.() as JSXElement,
            });
        };
    },
    {
        name: getName('LightboxContent'),
        inheritAttrs: false,
        props: LIGHTBOX_PROP_KEYS,
        emits: emitSchema,
    },
);

export default LightboxContent;
