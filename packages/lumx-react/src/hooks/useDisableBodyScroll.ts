import { useEffect } from 'react';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
import { Falsy } from '@lumx/react/utils';

export const useDisableBodyScroll = (modalElement: Element | Falsy): void => {
    useEffect(() => {
        if (!modalElement) {
            return undefined;
        }
        disableBodyScroll(modalElement);
        return () => enableBodyScroll(modalElement);
    }, [modalElement]);
};
