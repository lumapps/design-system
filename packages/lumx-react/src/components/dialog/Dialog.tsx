import React, { Children, ReactElement, Ref, RefObject, useEffect, useMemo, useRef, useState } from 'react';

import { HeadingLevelProvider, ProgressCircular, Size } from '@lumx/react';

import { DIALOG_TRANSITION_DURATION, DOCUMENT } from '@lumx/react/constants';
import { useCallbackOnEscape } from '@lumx/react/hooks/useCallbackOnEscape';
import { useFocusTrap } from '@lumx/react/hooks/useFocusTrap';
import { useIntersectionObserver } from '@lumx/react/hooks/useIntersectionObserver';

import { GenericProps, HasCloseMode, isComponent } from '@lumx/react/utils/type';
import { partitionMulti } from '@lumx/react/utils/partitionMulti';
import { ClickAwayProvider } from '@lumx/react/utils/ClickAwayProvider';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import { mergeRefs } from '@lumx/react/utils/react/mergeRefs';

import { useDisableBodyScroll } from '@lumx/react/hooks/useDisableBodyScroll';
import { useTransitionVisibility } from '@lumx/react/hooks/useTransitionVisibility';
import { ThemeProvider } from '@lumx/react/utils/theme/ThemeContext';

import { Portal } from '@lumx/react/utils';
import { onEscapePressed } from '@lumx/core/js/utils';
import { getFirstAndLastFocusable } from '@lumx/core/js/utils/focus/getFirstAndLastFocusable';
import {
    DialogShell,
    CLASSNAME,
    COMPONENT_NAME,
    type DialogSizes,
    BaseDialogProps as UIProps,
} from '@lumx/core/js/components/Dialog';

import { IdsRegistryProvider } from '@lumx/react/utils/IdsRegistryContext';
import { DialogContent } from './DialogContent';

export type { DialogSizes } from '@lumx/core/js/components/Dialog';

/**
 * Defines the props of the component.
 */
export interface DialogProps extends GenericProps, HasCloseMode, UIProps {
    /** Reference to the parent element that triggered modal opening (will get back focus on close). */
    parentElement?: RefObject<HTMLElement>;
    /** Reference to the dialog content element. */
    contentRef?: Ref<HTMLDivElement>;
    /** Reference to the of the element that should get the focus when the dialogs opens. By default, the first child will take focus. */
    focusElement?: RefObject<HTMLElement>;
    /** Whether to keep the dialog open on clickaway or escape press. */
    preventAutoClose?: boolean;
    /** Whether to keep the dialog open on escape press. */
    preventCloseOnEscape?: boolean;
    /** Whether to keep the dialog open on clickaway. */
    preventCloseOnClick?: boolean;
    /** Size variant. */
    size?: DialogSizes;
    /** Z-axis position. */
    zIndex?: number;
    /**
     * Additional props for the dialog container element.
     * Set `'aria-modal': false` to make the dialog non-modal: the page stays usable (no focus trap, no overlay,
     * no close on click away, rendered in place instead of in a portal) and escape only closes the dialog when the
     * focus is inside.
     */
    dialogProps?: GenericProps;
    /** On close callback. */
    onClose?(): void;
    /** Callback called when the open animation starts and the close animation finishes. */
    onVisibilityChange?(isVisible: boolean): void;
    /** whether to disable the scroll on the body or not */
    disableBodyScroll?: boolean;
    /** Children */
    children?: React.ReactNode;
}

const isHeader = isComponent('header');
const isFooter = isComponent('footer');

/**
 * Component default props.
 */
const DEFAULT_PROPS: Partial<DialogProps> = {
    closeMode: 'unmount',
    size: Size.big,
    disableBodyScroll: true,
};

