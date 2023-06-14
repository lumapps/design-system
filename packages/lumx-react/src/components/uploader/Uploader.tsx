import React, { forwardRef, MouseEventHandler } from 'react';
import classNames from 'classnames';
import uniqueId from 'lodash/uniqueId';

import { AspectRatio, Icon, Size, Theme } from '@lumx/react';
import { Comp, GenericProps, HasTheme, ValueOf } from '@lumx/react/utils/type';
import { getRootClassName, handleBasicClasses } from '@lumx/react/utils/className';
import { useBooleanState } from '@lumx/react/hooks/useBooleanState';

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
    fileInputProps?: React.ComponentProps<'input'>;
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
    theme: Theme.light,
    variant: UploaderVariant.square,
};

/**
 * Uploader component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const Uploader: Comp<UploaderProps> = forwardRef((props, ref) => {
    const { aspectRatio, className, label, icon, size, theme, variant, fileInputProps, ...forwardedProps } = props;
    // Adjust to square aspect ratio when using circle variants.
    const adjustedAspectRatio = variant === UploaderVariant.circle ? AspectRatio.square : aspectRatio;

    const inputId = React.useMemo(() => fileInputProps?.id || uniqueId('uploader-input-'), [fileInputProps?.id]);
    const [isDragHovering, unsetDragHovering, setDragHovering] = useBooleanState(false);
    const wrapper = fileInputProps
        ? { Component: 'label' as const, props: { htmlFor: inputId } as const }
        : { Component: 'button' as const, props: { type: 'button' } as const };

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
