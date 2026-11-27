import React from 'react';
import { useTooltipContext } from '@lumx/react/components/tooltip/context';
import { getOverflowingText } from '@lumx/core/js/utils/browser/getOverflowingText';

/**
 * Compute a native `title` from the `innerText` of a label element when its text overflows.
 * Updates dynamically on content changes (but not on resize!)
 */
export const useOverflowTitle = (content: React.ReactNode) => {
    const parentTooltip = useTooltipContext();
    const [title, setTitle] = React.useState<string | undefined>(undefined);
    const [labelElement, setLabelElement] = React.useState<HTMLElement | null>(null);

    React.useLayoutEffect(() => {
        setTitle(parentTooltip ? undefined : getOverflowingText(labelElement));
    }, [labelElement, parentTooltip, content]);

    return { labelRef: setLabelElement, title };
};
