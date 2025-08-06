import React, { MouseEventHandler } from 'react';

import classNames from 'classnames';

import { AspectRatio, Icon, Size, Theme } from '@lumx/react';
import { GenericProps, HasTheme, ValueOf } from '@lumx/react/utils/type';
import { getRootClassName, handleBasicClasses } from '@lumx/react/utils/className';
import { useBooleanState } from '@lumx/react/hooks/useBooleanState';
import { useId } from '@lumx/react/hooks/useId';
import { useTheme } from '@lumx/react/utils/theme/ThemeContext';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';

/**
 * Uploader variants.
 */
export const UploaderVariant = {
    square: 'square',
    rounded: 'rounded',
    circle: 'circle',
} as const;
export type UploaderVariant = ValueOf<typeof UploaderVariant>;

/**
 * Uploader sizes.
 */
export type UploaderSize = Extract<Size, 'xl' | 'xxl'>;

/**
 * Extend native HTML input props with specialized `onChange` providing the a `File` array.
 */
interface FileInputProps extends Omit<React.ComponentProps<'input'>, 'onChange'> {
    onChange(files: File[], evt: React.ChangeEvent<HTMLInputElement>): void;
}

/**
 * Defines the props of the component.
 */
export interface UploaderProps extends GenericProps, HasTheme {
    /** Image aspect ratio. */
    aspectRatio?: AspectRatio;
    /** Icon (SVG path). */
    icon?: string;
    /** Label text. */
    label?: string;
    /** Size variant. */
    size?: UploaderSize;
    /** Variant. */
    variant?: UploaderVariant;
    /** On click callback. */
    onClick?: MouseEventHandler;
    /** Handle file selection with a native input file. */
    fileInputProps?: FileInputProps;
}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'Uploader';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * Component default props.
 */
const DEFAULT_PROPS: Partial<UploaderProps> = {
    aspectRatio: AspectRatio.horizontal,
    size: Size.xl,
    variant: UploaderVariant.square,
};

/**
 * Uploader component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const Uploader = forwardRef<UploaderProps>((props, ref) => {
    const defaultTheme = useTheme() || Theme.light;
    const {
        aspectRatio = DEFAULT_PROPS.aspectRatio,
        className,
        label,
        icon,
        size = DEFAULT_PROPS.size,
        theme = defaultTheme,
        variant = DEFAULT_PROPS.variant,
        fileInputProps,
        ...forwardedProps
    } = props;
    // Adjust to square aspect ratio when using circle variants.
    const adjustedAspectRatio = variant === UploaderVariant.circle ? AspectRatio.square : aspectRatio;

    const generatedInputId = useId();
    const inputId = fileInputProps?.id || generatedInputId;
    const [isDragHovering, unsetDragHovering, setDragHovering] = useBooleanState(false);
    const wrapper = fileInputProps
        ? { Component: 'label' as const, props: { htmlFor: inputId } as const }
        : { Component: 'button' as const, props: { type: 'button' } as const };

    const onChange = React.useMemo(() => {
        if (!fileInputProps?.onChange) return undefined;
        return (evt: React.ChangeEvent<HTMLInputElement>) => {
            const fileList = evt.target.files;
            const files = fileList ? Array.from(fileList) : [];
            fileInputProps.onChange(files, evt);
        };
    }, [fileInputProps]);

    return (
        <wrapper.Component
            ref={ref as any}
            {...wrapper.props}
            {...forwardedProps}
            className={classNames(
                className,
                handleBasicClasses({
                    aspectRatio: adjustedAspectRatio,
                    prefix: CLASSNAME,
                    size,
                    theme,
                    variant,
                    isDragHovering,
                }),
            )}
        >
            <span className={`${CLASSNAME}__background`} />

            <span className={`${CLASSNAME}__wrapper`}>
                {icon && <Icon className={`${CLASSNAME}__icon`} icon={icon} size={Size.s} />}

                {label && <span className={`${CLASSNAME}__label`}>{label}</span>}
            </span>

            {fileInputProps && (
                <input
                    type="file"
                    id={inputId}
                    className={`${CLASSNAME}__input`}
                    {...fileInputProps}
                    onChange={onChange}
                    onDragEnter={setDragHovering}
                    onDragLeave={unsetDragHovering}
                    onDrop={unsetDragHovering}
                />
            )}
        </wrapper.Component>
    );
});
Uploader.displayName = COMPONENT_NAME;
Uploader.className = CLASSNAME;
Uploader.defaultProps = DEFAULT_PROPS;
