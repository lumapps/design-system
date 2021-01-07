import React, { forwardRef } from 'react';

import classNames from 'classnames';

import { Theme } from '@lumx/react';
import { Comp, GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

/**
 * Defines the props of the component.
 */
export interface DividerProps extends GenericProps {
    /** Theme adapting the component to light or dark background. */
    theme?: Theme;
}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'Divider';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * Component default props.
 */
export const DEFAULT_PROPS: Partial<DividerProps> = {
    theme: Theme.light,
};

/**
 * Divider component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const Divider: Comp<DividerProps, HTMLHRElement> = forwardRef((props, ref) => {
    const { className, theme, ...forwardedProps } = props;

    return (
        <hr
            ref={ref}
            {...forwardedProps}
            className={classNames(className, handleBasicClasses({ prefix: CLASSNAME, theme }))}
        />
    );
});
Divider.displayName = COMPONENT_NAME;
Divider.className = CLASSNAME;
Divider.defaultProps = DEFAULT_PROPS;
