import React from 'react';

import { Theme } from '@lumx/react';
import { GenericProps } from '@lumx/react/utils/type';
import {
    Checkbox as UI,
    CheckboxProps as UIProps,
    CLASSNAME,
    COMPONENT_NAME,
    INTERMEDIATE_STATE,
} from '@lumx/core/js/components/Checkbox';
import { useId } from '@lumx/react/hooks/useId';
import { useMergeRefs } from '@lumx/react/utils/react/mergeRefs';
import { useTheme } from '@lumx/react/utils/theme/ThemeContext';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import { useDisableStateProps } from '@lumx/react/utils/disabled/useDisableStateProps';
import { ReactToJSX } from '@lumx/react/utils/type/ReactToJSX';

/**
 * Defines the props of the component.
 */
export interface CheckboxProps extends GenericProps, ReactToJSX<UIProps, 'inputId'> {
    /** On change callback. */
    onChange?(isChecked: boolean, value?: string, name?: string, event?: React.ChangeEvent): void;
}

/**
 * Component default props.
 */
const DEFAULT_PROPS: Partial<CheckboxProps> = {};

/**
 * Checkbox component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const Checkbox = forwardRef<CheckboxProps, HTMLDivElement>((props, ref) => {
    const { isAnyDisabled, disabledStateProps, otherProps } = useDisableStateProps(props);
    const defaultTheme = useTheme() || Theme.light;
    const {
        checked,
        className,
        helper,
        id,
        inputRef,
        isChecked = checked,
        label,
        name,
        onChange,
        theme = defaultTheme,
        value,
        inputProps = {},
        ...forwardedProps
    } = otherProps;
    const localInputRef = React.useRef<HTMLInputElement>(null);
    const generatedInputId = useId();
    const inputId = id || generatedInputId;

    const intermediateState = isChecked === INTERMEDIATE_STATE;

    React.useEffect(() => {
        const input = localInputRef.current;
        if (input) input.indeterminate = intermediateState;
    }, [intermediateState]);

    return UI({
        ref,
        className,
        helper,
        inputRef: useMergeRefs(inputRef, localInputRef),
        isChecked,
        label,
        name,
        onChange,
        theme,
        value,
        inputProps: {
            ...inputProps,
            ...disabledStateProps,
            readOnly: inputProps.readOnly || disabledStateProps['aria-disabled'],
        },
        ...forwardedProps,
        isDisabled: isAnyDisabled,
        inputId,
    });
});
Checkbox.displayName = COMPONENT_NAME;
Checkbox.className = CLASSNAME;
Checkbox.defaultProps = DEFAULT_PROPS;
