import React, { Children, ReactElement, ReactNode, RefObject, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import classNames from 'classnames';

import { Progress, ProgressVariant, Size } from '@lumx/react';

import { DIALOG_TRANSITION_DURATION, COMPONENT_PREFIX } from '@lumx/react/constants';

import { useCallbackOnEscape } from '@lumx/react/hooks/useCallbackOnEscape';
import { useFocus } from '@lumx/react/hooks/useFocus';
import { useFocusTrap } from '@lumx/react/hooks/useFocusTrap';
import { useIntersectionObserver } from '@lumx/react/hooks/useIntersectionObserver';
import { GenericProps, getRootClassName, handleBasicClasses, isComponent, partitionMulti } from '@lumx/react/utils';

import { useDelayedVisibility } from '@lumx/react/hooks/useDelayedVisibility';

/**
 * Defines the props of the component.
 */
export interface DialogProps extends GenericProps {
    /**
     * Element(s) to display in the footer part.
     */
    footer?: ReactNode;

    /**
     * Force divider between the dialog content and the footer (instead of showing it on scroll)
     */
    forceFooterDivider?: boolean;

    /**
     * Element(s) to display in the header part.
     */
    header?: ReactNode;

    /**
     * Force divider between the dialog content and the header (instead of showing it on scroll)
     */
    forceHeaderDivider?: boolean;

    /**
     * Display an indefinite progress indicator over the dialog content when activated.
     */
    isLoading?: boolean;

    /**
     * Controls the visibility of the dialog.
     */
    isOpen?: boolean;

    /**
     * Ref of element that triggered modal opening to set focus on.
     */
    parentElement?: RefObject<HTMLElement>;

    /**
     * Ref of the element that should get the focus when the dialogs opens.
     * By default, the first child will take focus.
     */
    focusElement?: RefObject<HTMLElement>;

    /**
     * Prevent clickaway and escape to dismiss the dialog
     */
    preventAutoClose?: boolean;

    /**
     * Size of the dialog
     */
    size?: DialogSizes;

    /**
     * The z-axis position.
     */
    zIndex?: number;

    /**
     * Callback called when the dialog is closing.
     */
    onClose?(): void;

    /**
     * Callback called when the dialog is opening.
     */
    onOpen?(): void;
}

export type DialogSizes = Size.tiny | Size.regular | Size.big | Size.huge;

const isHeader = isComponent('header');
const isFooter = isComponent('footer');

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}Dialog`;

/**
 * The default class name and classes prefix for this component.
 */
export const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
 */
export const DEFAULT_PROPS: Partial<DialogProps> = {
    forceFooterDivider: false,
    forceHeaderDivider: false,
    isOpen: false,
    preventAutoClose: false,
    size: Size.big,
};

/**
 * Dialog component.
 *
 * @param props Component props.
 * @return The component.
 */
export const Dialog: React.FC<DialogProps> = (props) => {
    const {
        children,
        className,
        header,
        focusElement,
        forceFooterDivider = DEFAULT_PROPS.forceFooterDivider,
        forceHeaderDivider = DEFAULT_PROPS.forceHeaderDivider,
        footer,
        isLoading,
        isOpen = DEFAULT_PROPS.isOpen,
        onOpen,
        onClose,
        parentElement,
        preventAutoClose = DEFAULT_PROPS.preventAutoClose,
        size = DEFAULT_PROPS.size,
        zIndex,
    } = props;

    useCallbackOnEscape(onClose, isOpen && !preventAutoClose);

    const wrapperRef = useRef<HTMLElement>(null);

    // Focus the parent element on close.
    useFocus(parentElement?.current, !isOpen);

    // Handle focus trap.
    useFocusTrap(wrapperRef.current, focusElement?.current);

    const [sentinelTop, setSentinelTop] = useState<Element | null>(null);
    const [sentinelBottom, setSentinelBottom] = useState<Element | null>(null);
    const [sentinelWrapper, setSentinelWrapper] = useState<Element | null>(null);
    const intersections = useIntersectionObserver([sentinelTop, sentinelBottom, sentinelWrapper], {
        threshold: [0, 1],
    });

    const hasTopIntersection = !(intersections.get(sentinelTop as Element)?.isIntersecting ?? true);
    const hasBottomIntersection = !(intersections.get(sentinelBottom as Element)?.isIntersecting ?? true);
    const intersectsWrapper = !(intersections.get(sentinelWrapper as Element)?.isIntersecting ?? true);

    const [hasScroll, setHasScroll] = useState(intersectsWrapper);
    useEffect(() => {
        if (intersectsWrapper) {
            setHasScroll(true);
        }
        if (hasScroll && !hasTopIntersection && !hasBottomIntersection) {
            setHasScroll(false);
        }
    }, [intersectsWrapper, hasBottomIntersection, hasTopIntersection, hasScroll]);

    // Separate header, footer and dialog content from children.
    const [[headerChild], [footerChild], content] = useMemo(
        () => partitionMulti(Children.toArray(children), [isHeader, isFooter]),
        [children],
    );
    const headerChildProps = (headerChild as ReactElement)?.props;
    const headerChildContent = headerChildProps?.children;
    const footerChildProps = (footerChild as ReactElement)?.props;
    const footerChildContent = footerChildProps?.children;

    const onClickOverlay = () => {
        if (!preventAutoClose) {
            onClose?.();
        }
    };
    useEffect(() => {
        if (isOpen) {
            onOpen?.();
        }
    }, [isOpen, onOpen]);

    const isVisible = useDelayedVisibility(Boolean(isOpen), DIALOG_TRANSITION_DURATION);

    return isOpen || isVisible
        ? createPortal(
              <div
                  className={classNames(
                      className,
                      handleBasicClasses({
                          hasScroll,
                          isHidden: !isOpen,
                          isLoading,
                          isShown: isOpen || isVisible,
                          prefix: CLASSNAME,
                          size,
                      }),
                  )}
                  style={{ zIndex }}
              >
                  <div className={`${CLASSNAME}__overlay`} onClick={onClickOverlay} />

                  <section ref={wrapperRef} className={`${CLASSNAME}__wrapper`} role="dialog">
                      {(header || headerChildContent) && (
                          <header
                              {...headerChildProps}
                              className={classNames(
                                  `${CLASSNAME}__header`,
                                  (forceHeaderDivider || hasTopIntersection) && `${CLASSNAME}__header--has-divider`,
                                  headerChildProps?.className,
                              )}
                          >
                              {header}
                              {headerChildContent}
                          </header>
                      )}

                      <div className={`${CLASSNAME}__content`}>
                          <div className={`${CLASSNAME}__sentinel ${CLASSNAME}__sentinel--top`} ref={setSentinelTop} />

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
                                  (forceFooterDivider || hasBottomIntersection) && `${CLASSNAME}__footer--has-divider`,
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

                      <div
                          className={`${CLASSNAME}__sentinel ${CLASSNAME}__sentinel--wrapper`}
                          ref={setSentinelWrapper}
                      />
                  </section>
              </div>,
              document.body,
          )
        : null;
};
Dialog.displayName = COMPONENT_NAME;
