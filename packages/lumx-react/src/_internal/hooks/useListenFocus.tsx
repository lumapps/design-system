import { RefObject, useEffect, useState } from 'react';

/**
 * Listen on element focus to store the focus status.
 */
export function useListenFocus(ref: RefObject<HTMLElement>) {
    const [isFocus, setFocus] = useState(false);

    useEffect(() => {
        const { current: element } = ref;
        if (!element) {
            return undefined;
        }

        const onFocus = () => setFocus(true);
        const onBlur = () => setFocus(false);
        element.addEventListener('focus', onFocus);
        element.addEventListener('blur', onBlur);
        return () => {
            element.removeEventListener('focus', onFocus);
            element.removeEventListener('blur', onBlur);
        };
    }, [ref, setFocus]);

    return isFocus;
}
