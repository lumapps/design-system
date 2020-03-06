import React, { ReactNode } from 'react';

import classNames from 'classnames';

import { COMPONENT_PREFIX } from '@lumx/react/constants';

import { GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

/**
 * Defines the props of the component.
 */
export interface ToolbarProps extends GenericProps {
    /** Slot for the right element. */
    after?: ReactNode;
    /** Slot for the left element. */
    before?: ReactNode;
    /** Slot fo the main title element. */
    label?: ReactNode;
}

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}Toolbar`;

/**
 * The default class name and classes prefix for this component.
 */
export const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
 */
export const DEFAULT_PROPS: Partial<ToolbarProps> = {};

/**
 * Toolbar component.
 *
 * @return The component.
 */
export const Toolbar: React.FC<ToolbarProps> = ({ after, before, className, label, ...props }) => {
    return (
        <div
            className={classNames(
                className,
                handleBasicClasses({
                    hasAfter: Boolean(after),
                    hasBefore: Boolean(before),
                    hasLabel: Boolean(label),
                    prefix: CLASSNAME,
                }),
            )}
            {...props}
        >
            {before && <div className={`${CLASSNAME}__before`}>{before}</div>}
            {label && <div className={`${CLASSNAME}__label`}>{label}</div>}
            {after && <div className={`${CLASSNAME}__after`}>{after}</div>}
        </div>
    );
};
Toolbar.displayName = COMPONENT_NAME;
