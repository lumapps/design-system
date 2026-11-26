import type { JSXElement, LumxClassName, HasClassName, CommonRef } from '../../types';
import { classNames } from '../../utils';

/**
 * Defines the props of the component.
 */
export interface RadioGroupProps extends HasClassName {
    /** RadioButton elements */
    children?: JSXElement;
    /** Value of the checked radio. */
    value?: string;
    /** Native input name, shared by every radio of the group. */
    name?: string;
    /** Called when a radio of the group changes. */
    handleChange?(value: string, name?: string, event?: any): void;
    /** reference to the root element */
    ref?: CommonRef;
}

/** State of a radio group, shared with its radios. */
export interface RadioGroupState {
    /** Value of the checked radio. */
    value?: string;
    /** The group sets the checked state of its radios, also when its value is `undefined`. */
    isControlled?: boolean;
    /** Native input name, shared by every radio of the group. */
    name?: string;
    /** Called when a radio of the group changes. */
    onChange?(value: string, name?: string, event?: any): void;
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
    const { children, className, ref, value, name, handleChange, ...forwardedProps } = props;

    return (
        <div ref={ref} {...forwardedProps} className={classNames.join(className, CLASSNAME)}>
            {children}
        </div>
    );
};

RadioGroup.displayName = COMPONENT_NAME;
RadioGroup.className = CLASSNAME;
RadioGroup.defaultProps = DEFAULT_PROPS;
