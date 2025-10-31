import classNames from 'classnames';

import { Kind } from '@lumx/react';
import { GenericProps, HasTheme } from '@lumx/react/utils/type';
import { getRootClassName, handleBasicClasses } from '@lumx/react/utils/className';

import { INPUT_HELPER_CONFIGURATION } from './constants';

/**
 * Defines the props of the component.
 */
export interface InputHelperProps extends GenericProps, HasTheme {
    /** Helper variant. */
    kind?: Kind;
}

/**
 * Component display name.
 */
export const COMPONENT_NAME = 'InputHelper';

/**
 * Component default class name and class prefix.
 */
export const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * Component default props.
 */
export const DEFAULT_PROPS: Partial<InputHelperProps> = {
    kind: Kind.info,
};

/**
 * InputHelper component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const getProps = (props: InputHelperProps) => {
    const { className, kind = DEFAULT_PROPS.kind, theme } = props;
    const { color } = INPUT_HELPER_CONFIGURATION[kind as any] || {};

    return {
        className: classNames(className, handleBasicClasses({ prefix: CLASSNAME, color, theme })),
        color,
        kind,
        theme,
    };
};
