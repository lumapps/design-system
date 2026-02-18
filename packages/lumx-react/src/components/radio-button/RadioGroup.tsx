import { GenericProps } from '@lumx/react/utils/type';
import {
    RadioGroup as UI,
    CLASSNAME,
    COMPONENT_NAME,
    RadioGroupProps as UIProps,
} from '@lumx/core/js/components/RadioGroup';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import { ReactToJSX } from '@lumx/react/utils/type/ReactToJSX';

/**
 * Defines the props of the component.
 */
export interface RadioGroupProps extends GenericProps, ReactToJSX<UIProps> {}

/**
 * RadioGroup component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const RadioGroup = forwardRef<RadioGroupProps, HTMLDivElement>((props, ref) => {
    const { children, className, ...forwardedProps } = props;

    return UI({
        ref,
        className,
        children,
        ...forwardedProps,
    });
});
RadioGroup.displayName = COMPONENT_NAME;
RadioGroup.className = CLASSNAME;
