import React from 'react';

import { Theme } from '@lumx/react';
import { useId } from '@lumx/react/hooks/useId';
import { useMergeRefs } from '@lumx/react/utils/react/mergeRefs';
import { useTheme } from '@lumx/react/utils/theme/ThemeContext';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import { useDisableStateProps } from '@lumx/react/utils/disabled/useDisableStateProps';

import {
    BaseCheckboxProps,
    CLASSNAME,
    COMPONENT_NAME,
    DEFAULT_PROPS,
    Checkbox as UI,
} from '@lumx/core/js/components/Checkbox';

/**
 * Intermediate state of checkbox.
 */
const INTERMEDIATE_STATE = 'intermediate';

/**
 * Defines the props of the component.
 */
export interface CheckboxProps extends Omit<BaseCheckboxProps, 'inputRef' | 'onChange'> {
    /** Native input ref. */
    inputRef?: React.Ref<HTMLInputElement>;
}

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
        id,
        inputRef,
        isChecked = checked,
        theme = defaultTheme,
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
        theme,
        checked,
        isChecked,
        ...forwardedProps,
        inputRef: useMergeRefs(inputRef, localInputRef),
        isDisabled: isAnyDisabled,
        inputProps: {
            id: inputId,
            ...inputProps,
            ...disabledStateProps,
            readOnly: inputProps.readOnly || disabledStateProps['aria-disabled'],
        },
    });
});

Checkbox.displayName = COMPONENT_NAME;
Checkbox.className = CLASSNAME;
Checkbox.defaultProps = DEFAULT_PROPS;
