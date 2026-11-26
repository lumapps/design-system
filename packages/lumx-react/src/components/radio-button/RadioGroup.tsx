import { useMemo } from 'react';
import type { GenericProps } from '@lumx/core/js/types';
import {
    RadioGroup as UI,
    CLASSNAME,
    COMPONENT_NAME,
    RadioGroupProps as UIProps,
    type RadioGroupState,
} from '@lumx/core/js/components/RadioGroup';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import { useId } from '@lumx/react/hooks/useId';
import { ReactToJSX } from '@lumx/react/utils/type/ReactToJSX';
import { RadioGroupContext } from './RadioGroupContext';

/**
 * Defines the props of the component.
 */
export interface RadioGroupProps extends GenericProps, ReactToJSX<UIProps> {
    /** Called when a radio of the group changes. */
    onChange?(value: string, name?: string, event?: React.ChangeEvent): void;
}

/**
 * RadioGroup component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const RadioGroup = forwardRef<RadioGroupProps, HTMLDivElement>((props, ref) => {
    const { children, className, value, name, onChange, ...forwardedProps } = props;
    const generatedName = useId();
    const groupName = name || generatedName;
    // With `value={undefined}` (no selection), the radios must stay controlled.
    const isControlled = 'value' in props;

    const contextValue = useMemo<RadioGroupState>(
        () => ({ value, isControlled, name: groupName, onChange }),
        [value, isControlled, groupName, onChange],
    );

    return (
        <RadioGroupContext.Provider value={contextValue}>
            {UI({
                ref,
                className,
                children,
                ...forwardedProps,
            })}
        </RadioGroupContext.Provider>
    );
});
RadioGroup.displayName = COMPONENT_NAME;
RadioGroup.className = CLASSNAME;
