import type { HTMLInputTypeAttribute } from 'react';

import { CommonRef, HasClassName, HasTheme } from '../../types';
import { classNames } from '../../utils';

import { INPUT_NATIVE_CLASSNAME } from './constants';

const { block } = classNames.bem(INPUT_NATIVE_CLASSNAME);

/**
 * Defines the props of the component.
 */
export interface RawInputTextProps extends HasTheme, HasClassName {
    value?: string;
    type?: HTMLInputTypeAttribute;
    name?: string | undefined;
    ref?: CommonRef;
    handleChange?: (value: string, name?: string, event?: any) => void;
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
export const RawInputText = (props: RawInputTextProps) => {
    const { className, theme, value, handleChange, type = DEFAULT_PROPS.type, name, ref, ...forwardedProps } = props;

    const handleOnChange = (evt: any) => {
        handleChange?.(evt.target.value, name, evt);
    };

    return (
        <input
            {...forwardedProps}
            name={name}
            type={type}
            ref={ref}
            className={classNames.join(
                className,
                block({
                    [`theme-${theme}`]: Boolean(theme),
                    text: true,
                }),
            )}
            onChange={handleOnChange}
            value={value}
        />
    );
};
