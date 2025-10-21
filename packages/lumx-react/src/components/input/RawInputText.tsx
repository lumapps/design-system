import React, { SyntheticEvent, useRef } from 'react';

import classNames from 'classnames';

import { Theme, useTheme } from '@lumx/react';

import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import { useMergeRefs } from '@lumx/react/utils/react/mergeRefs';
import { HasClassName, HasTheme } from '@lumx/react/utils/type';
import { getRootClassName, handleBasicClasses } from '@lumx/core/js/utils/className';

type NativeInputProps = Omit<React.ComponentProps<'input'>, 'value' | 'onChange'>;

/**
 * Defines the props of the component.
 */
export interface RawInputTextProps extends NativeInputProps, HasTheme, HasClassName {
    value?: string;
    onChange?: (value: string, name?: string, event?: SyntheticEvent) => void;
}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'RawInputText';

/**
 * Component default class name and class prefix.
 */
export const CLASSNAME = getRootClassName(COMPONENT_NAME);

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
    const { className, theme = defaultTheme, value, onChange, type = DEFAULT_PROPS.type, ...forwardedProps } = props;
    const textareaRef = useRef<HTMLInputElement>(null);

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (evt) => {
        onChange?.(evt.target.value, evt.target.name, evt);
    };

    return (
        <input
            {...forwardedProps}
            type={type}
            ref={useMergeRefs(ref, textareaRef)}
            className={classNames(className, handleBasicClasses({ prefix: CLASSNAME, theme }))}
            onChange={handleChange}
            value={value}
        />
    );
});
RawInputText.displayName = COMPONENT_NAME;
