import React, { ReactElement, ReactNode } from 'react';

import classNames from 'classnames';

import { COMPONENT_PREFIX } from 'LumX/core/react/constants';

import { Orientation, Theme, Thumbnail, ThumbnailAspectRatio, ThumbnailVariant } from 'LumX';

import { IGenericProps, getRootClassName } from 'LumX/core/react/utils';

import { handleBasicClasses } from 'LumX/core/utils';

/////////////////////////////

/**
 * Defines the props of the component.
 */
interface IPostBlockProps extends IGenericProps {
    /* Actions elements to be transcluded into the component */
    actions?: HTMLElement | ReactNode;
    /* Atachments elements to be transcluded into the component */
    attachments?: HTMLElement | ReactNode;
    /* Author element to be transcluded into the component */
    author?: HTMLElement | ReactNode;
    /* Meta elements to be transcluded into the component */
    meta?: HTMLElement | ReactNode;
    /* Orientation. */
    orientation?: Orientation;
    /* Tags elements to be transcluded into the component */
    tags?: HTMLElement | ReactNode;
    /* Content text */
    text: string;
    /* Thumbnail image source */
    thumbnail: string;
    /* The image aspect ratio. */
    thumbnailAspectRatio?: ThumbnailAspectRatio;
    /* Post title */
    title: string;
    /* Theme. */
    theme?: Theme;
    /* Callback for the click event. */
    onClick?(): void;
}
type PostBlockProps = IPostBlockProps;

/////////////////////////////

/**
 * Define the types of the default props.
 */
interface IDefaultPropsType extends Partial<PostBlockProps> {}

/////////////////////////////
//                         //
//    Public attributes    //
//                         //
/////////////////////////////

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}PostBlock`;

/**
 * The default class name and classes prefix for this component.
 */
const CLASSNAME: string = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
 */
const DEFAULT_PROPS: IDefaultPropsType = {
    orientation: Orientation.horizontal,
    theme: Theme.light,
    thumbnailAspectRatio: ThumbnailAspectRatio.horizontal,
};
/////////////////////////////

/**
 * PostBlock Element that display a Lumapps post
 *
 * @return The component.
 */
const PostBlock: React.FC<PostBlockProps> = ({
    actions,
    attachments,
    author,
    className = '',
    meta,
    onClick,
    orientation = DEFAULT_PROPS.orientation,
    tags,
    text,
    thumbnail,
    thumbnailAspectRatio = DEFAULT_PROPS.thumbnailAspectRatio,
    title,
    theme = DEFAULT_PROPS.theme,
}: PostBlockProps): ReactElement => {
    const hasActions = Boolean(actions);
    const hasAttachments = Boolean(attachments);
    const hasAuthor = Boolean(author);
    const hasTags = Boolean(tags);

    return (
        <div className={classNames(className, handleBasicClasses({ prefix: CLASSNAME, orientation, theme }))}>
            {thumbnail && (
                <div className={`${CLASSNAME}__thumbnail`}>
                    <Thumbnail
                        aspectRatio={thumbnailAspectRatio}
                        image={thumbnail}
                        theme={theme}
                        onClick={onClick}
                        variant={ThumbnailVariant.rounded}
                        tabIndex="0"
                    />
                </div>
            )}

            <div className={`${CLASSNAME}__wrapper`}>
                {hasAuthor && <div className={`${CLASSNAME}__author`}>{author}</div>}

                {title && (
                    <a className={`${CLASSNAME}__title`} onClick={onClick}>
                        {title}
                    </a>
                )}

                {meta && <span className={`${CLASSNAME}__meta`}>{meta}</span>}

                <p className={`${CLASSNAME}__text`}>{text}</p>

                {hasAttachments && <div className={`${CLASSNAME}__attachments`}>{attachments}</div>}
                {(hasTags || hasActions) && (
                    <div className={`${CLASSNAME}__toolbar`}>
                        {hasTags && <div className={`${CLASSNAME}__tags`}>{tags}</div>}
                        {hasActions && <div className={`${CLASSNAME}__actions`}>{actions}</div>}
                    </div>
                )}
            </div>
        </div>
    );
};

PostBlock.displayName = COMPONENT_NAME;

/////////////////////////////

export { CLASSNAME, DEFAULT_PROPS, PostBlock, PostBlockProps };
