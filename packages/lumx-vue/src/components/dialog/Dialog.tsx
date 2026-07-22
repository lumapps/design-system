import { Comment, computed, defineComponent, ref, type Ref } from 'vue';
import { useIntersectionObserver } from '@vueuse/core';

import {
    DialogShell,
    type BaseDialogProps,
    type DialogSizes,
    COMPONENT_NAME,
    DEFAULT_PROPS,
} from '@lumx/core/js/components/Dialog';
import { DIALOG_TRANSITION_DURATION } from '@lumx/core/js/constants';
import type { GenericProps, HasCloseMode, JSXElement } from '@lumx/core/js/types';

import { Portal } from '../../utils/Portal/Portal';
import { ClickAwayProvider } from '../../utils/ClickAway/ClickAwayProvider';
import { ThemeProvider } from '../../utils/theme/ThemeProvider';
import HeadingLevelProvider from '../heading/HeadingLevelProvider';
import ProgressCircular from '../progress/ProgressCircular';
import DialogContent from './DialogContent';

import { useCallbackOnEscape } from '../../composables/useCallbackOnEscape';
import { useClassName } from '../../composables/useClassName';
import { useFocusTrap } from '../../composables/useFocusTrap';
import { IdsRegistryProvider } from '../../utils/IdsRegistryContext';
import { useRestoreFocusOnClose } from '../../composables/useRestoreFocusOnClose';
import { useTransitionVisibility } from '../../composables/useTransitionVisibility';
import { useDisableBodyScroll } from '../../composables/useDisableBodyScroll';
import { getName, keysOf, type ClassValue } from '../../utils/VueToJSX';

export type DialogProps = Pick<BaseDialogProps, 'forceFooterDivider' | 'forceHeaderDivider' | 'isLoading'> &
    HasCloseMode & {
        /** Additional class name. */
        class?: ClassValue;
        /** Whether the dialog is open. */
        isOpen?: boolean;
        /** Size variant. */
        size?: DialogSizes;
        /** Z-axis position. */
        zIndex?: number;
        /** Additional props for the dialog container element. */
        dialogProps?: GenericProps;
        /** Reference to the parent element that triggered modal opening (gets focus back on close). */
        parentElement?: HTMLElement;
        /** Element that should receive focus when the dialog opens. By default the first focusable child. */
        focusElement?: HTMLElement;
        /** Reference to the dialog content element. */
        contentRef?: Ref<HTMLDivElement>;
        /** Whether to keep the dialog open on clickaway or escape press. */
        preventAutoClose?: boolean;
        /** Whether to keep the dialog open on escape press. */
        preventCloseOnEscape?: boolean;
        /** Whether to keep the dialog open on clickaway. */
        preventCloseOnClick?: boolean;
        /** Whether to disable body scroll when the dialog is open. */
        disableBodyScroll?: boolean;
    };

export const emitSchema = {
    close: () => true,
    visibilityChange: (isVisible: boolean) => typeof isVisible === 'boolean',
};

