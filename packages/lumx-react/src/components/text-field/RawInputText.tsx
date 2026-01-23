import { ComponentProps, ChangeEventHandler, SyntheticEvent, useRef, useCallback } from 'react';

import { Theme, useTheme } from '@lumx/react';

import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import { useMergeRefs } from '@lumx/react/utils/react/mergeRefs';
import { HasClassName, HasTheme } from '@lumx/react/utils/type';
import { classNames } from '@lumx/core/js/utils';

import { INPUT_NATIVE_CLASSNAME } from './constants';

const { block } = classNames.bem(INPUT_NATIVE_CLASSNAME);

type NativeInputProps = Omit<ComponentProps<'input'>, 'value' | 'onChange'>;

/**
 * Defines the props of the component.
 */
export interface RawInputTextProps extends NativeInputProps, HasTheme, HasClassName {
    value?: string;
    onChange?: (value: string, name?: string, event?: SyntheticEvent) => void;
}
/**
 * Component default props.
 */
export const DEFAULT_PROPS: Partial<RawInputTextProps> = {
    type: 'text',
};

/**
 * Raw input text component
 * (input element without any decoration)
 */
export const RawInputText = forwardRef<RawInputTextProps, HTMLInputElement>((props, ref) => {
    const defaultTheme = useTheme() || Theme.light;
    const {
        className,
        theme = defaultTheme,
        value,
        onChange,
        type = DEFAULT_PROPS.type,
        name,
        ...forwardedProps
    } = props;
    const textareaRef = useRef<HTMLInputElement>(null);

    const handleChange: ChangeEventHandler<HTMLInputElement> = useCallback(
        (evt) => {
            onChange?.(evt.target.value, name, evt);
        },
        [onChange, name],
    );

    return (
        <input
            {...forwardedProps}
            name={name}
            type={type}
            ref={useMergeRefs(ref, textareaRef)}
            className={classNames.join(
                className,
                block({
                    [`theme-${theme}`]: Boolean(theme),
                    text: true,
                }),
            )}
            onChange={handleChange}
            value={value}
        />
    );
});
