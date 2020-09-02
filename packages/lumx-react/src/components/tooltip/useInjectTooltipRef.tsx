import { mergeRefs } from '@lumx/react/utils/mergeRefs';
import get from 'lodash/get';
import React, { ReactNode, cloneElement, useMemo } from 'react';

/**
 * Add ref and ARIA attribute(s) in tooltip children or wrapped children.
 * Button, IconButton, Icon and React HTML elements don't need to be wrapped but any other kind of children (array, fragment, custom components)
 * will be wrapped in a <span>.
 *
 * @param  children         Original tooltip anchor.
 * @param  setAnchorElement Set tooltip anchor element.
 * @param  isOpen           Whether the tooltip is open or not.
 * @param  id               Tooltip id.
 * @return tooltip anchor.
 */
export const useInjectTooltipRef = (
    children: any,
    setAnchorElement: (e: HTMLDivElement) => void,
    isOpen: boolean,
    id: string,
): ReactNode => {
    return useMemo(() => {
        const ariaProps = { 'aria-describedby': isOpen ? id : undefined };
        if (
            children &&
            get(children, '$$typeof') &&
            get(children, 'props.disabled') !== true &&
            get(children, 'props.isDisabled') !== true
        ) {
            const type = get(children, 'type');

            // Base React HTML element.
            if (typeof type === 'string') {
                if (children.ref) {
                    setAnchorElement(children.ref.current);
                }
                return cloneElement(children, {
                    ...children.props,
                    ...ariaProps,
                    ref: mergeRefs(children.ref, setAnchorElement),
                });
            }

            // Button, IconButton
            if (type?.displayName === 'Button' || type?.displayName === 'IconButton') {
                return cloneElement(children, {
                    ...children.props,
                    ...ariaProps,
                    buttonRef: mergeRefs(children.props.buttonRef, setAnchorElement),
                });
            }

            // Icon
            if (type?.displayName === 'Icon') {
                return cloneElement(children, {
                    ...children.props,
                    ...ariaProps,
                    iconRef: mergeRefs(children.props.iconRef, setAnchorElement),
                });
            }
        }
        return (
            <div className="lumx-tooltip-anchor-wrapper" ref={setAnchorElement} {...ariaProps}>
                {children}
            </div>
        );
    }, [children, isOpen, id]);
};
