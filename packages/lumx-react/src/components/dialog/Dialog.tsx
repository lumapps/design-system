import React, { Children, ReactElement, ReactNode, RefObject, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import classNames from 'classnames';

import { Progress, ProgressVariant, Size } from '@lumx/react';

import { DIALOG_TRANSITION_DURATION } from '@lumx/react/constants';

import { COMPONENT_PREFIX } from '@lumx/react/constants';
import { useCallbackOnEscape } from '@lumx/react/hooks/useCallbackOnEscape';
import { useFocus } from '@lumx/react/hooks/useFocus';
import { useFocusTrap } from '@lumx/react/hooks/useFocusTrap';
import { useIntersectionObserver } from '@lumx/react/hooks/useIntersectionObserver';
import { GenericProps, getRootClassName, handleBasicClasses, isComponent, partitionMulti } from '@lumx/react/utils';
import { ClickAwayProvider } from '@lumx/react/utils/ClickAwayProvider';

import { useDelayedVisibility } from '@lumx/react/hooks/useDelayedVisibility';

/**
 * Defines the props of the component.
 */
interface DialogProps extends GenericProps {
    /** The elements to display in the footer part. */
    footer?: ReactNode;
    /** Whether the divider between the dialog content and the footer is always displayed (instead of showing it on scroll). */
    forceFooterDivider?: boolean;
    /** The elements to display in the header part. */
    header?: ReactNode;
    /** Whether the divider between the dialog content and the footer is always displayed (instead of showing it on scroll). */
    forceHeaderDivider?: boolean;
    /** Whether the indefinite progress indicator over the dialog content is displayed or not. */
    isLoading?: boolean;
    /** Whether the component is open or not. */
    isOpen?: boolean;
    /** The reference of the element that triggered modal opening to set focus on. */
    parentElement?: RefObject<HTMLElement>;
    /** The reference passed to the content. */
    contentRef?: RefObject<HTMLDivElement>;
    /** The reference of the element that should get the focus when the dialogs opens. By default, the first child will take focus. */
    focusElement?: RefObject<HTMLElement>;
    /** Whether to keep the dialog open on clickaway or escape press. */
    preventAutoClose?: boolean;
    /** The size variant of the component. */
    size?: DialogSizes;
    /** The z-axis position. */
    zIndex?: number;
    /** The function called on close. */
    onClose?(): void;
}

type DialogSizes = Size.tiny | Size.regular | Size.big | Size.huge;

const isHeader = isComponent('header');
const isFooter = isComponent('footer');

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}Dialog`;

/**
 * The default class name and classes prefix for this component.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
 */
const DEFAULT_PROPS: Partial<DialogProps> = {
    size: Size.big,
};

const Dialog: React.FC<DialogProps> = ({
    children,
    className,
    contentRef,
    focusElement,
    footer,
    forceFooterDivider,
    forceHeaderDivider,
    header,
    isLoading,
    isOpen,
    onClose,
    parentElement,
    preventAutoClose,
    size,
    zIndex,
    ...forwardedProps
}) => {
    useCallbackOnEscape(onClose, isOpen && !preventAutoClose);

    const wrapperRef = useRef<HTMLDivElement>(null);

    // Focus the parent element on close.
    useFocus(parentElement?.current, !Boolean(isOpen));

    // Handle focus trap.
    useFocusTrap(wrapperRef.current, focusElement?.current);

    const [sentinelTop, setSentinelTop] = useState<Element | null>(null);
    const [sentinelBottom, setSentinelBottom] = useState<Element | null>(null);
    const intersections = useIntersectionObserver([sentinelTop, sentinelBottom], {
        threshold: [0, 1],
    });

    const hasTopIntersection = !(intersections.get(sentinelTop!)?.isIntersecting ?? true);
    const hasBottomIntersection = !(intersections.get(sentinelBottom!)?.isIntersecting ?? true);

    // Separate header, footer and dialog content from children.
    const [[headerChild], [footerChild], content] = useMemo(
        () => partitionMulti(Children.toArray(children), [isHeader, isFooter]),
        [children],
    );
    const headerChildProps = (headerChild as ReactElement)?.props;
    const headerChildContent = headerChildProps?.children;
    const footerChildProps = (footerChild as ReactElement)?.props;
    const footerChildContent = footerChildProps?.children;

    const isVisible = useDelayedVisibility(Boolean(isOpen), DIALOG_TRANSITION_DURATION);

    return isOpen || isVisible
        ? createPortal(
              <div
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

                  <section className={`${CLASSNAME}__container`} role="dialog">
                      <ClickAwayProvider callback={!preventAutoClose && onClose} refs={[wrapperRef]}>
                          <div className={`${CLASSNAME}__wrapper`} ref={wrapperRef}>
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

                              <div ref={contentRef} className={`${CLASSNAME}__content`}>
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
                          </div>
                      </ClickAwayProvider>
                  </section>
              </div>,
              document.body,
          )
        : null;
};
Dialog.displayName = COMPONENT_NAME;
Dialog.defaultProps = DEFAULT_PROPS;

export { CLASSNAME, Dialog, DialogProps, DialogSizes };
