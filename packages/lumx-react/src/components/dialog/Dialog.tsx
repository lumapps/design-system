import React, { Children, ReactElement, ReactNode, Ref, RefObject, useMemo, useRef, useState } from 'react';

import classNames from 'classnames';

import { HeadingLevelProvider, Progress, ProgressVariant, Size } from '@lumx/react';

import { DIALOG_TRANSITION_DURATION, DOCUMENT } from '@lumx/react/constants';
import { useCallbackOnEscape } from '@lumx/react/hooks/useCallbackOnEscape';
import { useFocusTrap } from '@lumx/react/hooks/useFocusTrap';
import { useIntersectionObserver } from '@lumx/react/hooks/useIntersectionObserver';

import { GenericProps, isComponent } from '@lumx/react/utils/type';
import { partitionMulti } from '@lumx/react/utils/partitionMulti';
import { getRootClassName, handleBasicClasses } from '@lumx/react/utils/className';
import { ClickAwayProvider } from '@lumx/react/utils/ClickAwayProvider';
import { mergeRefs } from '@lumx/react/utils/react/mergeRefs';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';

import { useDisableBodyScroll } from '@lumx/react/hooks/useDisableBodyScroll';
import { useTransitionVisibility } from '@lumx/react/hooks/useTransitionVisibility';
import { ThemeProvider } from '@lumx/react/utils/theme/ThemeContext';

import { Portal } from '@lumx/react/utils';

/**
 * Defines the props of the component.
 */
export interface DialogProps extends GenericProps {
    /** Footer content. */
    footer?: ReactNode;
    /** Whether the divider between the dialog content and the footer is always displayed (instead of showing it on scroll). */
    forceFooterDivider?: boolean;
    /** Header content. */
    header?: ReactNode;
    /** Whether the divider between the dialog content and the footer is always displayed (instead of showing it on scroll). */
    forceHeaderDivider?: boolean;
    /** Whether the indefinite progress indicator over the dialog content is displayed or not. */
    isLoading?: boolean;
    /** Whether the component is open or not. */
    isOpen?: boolean;
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

export type DialogSizes = Extract<Size, 'tiny' | 'regular' | 'big' | 'huge'>;

const isHeader = isComponent('header');
const isFooter = isComponent('footer');

/**
 * Component display name.
 */
const COMPONENT_NAME = 'Dialog';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * Component default props.
 */
const DEFAULT_PROPS: Partial<DialogProps> = {
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
export const Dialog = forwardRef<DialogProps, HTMLDivElement>((props, ref) => {
    if (!DOCUMENT) {
        // Can't render in SSR.
        return null;
    }

    const {
        children,
        className,
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

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const previousOpen = React.useRef(isOpen);
    // eslint-disable-next-line react-hooks/rules-of-hooks
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

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useCallbackOnEscape(onClose, isOpen && !shouldPreventCloseOnEscape);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const wrapperRef = useRef<HTMLDivElement>(null);
    /**
     * Since the `contentRef` comes from the parent and is optional,
     * we need to create a stable contentRef that will always be available.
     */
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const localContentRef = useRef<HTMLDivElement>(null);
    // Handle focus trap.
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useFocusTrap(isOpen && wrapperRef.current, focusElement?.current);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useDisableBodyScroll(disableBodyScroll && isOpen && localContentRef.current);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [sentinelTop, setSentinelTop] = useState<Element | null>(null);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [sentinelBottom, setSentinelBottom] = useState<Element | null>(null);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const intersections = useIntersectionObserver([sentinelTop, sentinelBottom], {
        threshold: [0, 1],
    });

    const hasTopIntersection = sentinelTop && !(intersections.get(sentinelTop)?.isIntersecting ?? true);
    const hasBottomIntersection = sentinelBottom && !(intersections.get(sentinelBottom)?.isIntersecting ?? true);

    // Separate header, footer and dialog content from children.
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [[headerChild], [footerChild], content] = useMemo(
        () => partitionMulti(Children.toArray(children), [isHeader, isFooter]),
        [children],
    );
    const headerChildProps = (headerChild as ReactElement)?.props;
    const headerChildContent = headerChildProps?.children;
    const footerChildProps = (footerChild as ReactElement)?.props;
    const footerChildContent = footerChildProps?.children;

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const clickAwayRefs = useRef([wrapperRef]);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const rootRef = useRef<HTMLDivElement>(null);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const isVisible = useTransitionVisibility(rootRef, Boolean(isOpen), DIALOG_TRANSITION_DURATION, onVisibilityChange);

    const shouldPreventCloseOnClickAway = preventAutoClose || preventCloseOnClick;

    return isOpen || isVisible ? (
        <Portal>
            <div
                ref={mergeRefs(rootRef, ref)}
                {...forwardedProps}
                className={classNames(
                    className,
                    handleBasicClasses({
                        isHidden: !isOpen,
                        isLoading,
                        isShown: isOpen || isVisible,
                        prefix: CLASSNAME,
                        size,
                    }),
                )}
                style={{ zIndex }}
            >
                <div className={`${CLASSNAME}__overlay`} />

                <HeadingLevelProvider level={2}>
                    <ThemeProvider value={undefined}>
                        <div className={`${CLASSNAME}__container`} role="dialog" aria-modal="true" {...dialogProps}>
                            <ClickAwayProvider
                                callback={!shouldPreventCloseOnClickAway && onClose}
                                childrenRefs={clickAwayRefs}
                                parentRef={rootRef}
                            >
                                <section className={`${CLASSNAME}__wrapper`} ref={wrapperRef}>
                                    {(header || headerChildContent) && (
                                        <header
                                            {...headerChildProps}
                                            className={classNames(
                                                `${CLASSNAME}__header`,
                                                (forceHeaderDivider || hasTopIntersection) &&
                                                    `${CLASSNAME}__header--has-divider`,
                                                headerChildProps?.className,
                                            )}
                                        >
                                            {header}
                                            {headerChildContent}
                                        </header>
                                    )}

                                    <div
                                        ref={mergeRefs(contentRef, localContentRef)}
                                        className={`${CLASSNAME}__content`}
                                    >
                                        <div
                                            className={`${CLASSNAME}__sentinel ${CLASSNAME}__sentinel--top`}
                                            ref={setSentinelTop}
                                        />

                                        {content}

                                        <div
                                            className={`${CLASSNAME}__sentinel ${CLASSNAME}__sentinel--bottom`}
                                            ref={setSentinelBottom}
                                        />
                                    </div>

                                    {(footer || footerChildContent) && (
                                        <footer
                                            {...footerChildProps}
                                            className={classNames(
                                                `${CLASSNAME}__footer`,
                                                (forceFooterDivider || hasBottomIntersection) &&
                                                    `${CLASSNAME}__footer--has-divider`,
                                                footerChildProps?.className,
                                            )}
                                        >
                                            {footer}
                                            {footerChildContent}
                                        </footer>
                                    )}

                                    {isLoading && (
                                        <div className={`${CLASSNAME}__progress-overlay`}>
                                            <Progress variant={ProgressVariant.circular} />
                                        </div>
                                    )}
                                </section>
                            </ClickAwayProvider>
                        </div>
                    </ThemeProvider>
                </HeadingLevelProvider>
            </div>
        </Portal>
    ) : null;
});
Dialog.displayName = COMPONENT_NAME;
Dialog.className = CLASSNAME;
Dialog.defaultProps = DEFAULT_PROPS;
