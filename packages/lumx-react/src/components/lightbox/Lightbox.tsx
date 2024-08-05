import React, { forwardRef, RefObject, useRef, useEffect, AriaAttributes } from 'react';

import classNames from 'classnames';
import { createPortal } from 'react-dom';

import { mdiClose } from '@lumx/icons';
import { IconButton, IconButtonProps } from '@lumx/react';
import { DIALOG_TRANSITION_DURATION, DOCUMENT } from '@lumx/react/constants';
import { Comp, GenericProps, HasTheme } from '@lumx/react/utils/type';
import { getRootClassName, handleBasicClasses } from '@lumx/react/utils/className';

import { useFocusTrap } from '@lumx/react/hooks/useFocusTrap';
import { useDisableBodyScroll } from '@lumx/react/hooks/useDisableBodyScroll';
import { ClickAwayProvider } from '@lumx/react/utils/ClickAwayProvider';
import { mergeRefs } from '@lumx/react/utils/mergeRefs';
import { useCallbackOnEscape } from '@lumx/react/hooks/useCallbackOnEscape';
import { useTransitionVisibility } from '@lumx/react/hooks/useTransitionVisibility';

/**
 * Defines the props of the component.
 */
export interface LightboxProps extends GenericProps, HasTheme, Pick<AriaAttributes, 'aria-label' | 'aria-labelledby'> {
    /** Props to pass to the close button (minus those already set by the Lightbox props). */
    closeButtonProps?: Pick<IconButtonProps, 'label'> &
        Omit<IconButtonProps, 'label' | 'onClick' | 'icon' | 'emphasis' | 'color'>;
    /** Whether the component is open or not. */
    isOpen?: boolean;
    /** Reference to the element that triggered modal opening to set focus on. */
    parentElement: RefObject<any>;
    /** Reference to the element that should get the focus when the lightbox opens. By default, the close button or the lightbox itself will take focus. */
    focusElement?: RefObject<HTMLElement>;
    /** Whether to keep the dialog open on clickaway or escape press. */
    preventAutoClose?: boolean;
    /** Z-axis position. */
    zIndex?: number;
    /** On close callback. */
    onClose?(): void;
}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'Lightbox';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * Lightbox component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const Lightbox: Comp<LightboxProps, HTMLDivElement> = forwardRef((props, ref) => {
    const {
        'aria-labelledby': propAriaLabelledBy,
        ariaLabelledBy = propAriaLabelledBy,
        'aria-label': propAriaLabel,
        ariaLabel = propAriaLabel,
        children,
        className,
        closeButtonProps,
        isOpen,
        onClose,
        parentElement,
        focusElement,
        preventAutoClose,
        theme,
        zIndex,
        ...forwardedProps
    } = props;
    if (!DOCUMENT) {
        // Can't render in SSR.
        return null;
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const childrenRef = useRef<any>(null);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const wrapperRef = useRef<HTMLDivElement>(null);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const closeButtonRef = useRef<HTMLButtonElement>(null);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useDisableBodyScroll(isOpen && wrapperRef.current);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const isVisible = useTransitionVisibility(wrapperRef, !!isOpen, DIALOG_TRANSITION_DURATION);

    // Handle focus trap.
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useFocusTrap(
        // Focus trap zone
        isOpen && wrapperRef.current,
        // Focus element (fallback on close button and then on the dialog)
        focusElement?.current || closeButtonRef.current || wrapperRef.current,
    );

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const previousOpen = useRef(isOpen);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        if (isOpen !== previousOpen.current) {
            previousOpen.current = isOpen;

            // Focus the parent element on close.
            if (!isOpen && parentElement && parentElement.current) {
                parentElement.current.focus();
            }
        }
    }, [isOpen, parentElement]);

    // Close lightbox on escape key pressed.
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useCallbackOnEscape(onClose);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const clickAwayRefs = useRef([wrapperRef]);

    if (!isOpen && !isVisible) return null;

    return createPortal(
        /* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */
        <div
            ref={mergeRefs(ref, wrapperRef)}
            {...forwardedProps}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledBy}
            aria-modal="true"
            role="dialog"
            tabIndex={-1}
            className={classNames(
                className,
                handleBasicClasses({
                    prefix: CLASSNAME,
                    isHidden: !isOpen,
                    isShown: isOpen || isVisible,
                    theme,
                }),
            )}
            style={{ zIndex }}
        >
            {closeButtonProps && (
                <div className={`${CLASSNAME}__close`}>
                    <IconButton
                        {...closeButtonProps}
                        ref={closeButtonRef}
                        emphasis="low"
                        hasBackground
                        icon={mdiClose}
                        theme="dark"
                        type="button"
                        onClick={onClose}
                    />
                </div>
            )}
            <ClickAwayProvider callback={!preventAutoClose && onClose} childrenRefs={clickAwayRefs}>
                <div ref={childrenRef} className={`${CLASSNAME}__wrapper`} role="presentation">
                    {children}
                </div>
            </ClickAwayProvider>
        </div>,
        document.body,
    );
});
Lightbox.displayName = COMPONENT_NAME;
Lightbox.className = CLASSNAME;
