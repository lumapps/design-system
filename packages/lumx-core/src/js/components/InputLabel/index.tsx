import type { JSX } from '@lumx/core/js/types/jsx/jsx-runtime';
import { handleBasicClasses } from '../../utils/_internal/className';
import { classNames } from '../../utils';
import { LumxClassName, GenericProps, HasTheme } from '../../types';
import { Typography } from '../../constants';

export interface GenericInputLabelProps<C extends JSX.Node> extends GenericProps, HasTheme {
    /** Typography variant. */
    typography?: Typography;
    /** Label content. */
    children: C;
    /** Native htmlFor property. */
    htmlFor: string;
    /** Whether the component is required or not. */
    isRequired?: boolean;
}

const COMPONENT_NAME = 'InputLabel';
const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-input-label';
const DEFAULT_PROPS: Partial<GenericInputLabelProps<any>> = {};

/**
 * InputLabel component.
 */
export function InputLabel<C extends JSX.Node>(props: GenericInputLabelProps<C>) {
    const { children, className, htmlFor, isRequired, theme, typography, ref, ...forwardedProps } = props;

    return (
        <label
            ref={ref}
            {...forwardedProps}
            htmlFor={htmlFor}
            className={classNames.join(
                className,
                handleBasicClasses({
                    prefix: CLASSNAME,
                    isRequired,
                    theme,
                    hasCustomTypography: Boolean(typography),
                }),
                typography && classNames.typography(typography),
            )}
        >
            {children}
        </label>
    );
}

InputLabel.displayName = COMPONENT_NAME;
InputLabel.className = CLASSNAME;
InputLabel.defaultProps = DEFAULT_PROPS;
