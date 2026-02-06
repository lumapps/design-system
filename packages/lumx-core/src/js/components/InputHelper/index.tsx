import { classNames } from '../../utils';
import { Kind } from '../../constants';
import { INPUT_HELPER_CONFIGURATION } from './constants';
import type { LumxClassName, HasTheme, JSXElement, HasClassName, CommonRef } from '../../types';

export const COMPONENT_NAME = 'InputHelper';
export const InputHelperClassName: LumxClassName<typeof COMPONENT_NAME> = 'lumx-input-helper';

/**
 * Defines the props of the component.
 */
export interface InputHelperProps extends HasClassName, HasTheme {
    /** Helper content. */
    children: JSXElement;
    /** Helper variant. */
    kind?: Kind;
    /** ref to the root element `p` */
    ref?: CommonRef;
}

const CLASSNAME = InputHelperClassName;
const { block } = classNames.bem(CLASSNAME);

/**
 * Component default props.
 */
const DEFAULT_PROPS: Partial<InputHelperProps> = {
    kind: Kind.info,
};

/**
 * InputHelper component.
 */
export function InputHelper(props: InputHelperProps) {
    const { children, className, kind = DEFAULT_PROPS.kind, theme, ref, ...forwardedProps } = props;
    const { color } = INPUT_HELPER_CONFIGURATION[kind as string] || {};

    return (
        <p
            ref={ref}
            {...forwardedProps}
            className={classNames.join(
                className,
                block({
                    [`color-${color}`]: Boolean(color),
                    [`theme-${theme}`]: Boolean(theme),
                }),
            )}
        >
            {children}
        </p>
    );
}

InputHelper.displayName = COMPONENT_NAME;
InputHelper.className = CLASSNAME;
InputHelper.defaultProps = DEFAULT_PROPS;
