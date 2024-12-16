import React, { ReactNode } from 'react';

import classNames from 'classnames';

import { GenericProps } from '@lumx/react/utils/type';
import { getRootClassName, handleBasicClasses } from '@lumx/react/utils/className';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';

/**
 * Defines the props of the component.
 */
export interface ToolbarProps extends GenericProps {
    /** After content (placed after the label). */
    after?: ReactNode;
    /** Before content (placed before the label). */
    before?: ReactNode;
    /** Label content. */
    label?: ReactNode;
}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'Toolbar';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * Component default props.
 */
const DEFAULT_PROPS: Partial<ToolbarProps> = {};

/**
 * Toolbar component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const Toolbar = forwardRef<ToolbarProps, HTMLDivElement>((props, ref) => {
    const { after, before, className, label, ...forwardedProps } = props;

    return (
        <div
            ref={ref}
            {...forwardedProps}
            className={classNames(
                className,
                handleBasicClasses({
                    hasAfter: Boolean(after),
                    hasBefore: Boolean(before),
                    hasLabel: Boolean(label),
                    prefix: CLASSNAME,
                }),
            )}
        >
            {before && <div className={`${CLASSNAME}__before`}>{before}</div>}
            {label && <div className={`${CLASSNAME}__label`}>{label}</div>}
            {after && <div className={`${CLASSNAME}__after`}>{after}</div>}
        </div>
    );
});
Toolbar.displayName = COMPONENT_NAME;
Toolbar.className = CLASSNAME;
Toolbar.defaultProps = DEFAULT_PROPS;
