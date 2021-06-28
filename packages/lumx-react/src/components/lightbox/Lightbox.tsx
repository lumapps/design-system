import React, { forwardRef, RefObject, useRef } from 'react';

import classNames from 'classnames';
import { createPortal } from 'react-dom';

import { mdiClose } from '@lumx/icons';
import { ColorPalette, Emphasis, IconButton, IconButtonProps, Theme } from '@lumx/react';
import { DOCUMENT } from '@lumx/react/constants';
import { Comp, GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

import { useFocusTrap } from '@lumx/react/hooks/useFocusTrap';
import { useDelayedVisibility } from '@lumx/react/hooks/useDelayedVisibility';
import { useFocus } from '@lumx/react/hooks/useFocus';
import { useDisableBodyScroll } from '@lumx/react/hooks/useDisableBodyScroll';
import { ClickAwayProvider } from '@lumx/react/utils/ClickAwayProvider';
import { mergeRefs } from '@lumx/react/utils/mergeRefs';
import { useCallbackOnEscape } from '@lumx/react/hooks/useCallbackOnEscape';

const LIGHTBOX_TRANSITION_DURATION = 400;

/**
 * Defines the props of the component.
 */
export interface LightboxProps extends GenericProps {
    /** Props to pass to the close button (minus those already set by the Lightbox props). */
    closeButtonProps?: Pick<IconButtonProps, 'label'> &
        Omit<IconButtonProps, 'label' | 'onClick' | 'icon' | 'emphasis' | 'color'>;
    /** Whether the component is open or not. */
    isOpen?: boolean;
    /** Reference to the element that triggered modal opening to set focus on. */
    parentElement: RefObject<any>;
    /** Whether to keep the dialog open on clickaway or escape press. */
    preventAutoClose?: boolean;
    /** Theme adapting the component to light or dark background. */
    theme?: Theme;
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
        ariaLabel,
        children,
        className,
        closeButtonProps,
        isOpen,
        onClose,
        parentElement,
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
    useDisableBodyScroll(isOpen && wrapperRef.current);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const isVisible = useDelayedVisibility(!!isOpen, LIGHTBOX_TRANSITION_DURATION);

    // Handle focus trap.
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useFocusTrap(wrapperRef.current, childrenRef.current?.firstChild);

    // Focus the parent element on close.
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useFocus(parentElement?.current, !isOpen);

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
            aria-modal="true"
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
                <IconButton
                    {...closeButtonProps}
                    className={`${CLASSNAME}__close`}
                    color={ColorPalette.light}
                    emphasis={Emphasis.low}
                    icon={mdiClose}
                    theme={theme}
                    type="button"
                    onClick={onClose}
                />
            )}
            <ClickAwayProvider callback={!preventAutoClose && onClose} refs={clickAwayRefs}>
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
