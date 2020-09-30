import React, { ReactNode } from 'react';

import classNames from 'classnames';

import { COMPONENT_PREFIX } from '@lumx/react/constants';

import { GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

/**
 * Defines the props of the component.
 */
interface ToolbarProps extends GenericProps {
    /** A component to be rendered after the content. */
    after?: ReactNode;
    /** A component to be rendered before the content. */
    before?: ReactNode;
    /** The label of the toolbar. */
    label?: ReactNode;
}

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}Toolbar`;

/**
 * The default class name and classes prefix for this component.
 */
const CLASSNAME: string = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
 */
const DEFAULT_PROPS: Partial<ToolbarProps> = {};

const Toolbar: React.FC<ToolbarProps> = ({ after, before, className, label, ...forwardedProps }) => {
    return (
        <div
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
};
Toolbar.displayName = COMPONENT_NAME;
Toolbar.defaultProps = DEFAULT_PROPS;

export { CLASSNAME, Toolbar, ToolbarProps };
