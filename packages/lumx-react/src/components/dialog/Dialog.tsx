import React, { Children, ReactElement, Ref, RefObject, useMemo, useRef, useState } from 'react';

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
    /** Z-axis position. */
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

    const shouldPreventCloseOnEscape = preventAutoClose || preventCloseOnEscape;

    useCallbackOnEscape(onClose, isOpen && !shouldPreventCloseOnEscape);

    const wrapperRef = useRef<HTMLDivElement>(null);
    /**
     * Since the `contentRef` comes from the parent and is optional,
     * we need to create a stable contentRef that will always be available.
     */
    const localContentRef = useRef<HTMLDivElement>(null);
    // Handle focus trap.
    useFocusTrap(isOpen && wrapperRef.current, focusElement?.current);

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
