import React, { cloneElement, ReactNode, useMemo } from 'react';

import { mergeRefs } from '@lumx/react/utils/mergeRefs';

interface Options {
    /** Original tooltip anchor */
    children: ReactNode;
    /** Set tooltip anchor element */
    setAnchorElement: (e: HTMLDivElement) => void;
    /** Whether the tooltip is open or not */
    isMounted: boolean | undefined;
    /** Tooltip id */
    id: string;
    /** Tooltip label*/
    label?: string | null | false;
    /** Choose how the tooltip text should link to the anchor */
    ariaLinkMode: 'aria-describedby' | 'aria-labelledby';
}

/**
 * Add ref and ARIA attribute(s) in tooltip children or wrapped children.
 * Button, IconButton, Icon and React HTML elements don't need to be wrapped but any other kind of children (array, fragment, custom components)
 * will be wrapped in a <span>.
 */
export const useInjectTooltipRef = (options: Options): ReactNode => {
    const { children, setAnchorElement, isMounted, id, label, ariaLinkMode } = options;
    // Only add link when mounted
    const linkId = isMounted ? id : undefined;

    return useMemo(() => {
        if (!label) return children;

        // Non-disabled element
        if (React.isValidElement(children) && children.props.disabled !== true && children.props.isDisabled !== true) {
            const ref = mergeRefs((children as any).ref, setAnchorElement);
            const props = { ...children.props, ref };

            // Do not add label/description if the tooltip label is already in aria-label
            if (linkId && label !== props['aria-label']) {
                if (props[ariaLinkMode]) props[ariaLinkMode] += ' ';
                else props[ariaLinkMode] = '';
                props[ariaLinkMode] += linkId;
            }

            return cloneElement(children, props);
        }

        const aria = linkId ? { [ariaLinkMode]: linkId } : undefined;
        return (
            <div className="lumx-tooltip-anchor-wrapper" ref={setAnchorElement} {...aria}>
                {children}
            </div>
        );
    }, [label, children, setAnchorElement, linkId, ariaLinkMode]);
};
