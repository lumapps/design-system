import classNames from 'classnames';

import { Theme, Kind } from '../../constants';
import { GenericProps, HasTheme } from '../../types';
import { getRootClassName, handleBasicClasses } from '../../utils/className';

export const INPUT_HELPER_CONFIGURATION: Record<string, { color: string }> = {
    error: {
        color: 'red',
    },
    success: {
        color: 'green',
    },
    warning: {
        color: 'yellow',
    },
};

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
const COMPONENT_NAME = 'InputHelper';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * Component default props.
 */
const DEFAULT_PROPS: Partial<InputHelperProps> = {
    kind: Kind.info,
};

/**
 * InputHelper component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const InputHelper = (props: InputHelperProps, options) => {
    const defaultTheme = Theme.light;
    const { className, kind = DEFAULT_PROPS.kind, theme = defaultTheme, ...forwardedProps } = props;
    const childrenToRender = options && options.slots && options.slots.default ? options.slots.default() : props.children;
    const { color } = INPUT_HELPER_CONFIGURATION[kind as any] || {};

    return (
        <p
            {...forwardedProps}
            className={classNames(className, handleBasicClasses({ prefix: CLASSNAME, color, theme }))}
        >
            {childrenToRender}
        </p>
    );
};

InputHelper.displayName = COMPONENT_NAME;
InputHelper.className = CLASSNAME;
InputHelper.defaultProps = DEFAULT_PROPS;
