import { WINDOW } from '@lumx/core/js/constants/browser';
import { useSyncExternalStore } from 'react';

// Demo "hash" nav link displaying a <a> with aria-current
export const HashNavLink = ({ className, hash, children }: any) => {
    const getSnapshot = () => (WINDOW?.location.hash || '#') === hash;
    const isActive = useSyncExternalStore(
        (listener) => {
            WINDOW?.addEventListener('hashchange', listener);
            return () => WINDOW?.removeEventListener('hashchange', listener);
        },
        getSnapshot,
        getSnapshot,
    );
    return (
        <a className={className} href={hash} aria-current={isActive ? 'page' : undefined}>
            {children}
        </a>
    );
};
