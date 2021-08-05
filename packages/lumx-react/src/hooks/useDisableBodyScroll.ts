import { useEffect } from 'react';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
import { Falsy } from '@lumx/react/utils';

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
            document.documentElement.style.overflow = previousDocumentOverflow;
        };
    }, [modalElement]);
};
