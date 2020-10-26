import React, { MouseEventHandler } from 'react';

import classNames from 'classnames';

import { AspectRatio, Icon, Size, Theme } from '@lumx/react';
import { COMPONENT_PREFIX } from '@lumx/react/constants';
import { GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

enum UploaderVariant {
    square = 'square',
    rounded = 'rounded',
    circle = 'circle',
}

type UploaderSize = Size.xl | Size.xxl;

/**
 * Defines the props of the component.
 */
interface UploaderProps extends GenericProps {
    /**
     * Aspect ratio
     */
    aspectRatio?: AspectRatio;
    /**
     * Icon
     */
    icon?: string;
    /**
     * Label
     */
    label?: string;
    /**
     * Size
     */
    size?: UploaderSize;
    /**
     * Theme
     */
    theme?: Theme;
    /**
     * Uploader variant
     */
    variant?: UploaderVariant;
    /**
     * On click handler
     */
    onClick?: MouseEventHandler<HTMLDivElement>;
}

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}Uploader`;

/**
 * The default class name and classes prefix for this component.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
 */
const DEFAULT_PROPS: Partial<UploaderProps> = {
    aspectRatio: AspectRatio.horizontal,
    size: Size.xl,
    theme: Theme.light,
    variant: UploaderVariant.square,
};

/**
 * [Enter the description of the component here].
 *
 * @param  props The component props.
 * @return The component.
 */
const Uploader: React.FC<UploaderProps> = (props) => {
    const { aspectRatio, className, label, icon, size, theme, variant, ...forwardedProps } = props;

    // Adjust to square aspect ratio when using circle variants.
    const adjustedAspectRatio = variant === UploaderVariant.circle ? AspectRatio.square : aspectRatio;

    return (
        <div
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
};
Uploader.displayName = COMPONENT_NAME;
Uploader.defaultProps = DEFAULT_PROPS;

export { CLASSNAME, Uploader, UploaderProps, UploaderVariant };
