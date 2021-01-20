import { KeyboardEventHandler, MouseEventHandler, useMemo } from 'react';

interface Props {
    role: 'button';
    tabIndex: 0;
    onClick: MouseEventHandler;
    onKeyPress: KeyboardEventHandler;
}

export const useClickable = ({ onClick, onKeyPress }: { onClick?: any; onKeyPress?: any }): Props | undefined => {
    return useMemo(() => {
        if (!onClick) return undefined;

        return {
            role: 'button',
            tabIndex: 0,
            onClick,
            onKeyPress(event) {
                onKeyPress?.(event);
                if (event.key === 'Enter' || event.key === ' ') {
                    onClick?.();
                }
            },
        };
    }, [onClick, onKeyPress]);
};
