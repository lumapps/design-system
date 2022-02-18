import { useEffect } from 'react';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
import { Falsy } from '@lumx/react/utils';

/**
 * Disables the scroll on the body to make it only usable in the current modal element.
 * When the modal element is not provided anymore, the scroll is restored.
 *
 * @param modalElement The modal element.
 */
export const useDisableBodyScroll = (modalElement: Element | Falsy): void => {
    useEffect(() => {
        if (!modalElement) {
            return undefined;
        }
        // Fixing the document overflow style to prevent a bug that scrolls the window to the top.
        const previousDocumentOverflow = document.documentElement.style.overflow;
        document.documentElement.style.overflow = 'visible';
        disableBodyScroll(modalElement);
        return () => {
            enableBodyScroll(modalElement);
            // Restore the previous overflow style.
            requestAnimationFrame(() => {
                document.documentElement.style.overflow = previousDocumentOverflow;
            });
        };
    }, [modalElement]);
};
