import { ComponentProps, ChangeEventHandler, SyntheticEvent, useRef, useCallback } from 'react';

import { Theme, useTheme } from '@lumx/react';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import { useMergeRefs } from '@lumx/react/utils/react/mergeRefs';
import type { HasClassName, HasTheme } from '@lumx/core/js/types';
import { useClassnames } from '@lumx/react/utils';

import { useFitRowsToContent } from './useFitRowsToContent';
import { INPUT_NATIVE_CLASSNAME } from './constants';

type NativeTextareaProps = ComponentProps<'textarea'>;

/**
 * Defines the props of the component.
 */
export interface RawInputTextareaProps extends Omit<NativeTextareaProps, 'value' | 'onChange'>, HasTheme, HasClassName {
    minimumRows?: number;
    value?: string;
    onChange?: (value: string, name?: string, event?: SyntheticEvent) => void;
}

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
        name,
        onChange,
        ...forwardedProps
    } = props;
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const rows = useFitRowsToContent(minimumRows, textareaRef, value);
    const { block } = useClassnames(INPUT_NATIVE_CLASSNAME);

    const handleChange: ChangeEventHandler<HTMLTextAreaElement> = useCallback(
        (evt) => {
            onChange?.(evt.target.value, name, evt);
        },
        [onChange, name],
    );

    return (
        <textarea
            {...forwardedProps}
            name={name}
            className={block(
                {
                    [`theme-${theme}`]: Boolean(theme),
                    textarea: true,
                },
                [className],
            )}
            ref={useMergeRefs(ref, textareaRef)}
            onChange={handleChange}
            value={value}
            rows={rows}
        />
    );
});
