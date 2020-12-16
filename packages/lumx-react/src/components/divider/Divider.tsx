import React, { forwardRef } from 'react';

import classNames from 'classnames';

import { Theme } from '@lumx/react';
import { COMPONENT_PREFIX } from '@lumx/react/constants';
import { Comp, GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

/**
 * Defines the props of the component.
 */
export interface DividerProps extends GenericProps {
    /** The theme to apply to the component. Can be either 'light' or 'dark'. */
    theme?: Theme;
}

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}Divider`;

/**
 * The default class name and classes prefix for this component.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
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
