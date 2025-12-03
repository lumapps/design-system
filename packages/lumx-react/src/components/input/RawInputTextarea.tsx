import React, { SyntheticEvent, useRef } from 'react';

import classNames from 'classnames';

import { Theme, useTheme } from '@lumx/react';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import { useMergeRefs } from '@lumx/react/utils/react/mergeRefs';
import type { HasClassName, HasTheme } from '@lumx/core/js/types';
import { handleBasicClasses, getRootClassName } from '@lumx/core/js/utils';

import { useFitRowsToContent } from './useFitRowsToContent';

type NativeTextareaProps = React.ComponentProps<'textarea'>;

/**
 * Defines the props of the component.
 */
export interface RawInputTextareaProps extends Omit<NativeTextareaProps, 'value' | 'onChange'>, HasTheme, HasClassName {
    minimumRows?: number;
    value?: string;
    onChange?: (value: string, name?: string, event?: SyntheticEvent) => void;
}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'RawInputTextarea';

/**
 * Component default class name and class prefix.
 */
export const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * Component default props.
 */
export const DEFAULT_PROPS: Partial<RawInputTextareaProps> = {
    minimumRows: 2,
};

/**
 * Raw input text area component
 * (textarea element without any decoration)
 */
export const RawInputTextarea = forwardRef<Omit<RawInputTextareaProps, 'type'>, HTMLTextAreaElement>((props, ref) => {
    const defaultTheme = useTheme() || Theme.light;
    const {
        className,
        theme = defaultTheme,
        minimumRows = DEFAULT_PROPS.minimumRows as number,
        value,
        onChange,
        ...forwardedProps
    } = props;
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const rows = useFitRowsToContent(minimumRows, textareaRef, value);

    const handleChange: React.ChangeEventHandler<HTMLTextAreaElement> = React.useCallback(
        (evt) => {
            onChange?.(evt.target.value, evt.target.name, evt);
        },
        [onChange],
    );

    return (
        <textarea
            className={classNames(className, handleBasicClasses({ prefix: CLASSNAME, theme }))}
            ref={useMergeRefs(ref, textareaRef)}
            {...forwardedProps}
            onChange={handleChange}
            value={value}
            rows={rows}
        />
    );
});
