import type { ReactNode } from 'react';

import { handleBasicClasses } from '@lumx/core/js/utils/_internal/className';
import type { LumxClassName, GenericProps, HasTheme } from '../../types';
import { classNames } from '../../utils';
import { Kind } from '../../constants';

/**
 * Defines the props of the component.
 */
export interface InputHelperProps extends GenericProps, HasTheme {
    /** Helper content. */
    children: ReactNode | string;
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
const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-input-helper';

/**
 * Component default props.
 */
const DEFAULT_PROPS: Partial<InputHelperProps> = {
    kind: Kind.info,
};

const INPUT_HELPER_CONFIGURATION: Record<string, { color: string }> = {
    [Kind.error]: {
        color: 'red',
    },
    [Kind.success]: {
        color: 'green',
    },
    [Kind.warning]: {
        color: 'yellow',
    },
};

/**
 * InputHelper component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const InputHelper = (props: InputHelperProps) => {
    const { children, className, kind = DEFAULT_PROPS.kind, theme, ref, ...forwardedProps } = props;
    const { color } = INPUT_HELPER_CONFIGURATION[kind as string] || {};

    return (
        <p
            ref={ref}
            {...forwardedProps}
            className={classNames.join(className, handleBasicClasses({ prefix: CLASSNAME, color, theme }))}
        >
            {children}
        </p>
    );
};

InputHelper.displayName = COMPONENT_NAME;
InputHelper.className = CLASSNAME;
InputHelper.defaultProps = DEFAULT_PROPS;
