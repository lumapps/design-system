import type { JSXElement, LumxClassName, HasClassName, CommonRef } from '../../types';
import { classNames } from '../../utils';

/**
 * Defines the props of the component.
 */
export interface RadioGroupProps extends HasClassName {
    /** RadioButton elements */
    children?: JSXElement;
    /** reference to the root element */
    ref?: CommonRef;
}

/**
 * Component display name.
 */
export const COMPONENT_NAME = 'RadioGroup';

/**
 * Component default class name and class prefix.
 */
export const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-radio-group';

/**
 * Component default props.
 */
export const DEFAULT_PROPS: Partial<RadioGroupProps> = {};

/**
 * RadioGroup component.
 *
 * @param  props Component props.
 * @return JSX element.
 */
export const RadioGroup = (props: RadioGroupProps) => {
    const { children, className, ref, ...forwardedProps } = props;

    return (
        <div ref={ref} {...forwardedProps} className={classNames.join(className, CLASSNAME)}>
            {children}
        </div>
    );
};

RadioGroup.displayName = COMPONENT_NAME;
RadioGroup.className = CLASSNAME;
RadioGroup.defaultProps = DEFAULT_PROPS;
