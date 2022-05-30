import { useBooleanState } from '@lumx/react/hooks/useBooleanState';
import { useEffect } from 'react';
import { WINDOW } from '@lumx/react/constants';

/**
 * Hook returning true if the component is rendered on the server.
 * This will first return `true` even if the component is rendered in the browser and then will update to `false` on
 * a second render.
 * It is a necessary step to comply with React SSR hydration rules.
 */
export const useIsServerSide = () => {
    const [isServerSide, setFalse, setTrue] = useBooleanState(true);

    useEffect(() => {
        if (WINDOW) setFalse();
        else setTrue();
    }, [setFalse, setTrue]);

    return isServerSide;
};
