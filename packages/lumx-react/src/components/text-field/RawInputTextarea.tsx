import { SyntheticEvent, useRef } from 'react';

import { Theme, useTheme } from '@lumx/react';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import { useMergeRefs } from '@lumx/react/utils/react/mergeRefs';
import {
    RawInputTextarea as UI,
    RawInputTextareaProps as UIProps,
    DEFAULT_PROPS as CORE_DEFAULT_PROPS,
} from '@lumx/core/js/components/TextField/RawInputTextarea';

import { ReactToJSX } from '@lumx/react/utils/type/ReactToJSX';

import { useFitRowsToContent } from './useFitRowsToContent';

/**
 * Defines the props of the component.
 */
export interface RawInputTextareaProps extends ReactToJSX<UIProps, 'rows'> {
    minimumRows?: number;
    onChange?: (value: string, name?: string, event?: SyntheticEvent) => void;
}

/**
 * Component default props.
 */
export const DEFAULT_PROPS: Partial<RawInputTextareaProps> = {
    minimumRows: CORE_DEFAULT_PROPS.rows,
};

/**
 * Raw input text area component
 * (textarea element without any decoration)
 */
export const RawInputTextarea = forwardRef<Omit<RawInputTextareaProps, 'type'>, HTMLTextAreaElement>((props, ref) => {
    const defaultTheme = useTheme() || Theme.light;
    const {
        theme = defaultTheme,
        minimumRows = DEFAULT_PROPS.minimumRows as number,
        value,
        onChange,
        ...restOfProps
    } = props;
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const rows = useFitRowsToContent(minimumRows, textareaRef, value);

    return UI({
        ...restOfProps,
        ref: useMergeRefs(ref, textareaRef),
        theme,
        value,
        rows,
        handleChange: onChange,
    });
});
