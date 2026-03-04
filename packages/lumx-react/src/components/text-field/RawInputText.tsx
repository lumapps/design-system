import { SyntheticEvent } from 'react';

import { Theme, useTheme } from '@lumx/react';

import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import {
    RawInputText as UI,
    RawInputTextProps as UIProps,
    DEFAULT_PROPS,
} from '@lumx/core/js/components/TextField/RawInputText';

import { ReactToJSX } from '@lumx/react/utils/type/ReactToJSX';

/**
 * Defines the props of the component.
 */
export interface RawInputTextProps extends ReactToJSX<UIProps> {
    onChange?: (value: string, name?: string, event?: SyntheticEvent) => void;
}
/**
 * Component default props.
 */
export { DEFAULT_PROPS };

/**
 * Raw input text component
 * (input element without any decoration)
 */
export const RawInputText = forwardRef<RawInputTextProps, HTMLInputElement>((props, ref) => {
    const defaultTheme = useTheme() || Theme.light;
    const { theme = defaultTheme, onChange, ...restOfProps } = props;

    return UI({
        ...restOfProps,
        ref,
        theme,
        handleChange: onChange,
    });
});