/**
 * Dialog component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
const DialogBody = forwardRef<DialogProps, HTMLDivElement>((props, ref) => {
    const {
        children,
        className,
        closeMode = DEFAULT_PROPS.closeMode,
        header,
        focusElement,
        forceFooterDivider,
        forceHeaderDivider,
        footer,
        isLoading,
        isOpen,
        onClose,
        parentElement,
        contentRef,
        preventAutoClose,
        size = DEFAULT_PROPS.size,
        zIndex,
        dialogProps,
        onVisibilityChange,
        disableBodyScroll = DEFAULT_PROPS.disableBodyScroll,
        preventCloseOnClick,
        preventCloseOnEscape,
        ...forwardedProps
    } = props;

    const previousOpen = React.useRef(isOpen);
    React.useEffect(() => {
        if (isOpen !== previousOpen.current) {
            previousOpen.current = isOpen;

            // Focus the parent element on close.
            if (!isOpen && parentElement && parentElement.current) {
                parentElement.current.focus();
            }
        }
    }, [isOpen, parentElement]);

    const isModal = dialogProps?.['aria-modal'] !== false && dialogProps?.['aria-modal'] !== 'false';

    const shouldPreventCloseOnEscape = preventAutoClose || preventCloseOnEscape;

    useCallbackOnEscape(onClose, isModal && isOpen && !shouldPreventCloseOnEscape);

    const wrapperRef = useRef<HTMLDivElement>(null);
    /**
     * Since the `contentRef` comes from the parent and is optional,
     * we need to create a stable contentRef that will always be available.
     */
    const localContentRef = useRef<HTMLDivElement>(null);
    // Handle focus trap.
    useFocusTrap(isModal && isOpen && wrapperRef.current, focusElement?.current);

    // Non-modal: without the focus trap, move the focus into the dialog on open ourselves.
    useEffect(() => {
        const wrapper = wrapperRef.current;
        if (isModal || !isOpen || !wrapper) return;
        (focusElement?.current || getFirstAndLastFocusable(wrapper).first)?.focus();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isModal, isOpen]);

    // Non-modal: close on escape only when the focus is inside the dialog.
    useEffect(() => {
        const wrapper = wrapperRef.current;
        if (isModal || !isOpen || shouldPreventCloseOnEscape || !onClose || !wrapper) return undefined;
        const onKeyDown = onEscapePressed(onClose);
        wrapper.addEventListener('keydown', onKeyDown);
        return () => wrapper.removeEventListener('keydown', onKeyDown);
    }, [isModal, isOpen, shouldPreventCloseOnEscape, onClose]);

    useDisableBodyScroll(disableBodyScroll && isOpen && localContentRef.current);

    const [sentinelTop, setSentinelTop] = useState<Element | null>(null);
    const [sentinelBottom, setSentinelBottom] = useState<Element | null>(null);
    const intersections = useIntersectionObserver([sentinelTop, sentinelBottom], {
        threshold: [0, 1],
    });

    const hasTopIntersection = sentinelTop && !(intersections.get(sentinelTop)?.isIntersecting ?? true);
    const hasBottomIntersection = sentinelBottom && !(intersections.get(sentinelBottom)?.isIntersecting ?? true);

    // Separate header, footer and dialog content from children.
    const [[headerChild], [footerChild], content] = useMemo(
        () => partitionMulti(Children.toArray(children), [isHeader, isFooter]),
        [children],
    );
    const headerChildProps = (headerChild as ReactElement)?.props;
    const headerChildContent = headerChildProps?.children;
    const footerChildProps = (footerChild as ReactElement)?.props;
    const footerChildContent = footerChildProps?.children;

    const clickAwayRefs = useRef([wrapperRef]);

    const rootRef = useRef<HTMLDivElement>(null);

    const isVisible = useTransitionVisibility(rootRef, Boolean(isOpen), DIALOG_TRANSITION_DURATION, onVisibilityChange);

    const shouldPreventCloseOnClickAway = preventAutoClose || preventCloseOnClick;

    const isMounted = isOpen || isVisible || closeMode === 'hide';

    if (!isMounted) return null;

    return DialogShell({
        Portal,
        HeadingLevelProvider,
        ThemeProvider,
        IdsRegistryProvider,
        className,
        isLoading,
        isOpen,
        isVisible,
        size,
        zIndex,
        isModal,
        ref: mergeRefs(rootRef, ref),
        ...forwardedProps,
        children: (
            <DialogContent
                ClickAwayProvider={ClickAwayProvider}
                ProgressCircular={ProgressCircular}
                clickAwayRefs={clickAwayRefs}
                content={content}
                contentRef={mergeRefs(localContentRef, contentRef)}
                dialogProps={dialogProps}
                footer={footer}
                footerChildContent={footerChildContent}
                footerChildProps={footerChildProps}
                forceFooterDivider={forceFooterDivider}
                forceHeaderDivider={forceHeaderDivider}
                handleClose={onClose}
                hasBottomIntersection={hasBottomIntersection}
                hasTopIntersection={hasTopIntersection}
                header={header}
                headerChildContent={headerChildContent}
                headerChildProps={headerChildProps}
                isLoading={isLoading}
                isModal={isModal}
                rootRef={rootRef}
                setSentinelBottom={setSentinelBottom}
                setSentinelTop={setSentinelTop}
                shouldPreventCloseOnClickAway={shouldPreventCloseOnClickAway}
                wrapperRef={wrapperRef}
            />
        ),
    });
});
DialogBody.displayName = 'DialogBody';

export const Dialog = forwardRef<DialogProps, HTMLDivElement>((props, ref) => {
    if (!DOCUMENT) {
        // Can't render in SSR.
        return null;
    }
    return <DialogBody {...props} ref={ref} />;
});
Dialog.displayName = COMPONENT_NAME;
Dialog.className = CLASSNAME;
Dialog.defaultProps = DEFAULT_PROPS;
