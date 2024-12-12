import { handleBasicClasses } from '../../utils/_internal/className';
import { classNames } from '../../utils';
import { LumxClassName, GenericProps, HasTheme, JSXElement } from '../../types';
import { Typography } from '../../constants';

export interface InputLabelProps extends GenericProps, HasTheme {
    /** Typography variant. */
    typography?: Typography;
    /** Label content. */
    children: JSXElement;
    /** Native htmlFor property. */
    htmlFor: string;
    /** Whether the component is required or not. */
    isRequired?: boolean;
}

const COMPONENT_NAME = 'InputLabel';
const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-input-label';
const DEFAULT_PROPS: Partial<InputLabelProps> = {};

/**
 * InputLabel component.
 */
export function InputLabel(props: InputLabelProps) {
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
