import { RefObject, useRef, useEffect } from 'react';

import { HeadingLevelProvider, IconButton, IconButtonProps } from '@lumx/react';
import { DIALOG_TRANSITION_DURATION } from '@lumx/react/constants';
import { GenericProps } from '@lumx/react/utils/type';

import { useFocusTrap } from '@lumx/react/hooks/useFocusTrap';
import { useDisableBodyScroll } from '@lumx/react/hooks/useDisableBodyScroll';
import { ClickAwayProvider } from '@lumx/react/utils/ClickAwayProvider';
import { mergeRefs } from '@lumx/react/utils/react/mergeRefs';
import { useCallbackOnEscape } from '@lumx/react/hooks/useCallbackOnEscape';
import { useTransitionVisibility } from '@lumx/react/hooks/useTransitionVisibility';
import { ThemeProvider } from '@lumx/react/utils/theme/ThemeContext';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';

import { Portal } from '@lumx/react/utils';

import { Lightbox as UI, BaseLightboxProps as UIProps } from '@lumx/core/js/components/Lightbox';
import { ReactToJSX } from '@lumx/react/utils/type/ReactToJSX';

import { DIALOG_LABEL_KEY } from '@lumx/core/js/components/Dialog/constants';
import { useRegisteredId } from '@lumx/react/utils/IdsRegistryContext';

/**
 * Defines the props of the component.
 */
export interface LightboxProps extends GenericProps, ReactToJSX<UIProps> {
    /** Props to pass to the close button (minus those already set by the Lightbox props). */
    closeButtonProps?: Pick<IconButtonProps, 'label'> &
        Omit<IconButtonProps, 'label' | 'onClick' | 'icon' | 'emphasis' | 'color'>;
    /** Reference to the element that triggered modal opening to set focus on. */
    parentElement: RefObject<any>;
    /** Reference to the element that should get the focus when the lightbox opens. By default, the close button or the lightbox itself will take focus. */
    focusElement?: RefObject<HTMLElement>;
    /** On close callback. */
    onClose?(): void;
    /** Children */
    children?: React.ReactNode;
}

/**
 * Renders the core Lightbox UI, resolving its `aria-labelledby` from the ids registry.
 *
 * Must render as a descendant of the `IdsRegistryProvider` set up by `Lightbox` (which is why it is
 * its own component: the subscription hook needs to run below the provider). Internal to the
 * lightbox family - not exported from the package barrel.
 */
export const LightboxContent = forwardRef<LightboxProps, HTMLDivElement>((props, ref) => {
    const {
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

    const childrenRef = useRef<any>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);

    useDisableBodyScroll(isOpen && wrapperRef.current);

    const isVisible = useTransitionVisibility(wrapperRef, !!isOpen, DIALOG_TRANSITION_DURATION);

    // Handle focus trap.
    useFocusTrap(
        // Focus trap zone
        isOpen && wrapperRef.current,
        // Focus element (fallback on close button and then on the dialog)
        focusElement?.current || closeButtonRef.current || wrapperRef.current,
    );

    const previousOpen = useRef(isOpen);

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
    useCallbackOnEscape(onClose);

    const clickAwayRefs = useRef([wrapperRef]);

    const labelId = useRegisteredId(DIALOG_LABEL_KEY);

    if (!isOpen && !isVisible) return null;

    return UI({
        ClickAwayProvider,
        HeadingLevelProvider,
        IconButton,
        parentElement,
        Portal,
        ThemeProvider,
        children,
        childrenRef,
        className,
        clickAwayRefs,
        closeButtonProps,
        closeButtonRef,
        focusElement,
        isOpen,
        isVisible,
        labelId,
        ref: mergeRefs(ref, wrapperRef),
        theme,
        zIndex,
        preventAutoClose,
        handleClose: onClose,
        ...forwardedProps,
    });
});
