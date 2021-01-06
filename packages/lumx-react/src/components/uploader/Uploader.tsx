import React, { forwardRef, MouseEventHandler } from 'react';

import classNames from 'classnames';

import { AspectRatio, Icon, Size, Theme } from '@lumx/react';
import { Comp, GenericProps, getRootClassName, handleBasicClasses, ValueOf } from '@lumx/react/utils';

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
export interface UploaderProps extends GenericProps {
    /** Image aspect ratio. */
    aspectRatio?: AspectRatio;
    /** Icon (SVG path). */
    icon?: string;
    /** Label text. */
    label?: string;
    /** Size variant. */
    size?: UploaderSize;
    /** Theme adapting the component to light or dark background. */
    theme?: Theme;
    /** Variant. */
    variant?: UploaderVariant;
    /** On click callback. */
    onClick?: MouseEventHandler<HTMLDivElement>;
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
export const Uploader: Comp<UploaderProps, HTMLDivElement> = forwardRef((props, ref) => {
    const { aspectRatio, className, label, icon, size, theme, variant, ...forwardedProps } = props;
    // Adjust to square aspect ratio when using circle variants.
    const adjustedAspectRatio = variant === UploaderVariant.circle ? AspectRatio.square : aspectRatio;

    return (
        <div
            ref={ref}
            {...forwardedProps}
            className={classNames(
                className,
                handleBasicClasses({
                    aspectRatio: adjustedAspectRatio,
                    prefix: CLASSNAME,
                    size,
                    theme,
                    variant,
                }),
            )}
        >
            <div className={`${CLASSNAME}__background`} />

            <div className={`${CLASSNAME}__wrapper`}>
                {icon && (
                    <div className={`${CLASSNAME}__icon`}>
                        <Icon icon={icon} size={Size.s} />
                    </div>
                )}

                {label && <span className={`${CLASSNAME}__label`}>{label}</span>}
            </div>
        </div>
    );
});
Uploader.displayName = COMPONENT_NAME;
Uploader.className = CLASSNAME;
Uploader.defaultProps = DEFAULT_PROPS;
