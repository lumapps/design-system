import React, { cloneElement, ReactNode, useMemo } from 'react';

import { mergeRefs } from '@lumx/react/utils/mergeRefs';

/**
 * Add ref and ARIA attribute(s) in tooltip children or wrapped children.
 * Button, IconButton, Icon and React HTML elements don't need to be wrapped but any other kind of children (array, fragment, custom components)
 * will be wrapped in a <span>.
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
    label?: string | null | false,
): ReactNode => {
    // Only add description when open
    const describedBy = isOpen ? id : undefined;

    return useMemo(() => {
        if (!label) return children;

        // Non-disabled element
        if (React.isValidElement(children) && children.props.disabled !== true && children.props.isDisabled !== true) {
            const ref = mergeRefs((children as any).ref, setAnchorElement);
            const props = { ...children.props, ref };

            // Add current tooltip to the aria-describedby if the label is not already present
            if (label !== props['aria-label'] && describedBy) {
                props['aria-describedby'] = [props['aria-describedby'], describedBy].filter(Boolean).join(' ');
            }

            return cloneElement(children, props);
        }

        return (
            <div className="lumx-tooltip-anchor-wrapper" ref={setAnchorElement} aria-describedby={describedBy}>
                {children}
            </div>
        );
    }, [children, setAnchorElement, describedBy, label]);
};
