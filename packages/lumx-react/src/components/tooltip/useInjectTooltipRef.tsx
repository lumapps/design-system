import React, { cloneElement, ReactNode, useMemo } from 'react';

import { useMergeRefs } from '@lumx/react/utils/mergeRefs';

/**
 * Add ref and ARIA attribute(s) in tooltip children or wrapped children.
 * Button, IconButton, Icon and React HTML elements don't need to be wrapped but any other kind of children (array, fragment, custom components)
 * will be wrapped.
 *
 * @param  children         Original tooltip anchor.
 * @param  setAnchorElement Set tooltip anchor element.
 * @param  isOpen           Whether the tooltip is open or not.
 * @param  id               Tooltip id.
 * @param  label            Tooltip label.
 * @return tooltip anchor.
 */
export const useInjectTooltipRef = (
    children: ReactNode,
    setAnchorElement: (e: HTMLDivElement) => void,
    isOpen: boolean | undefined,
    id: string,
    label: string,
): ReactNode => {
    const element = React.isValidElement(children) ? (children as any) : null;
    const ref = useMergeRefs(element?.ref, setAnchorElement);

    return useMemo(() => {
        // Non-disabled element
        if (element && element.props?.disabled !== true && element.props?.isDisabled !== true) {
            const props = { ...element.props, ref };

            // Add current tooltip to the aria-describedby if the label is not already present
            if (label !== props['aria-label']) {
                props['aria-describedby'] = [props['aria-describedby'], id].filter(Boolean).join(' ');
            }

            return cloneElement(element, props);
        }

        // Else add a wrapper around the children
        return (
            <div className="lumx-tooltip-anchor-wrapper" ref={ref} aria-describedby={isOpen ? id : undefined}>
                {children}
            </div>
        );
    }, [element, children, isOpen, id, ref, label]);
};
