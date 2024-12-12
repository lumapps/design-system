import { handleBasicClasses } from '@lumx/core/js/utils/_internal/className';
import type { LumxClassName, GenericProps, HasTheme, JSX } from '../../types';
import { classNames } from '../../utils';
import { Kind } from '../../constants';
import { INPUT_HELPER_CONFIGURATION } from './constants';

/**
 * Defines the props of the component.
 */
export interface GenericInputHelperProps<C extends JSX.Node> extends GenericProps, HasTheme {
    /** Helper content. */
    children: C;
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
const DEFAULT_PROPS: Partial<GenericInputHelperProps<any>> = {
    kind: Kind.info,
};

/**
 * InputHelper component.
 */
export function InputHelper<C extends JSX.Node>(props: GenericInputHelperProps<C>) {
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
}

InputHelper.displayName = COMPONENT_NAME;
InputHelper.className = CLASSNAME;
InputHelper.defaultProps = DEFAULT_PROPS;
