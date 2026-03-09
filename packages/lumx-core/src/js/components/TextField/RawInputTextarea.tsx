import { CommonRef, HasClassName, HasTheme } from '../../types';
import { classNames } from '../../utils';

import { INPUT_NATIVE_CLASSNAME } from './constants';

const { block } = classNames.bem(INPUT_NATIVE_CLASSNAME);

/**
 * Defines the props of the component.
 */
export interface RawInputTextareaProps extends HasTheme, HasClassName {
    value?: string;
    rows?: number;
    name?: string | undefined;
    ref?: CommonRef;
    handleChange?: (value: string, name?: string, event?: any) => void;
}

/**
 * Component default props.
 */
export const DEFAULT_PROPS: Partial<RawInputTextareaProps> = {
    rows: 2,
};

/**
 * Raw input textarea component
 * (textarea element without any decoration)
 */
export const RawInputTextarea = (props: RawInputTextareaProps) => {
    const { className, theme, value, handleChange, rows = DEFAULT_PROPS.rows, name, ref, ...forwardedProps } = props;

    const handleOnChange = (evt: any) => {
        handleChange?.(evt.target.value, name, evt);
    };

    return (
        <textarea
            {...forwardedProps}
            name={name}
            ref={ref}
            className={classNames.join(
                className,
                block({
                    [`theme-${theme}`]: Boolean(theme),
                    textarea: true,
                }),
            )}
            onChange={handleOnChange}
            value={value}
            rows={rows}
        />
    );
};
