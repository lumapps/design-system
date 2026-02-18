import React from 'react';

import { Alignment, Theme } from '@lumx/react';
import { GenericProps } from '@lumx/react/utils/type';
import { Switch as UI, SwitchProps as UIProps, CLASSNAME, COMPONENT_NAME } from '@lumx/core/js/components/Switch';
import { useId } from '@lumx/react/hooks/useId';
import { useMergeRefs } from '@lumx/react/utils/react/mergeRefs';
import { useTheme } from '@lumx/react/utils/theme/ThemeContext';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import { useDisableStateProps } from '@lumx/react/utils/disabled/useDisableStateProps';
import { ReactToJSX } from '@lumx/react/utils/type/ReactToJSX';

/**
 * Defines the props of the component.
 */
export interface SwitchProps extends GenericProps, ReactToJSX<UIProps, 'inputId' | 'label'> {
    /** On change callback. */
    onChange?(isChecked: boolean, value?: string, name?: string, event?: React.ChangeEvent): void;
}

/**
 * Component default props.
 */
const DEFAULT_PROPS: Partial<SwitchProps> = {
    position: Alignment.left,
};

/**
 * Switch component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const Switch = forwardRef<SwitchProps, HTMLDivElement>((props, ref) => {
    const { isAnyDisabled, disabledStateProps, otherProps } = useDisableStateProps(props);
    const defaultTheme = useTheme() || Theme.light;
    const {
        checked,
        children,
        className,
        helper,
        id,
        inputRef,
        isChecked = checked,
        name,
        onChange,
        position = DEFAULT_PROPS.position,
        theme = defaultTheme,
        value,
        inputProps = {},
        ...forwardedProps
    } = otherProps;

    const localInputRef = React.useRef<HTMLInputElement>(null);
    const generatedInputId = useId();
    const inputId = id || generatedInputId;

    return UI({
        ref,
        className,
        helper,
        inputRef: useMergeRefs(inputRef, localInputRef),
        isChecked,
        label: children,
        name,
        handleChange: onChange,
        position,
        theme,
        value,
        inputProps: {
            ...inputProps,
            ...disabledStateProps,
            readOnly: inputProps.readOnly || isAnyDisabled,
        },
        ...forwardedProps,
        isDisabled: isAnyDisabled,
        inputId,
    });
});
Switch.displayName = COMPONENT_NAME;
Switch.className = CLASSNAME;
Switch.defaultProps = DEFAULT_PROPS;
