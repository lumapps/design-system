import { mergeRefs } from '@lumx/react/utils/mergeRefs';
import get from 'lodash/get';
import React, { cloneElement, ReactNode, useMemo } from 'react';

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
    children: ReactNode,
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
                const element = children as any;
                if (element.ref) {
                    setAnchorElement(element.ref.current);
                }
                return cloneElement(element, {
                    ...element.props,
                    ...ariaProps,
                    ref: mergeRefs(element.ref, setAnchorElement),
                });
            }

            // Button, IconButton
            if (
                type?.displayName === 'Button' ||
                type?.displayName === 'ButtonRoot' ||
                type?.displayName === 'IconButton'
            ) {
                const element = children as any;
                return cloneElement(element, {
                    ...element.props,
                    ...ariaProps,
                    buttonRef: mergeRefs(element.props.buttonRef, setAnchorElement),
                });
            }

            // Icon
            if (type?.displayName === 'Icon') {
                const element = children as any;
                return cloneElement(element, {
                    ...element.props,
                    ...ariaProps,
                    iconRef: mergeRefs(element.props.iconRef, setAnchorElement),
                });
            }
        }
        return (
            <div className="lumx-tooltip-anchor-wrapper" ref={setAnchorElement} {...ariaProps}>
                {children}
            </div>
        );
    }, [isOpen, id, children, setAnchorElement]);
};