const Dialog = defineComponent(
    (props: DialogProps, { emit, slots, attrs }) => {
        const className = useClassName(() => props.class);

        const rootRef = ref<HTMLDivElement | null>(null);
        const wrapperRef = ref<HTMLDivElement | null>(null);
        const localContentRef = ref<HTMLDivElement | null>(null);

        // Sentinel refs for scroll divider detection — passed as callback refs to core JSX
        const sentinelTopRef = ref<HTMLElement | null>(null);
        const sentinelBottomRef = ref<HTMLElement | null>(null);
        const setSentinelTop = (el: HTMLElement | null) => {
            sentinelTopRef.value = el;
        };
        const setSentinelBottom = (el: HTMLElement | null) => {
            sentinelBottomRef.value = el;
        };

        // Intersection observer for scroll-triggered header/footer dividers
        const hasTopIntersection = ref<boolean | null>(null);
        const hasBottomIntersection = ref<boolean | null>(null);
        useIntersectionObserver(sentinelTopRef, (entries) => {
            const entry = entries[0];
            hasTopIntersection.value = entry ? !entry.isIntersecting : null;
        });
        useIntersectionObserver(sentinelBottomRef, (entries) => {
            const entry = entries[0];
            hasBottomIntersection.value = entry ? !entry.isIntersecting : null;
        });

        // Escape key
        const shouldPreventCloseOnEscape = computed(() => props.preventAutoClose || props.preventCloseOnEscape);
        const handleClose = () => emit('close');
        useCallbackOnEscape(
            handleClose,
            computed(() => Boolean(props.isOpen && !shouldPreventCloseOnEscape.value)),
        );

        // Focus trap inside the dialog wrapper
        const focusZoneElement = computed(() => {
            if (!props.isOpen) return false as const;
            return wrapperRef.value || false;
        });
        useFocusTrap(
            focusZoneElement,
            computed(() => props.focusElement),
        );

        // Restore focus to parentElement when dialog closes
        useRestoreFocusOnClose(
            computed(() => true),
            computed(() => undefined) as Ref<HTMLElement | undefined>,
            computed(() => props.parentElement) as Ref<HTMLElement | undefined>,
            wrapperRef as Ref<HTMLElement | undefined>,
            computed(() => Boolean(props.isOpen)),
        );

        // Disable body scroll when dialog is open
        useDisableBodyScroll(computed(() => props.disableBodyScroll !== false && Boolean(props.isOpen)));

        // Track animation state: keeps dialog mounted during close animation
        const isVisible = useTransitionVisibility(
            computed(() => Boolean(props.isOpen)),
            DIALOG_TRANSITION_DURATION,
            computed(() => (v: boolean) => emit('visibilityChange', v)),
        );

        // Mount guard: keep mounted during open, animation, or hide mode
        const isMounted = computed(() => props.isOpen || isVisible.value || props.closeMode === 'hide');

        // Click-away: only the wrapper section is allowed to be clicked inside
        const clickAwayRefs = computed(() => [wrapperRef]) as Ref<Array<Ref<HTMLElement | undefined>>>;
        const shouldPreventCloseOnClickAway = computed(() => props.preventAutoClose || props.preventCloseOnClick);

        // Merge external contentRef with internal one via callback ref
        const contentRefCallback = (el: HTMLDivElement | null) => {
            localContentRef.value = el;
            if (props.contentRef) {
                (props.contentRef as Ref<HTMLDivElement | null>).value = el;
            }
        };

        return () => {
            if (!isMounted.value) return null;

            // Support React-style children where <header> and <footer> are passed inline
            // (used by core component JSX). Falls back to named slots for regular Dialog usage.
            const defaultChildren = slots.default?.() ?? [];
            const headerVnode = defaultChildren.find((c: any) => c.type === 'header');
            const footerVnode = defaultChildren.find((c: any) => c.type === 'footer');
            const hasPartitioned = Boolean(headerVnode || footerVnode);
            const bodyChildren = hasPartitioned
                ? defaultChildren.filter((c: any) => c.type !== 'header' && c.type !== 'footer' && c.type !== Comment)
                : defaultChildren;

            return DialogShell({
                ...attrs,
                Portal,
                HeadingLevelProvider,
                ThemeProvider,
                IdsRegistryProvider,
                className: className.value,
                isLoading: props.isLoading,
                isOpen: props.isOpen,
                isVisible: isVisible.value,
                size: props.size ?? DEFAULT_PROPS.size,
                zIndex: props.zIndex,
                ref: rootRef,
                children: (
                    <DialogContent
                        ClickAwayProvider={ClickAwayProvider}
                        ProgressCircular={ProgressCircular}
                        clickAwayRefs={clickAwayRefs}
                        content={(bodyChildren.length ? bodyChildren : undefined) as JSXElement}
                        contentRef={contentRefCallback}
                        dialogProps={props.dialogProps}
                        footerChildContent={
                            (slots.footer?.() ?? (footerVnode as any)?.children) as JSXElement | undefined
                        }
                        forceFooterDivider={props.forceFooterDivider}
                        forceHeaderDivider={props.forceHeaderDivider}
                        handleClose={handleClose}
                        hasBottomIntersection={hasBottomIntersection.value}
                        hasTopIntersection={hasTopIntersection.value}
                        headerChildContent={
                            (slots.header?.() ?? (headerVnode as any)?.children) as JSXElement | undefined
                        }
                        isLoading={props.isLoading}
                        rootRef={rootRef as Ref<HTMLElement | undefined>}
                        setSentinelBottom={setSentinelBottom}
                        setSentinelTop={setSentinelTop}
                        shouldPreventCloseOnClickAway={shouldPreventCloseOnClickAway.value}
                        wrapperRef={wrapperRef as Ref<HTMLElement | undefined>}
                    />
                ),
            });
        };
    },
    {
        name: getName(COMPONENT_NAME),
        inheritAttrs: false,
        props: keysOf<DialogProps>()(
            'class',
            'closeMode',
            'contentRef',
            'dialogProps',
            'disableBodyScroll',
            'focusElement',
            'forceFooterDivider',
            'forceHeaderDivider',
            'isLoading',
            'isOpen',
            'parentElement',
            'preventAutoClose',
            'preventCloseOnClick',
            'preventCloseOnEscape',
            'size',
            'zIndex',
        ),
        emits: emitSchema,
    },
);

export default Dialog;
