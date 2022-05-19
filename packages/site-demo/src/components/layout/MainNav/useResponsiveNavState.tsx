import { useCallback, useRef, useState } from 'react';

export function useResponsiveNavState() {
    const openNavButtonRef = useRef<HTMLElement>(null);
    const closeNavButtonRef = useRef<HTMLElement>(null);
    const [isMenuOpen, setMenuOpen] = useState(false);
    const openMenu = useCallback((evt?: any) => {
        setMenuOpen(true);
        (document.activeElement as any)?.blur();
        // No pointer (keyboard nav) => focus the close nav button
        if (evt?.nativeEvent?.pointerType === '') {
            setTimeout(() => closeNavButtonRef.current?.focus(), 300);
        }
    }, []);
    const closeMenu = useCallback((evt?: any) => {
        setMenuOpen(false);
        (document.activeElement as any)?.blur();
        // No pointer (keyboard nav) => focus the open nav button
        if (evt?.nativeEvent?.pointerType === '') {
            setTimeout(() => openNavButtonRef.current?.focus(), 300);
        }
    }, []);
    return { openNavButtonRef, closeNavButtonRef, isMenuOpen, openMenu, closeMenu };
}
