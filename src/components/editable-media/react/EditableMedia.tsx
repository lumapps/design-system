import React from 'react';

import classNames from 'classnames';

import { COMPONENT_PREFIX } from 'LumX/core/react/constants';

import { Callback, IGenericProps, getRootClassName } from 'LumX/core/react/utils';

import { Size, Theme } from 'LumX/components/index';
import { handleBasicClasses, onEnterPressed } from 'LumX/core/utils';

import { Avatar, Icon, Thumbnail, ThumbnailAspectRatio, ThumbnailVariant } from 'LumX';
import { mdiImagePlus } from 'LumX/icons';

import noop from 'lodash/noop';

/////////////////////////////

/**
 * Available variant values.
 */
enum EditableMediaVariant {
    avatar = 'avatar',
    thumbnail = 'thumbnail',
}

/**
 * Authorized size values.
 */
type EditableMediaSize = Size.xl | Size.xxl;

/**
 * Defines the props of the component.
 */
interface IEditableMediaProps extends IGenericProps {
    /** Helper message. */
    helper?: string;
    /** Image to display. */
    image?: string;
    /** Label */
    label?: string;
    /** Placeholder message. */
    placeholder?: string;
    /** The size of the component. */
    size?: EditableMediaSize;
    /** The theme to apply to the component. Can be either 'light' or 'dark'. */
    theme?: Theme;
    /** Component variant. */
    variant?: EditableMediaVariant;
    /** On click handler. */
    onClick?(evt: React.MouseEvent): void;
}
type EditableMediaProps = IEditableMediaProps;

/////////////////////////////

/**
 * Define the types of the default props.
 */
interface IDefaultPropsType extends Partial<EditableMediaProps> {}

/////////////////////////////
//                         //
//    Public attributes    //
//                         //
/////////////////////////////

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}EditableMedia`;

/**
 * The default class name and classes prefix for this component.
 */
const CLASSNAME: string = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
 */
const DEFAULT_PROPS: IDefaultPropsType = {
    onClick: noop,
    size: Size.xxl,
    theme: Theme.light,
    variant: EditableMediaVariant.thumbnail,
};

/////////////////////////////

/**
 * Pick or upload a picture. It will show up a preview for this content.
 *
 * @return The component.
 */
const EditableMedia: React.FC<EditableMediaProps> = ({
    className = '',
    children,
    helper,
    image,
    label,
    placeholder,
    size = DEFAULT_PROPS.size,
    theme = DEFAULT_PROPS.theme,
    variant = DEFAULT_PROPS.variant,
    onClick = DEFAULT_PROPS.onClick,
    ...props
}: EditableMediaProps): React.ReactElement => (
    <div
        className={classNames(
            className,
            handleBasicClasses({
                prefix: CLASSNAME,
                // tslint:disable-next-line:object-literal-sort-keys
                hasLabel: Boolean(label),
                size,
                theme,
                variant,
            }),
        )}
        {...props}
    >
        {label && <span className="lumx-editable-media__label">{label}</span>}

        {helper && <span className="lumx-editable-media__helper">{helper}</span>}

        <div className="lumx-editable-media__wrapper">
            {!image && (
                <div
                    className="lumx-editable-media__cta"
                    onClick={onClick}
                    onKeyPress={onEnterPressed(onClick as Callback)}
                    tabIndex={0}
                >
                    <div className="lumx-editable-media__cta-content">
                        <Icon
                            className="lumx-editable-media__cta-icon"
                            color={!theme || theme === 'light' ? 'dark' : 'light'}
                            icon={mdiImagePlus}
                            size={Size.s}
                        />

                        {placeholder && <span className="lumx-editable-media__cta-placeholder">{placeholder}</span>}
                    </div>
                </div>
            )}

            {image && variant === 'thumbnail' && (
                <div className="lumx-editable-media__thumbnail">
                    <Thumbnail
                        aspectRatio={ThumbnailAspectRatio.horizontal}
                        image={image}
                        size={size}
                        theme={theme}
                        variant={ThumbnailVariant.rounded}
                        onClick={onClick}
                        tabIndex={0}
                    />
                </div>
            )}

            {image && variant === 'avatar' && (
                <div className="lumx-editable-media__avatar">
                    <Avatar
                        image={image}
                        size={size}
                        theme={theme}
                        onClick={onClick}
                        onKeyPress={onEnterPressed(onClick as Callback)}
                        tabIndex={0}
                    />
                </div>
            )}

            {image && <div className="lumx-editable-media__actions">{children}</div>}
        </div>
    </div>
);
EditableMedia.displayName = COMPONENT_NAME;

/////////////////////////////

export { CLASSNAME, DEFAULT_PROPS, EditableMedia, EditableMediaProps, EditableMediaVariant };
