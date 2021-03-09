import React, { Children, forwardRef, ReactElement, ReactNode, RefObject, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import classNames from 'classnames';

import { Progress, ProgressVariant, Size } from '@lumx/react';

import { DIALOG_TRANSITION_DURATION, DOCUMENT } from '@lumx/react/constants';
import { useCallbackOnEscape } from '@lumx/react/hooks/useCallbackOnEscape';
import { useFocusTrap } from '@lumx/react/hooks/useFocusTrap';
import { useIntersectionObserver } from '@lumx/react/hooks/useIntersectionObserver';
import {
    Comp,
    GenericProps,
    getRootClassName,
    handleBasicClasses,
    isComponent,
    partitionMulti,
} from '@lumx/react/utils';
import { ClickAwayProvider } from '@lumx/react/utils/ClickAwayProvider';

import { useDelayedVisibility } from '@lumx/react/hooks/useDelayedVisibility';
import { useDisableBodyScroll } from '@lumx/react/hooks/useDisableBodyScroll';
import { IntersectionContext } from './intersection-context';
import { DialogHeader } from './DialogHeader';
import { DialogContent } from './DialogContent';
import { DialogFooter } from './DialogFooter';

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
    contentRef?: RefObject<HTMLDivElement>;
    /** Reference to the of the element that should get the focus when the dialogs opens. By default, the first child will take focus. */
    focusElement?: RefObject<HTMLElement>;
    /** Whether to keep the dialog open on clickaway or escape press. */
    preventAutoClose?: boolean;
    /** Size variant. */
    size?: DialogSizes;
    /** Z-axis position. */
    zIndex?: number;
    /** Z-axis position. */
    dialogProps?: GenericProps;
    /** On close callback. */
    onClose?(): void;
}

export type DialogSizes = Extract<Size, 'tiny' | 'regular' | 'big' | 'huge'>;

const isHeader = (component: ReactNode) => isComponent('header')(component) || isComponent('DialogHeader')(component);
const isFooter = (component: ReactNode) => isComponent('footer')(component) || isComponent('DialogFooter')(component);

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
};

/**
 * Dialog component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const Dialog: Comp<DialogProps, HTMLDivElement> = forwardRef((props, ref) => {
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
        size,
        zIndex,
        dialogProps,
        wrapContent = true,
        ...forwardedProps
    } = props;

    const handleClose = onClose
        ? () => {
              onClose();
              // Focus the parent element on close.
              if (parentElement && parentElement.current) {
                  parentElement.current.focus();
              }
          }
        : undefined;

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useCallbackOnEscape(handleClose, isOpen && !preventAutoClose);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Handle focus trap.
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useFocusTrap(wrapperRef.current, focusElement?.current);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useDisableBodyScroll(isOpen && wrapperRef.current);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [sentinelTop, setSentinelTop] = useState<Element | null>(null);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [sentinelBottom, setSentinelBottom] = useState<Element | null>(null);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const intersections = useIntersectionObserver([sentinelTop, sentinelBottom], {
        threshold: [0, 1],
    });

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
    const isVisible = useDelayedVisibility(Boolean(isOpen), DIALOG_TRANSITION_DURATION);

    return isOpen || isVisible
        ? createPortal(
              <div
                  ref={ref}
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

                  <section className={`${CLASSNAME}__container`} {...dialogProps}>
                      <ClickAwayProvider callback={!preventAutoClose && handleClose} refs={[wrapperRef]}>
                          <div role="dialog" aria-modal="true" className={`${CLASSNAME}__wrapper`} ref={wrapperRef}>
                              <IntersectionContext.Provider
                                  value={{
                                      intersections,
                                      sentinelTop,
                                      sentinelBottom,
                                      setSentinelTop,
                                      setSentinelBottom,
                                  }}
                              >
                                  {(header || headerChildContent) && (
                                      <DialogHeader forceDivider={forceHeaderDivider} {...headerChildProps}>
                                          {header}
                                          {headerChildContent}
                                      </DialogHeader>
                                  )}

                                  {wrapContent ? <DialogContent ref={contentRef}>{content}</DialogContent> : content}

                                  {(footer || footerChildContent) && (
                                      <DialogFooter forceDivider={forceFooterDivider} {...footerChildContent}>
                                          {footer}
                                          {footerChildContent}
                                      </DialogFooter>
                                  )}

                                  {isLoading && (
                                      <div className={`${CLASSNAME}__progress-overlay`}>
                                          <Progress variant={ProgressVariant.circular} />
                                      </div>
                                  )}
                              </IntersectionContext.Provider>
                          </div>
                      </ClickAwayProvider>
                  </section>
              </div>,
              document.body,
          )
        : null;
});
Dialog.displayName = COMPONENT_NAME;
Dialog.className = CLASSNAME;
Dialog.defaultProps = DEFAULT_PROPS;
