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
const { block } = classNames.bem(CLASSNAME);
const DEFAULT_PROPS: Partial<InputLabelProps> = {};

export const InputLabel = (props: InputLabelProps) => {
    const { children, className, htmlFor, isRequired, theme, typography, ref, ...forwardedProps } = props;

    return (
        <label
            ref={ref}
            {...forwardedProps}
            htmlFor={htmlFor}
            className={classNames.join(
                className,
                block({
                    'is-required': isRequired,
                    [`theme-${theme}`]: Boolean(theme),
                    'has-custom-typography': Boolean(typography),
                }),
                typography && classNames.typography(typography),
            )}
        >
            {children}
        </label>
    );
};

InputLabel.displayName = COMPONENT_NAME;
InputLabel.className = CLASSNAME;
InputLabel.defaultProps = DEFAULT_PROPS;
