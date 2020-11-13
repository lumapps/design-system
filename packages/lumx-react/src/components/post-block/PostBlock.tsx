import React, { ReactNode } from 'react';

import classNames from 'classnames';

import isObject from 'lodash/isObject';

import { Orientation, Theme, Thumbnail, ThumbnailProps, ThumbnailVariant } from '@lumx/react';

import { COMPONENT_PREFIX } from '@lumx/react/constants';
import { GenericProps, ValueOf, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

/**
 * Defines the props of the component.
 */
interface PostBlockProps extends GenericProps {
    /** The action elements. */
    actions?: ReactNode;
    /** The attachment elements. */
    attachments?: ReactNode;
    /** The author element. */
    author?: ReactNode;
    /** The meta elements. */
    meta?: ReactNode;
    /** The orientation. */
    orientation?: ValueOf<Orientation>;
    /** The tag elements. */
    tags?: ReactNode;
    /** Content text. Can be either a string, or sanitized html. */
    text?: string | { __html: string };
    /** The theme to apply to the component. Can be either 'light' or 'dark'. */
    theme?: ValueOf<Theme>;
    /**
     * The url of the image we want to display.
     * @see {@link ThumbnailProps#image}
     */
    thumbnail?: string;
    /** The props to pass to the thumbnail, minus those already set by the PostBlock props. */
    thumbnailProps?: Omit<ThumbnailProps, 'image' | 'theme' | 'onClick' | 'variant' | 'tabIndex'>;
    /** The title of the post. */
    title: string;
    /** The function called on click. */
    onClick?(): void;
}

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
const DEFAULT_PROPS: Partial<PostBlockProps> = {
    orientation: Orientation.horizontal,
    theme: Theme.light,
};

const PostBlock: React.FC<PostBlockProps> = ({
    actions,
    attachments,
    author,
    className,
    meta,
    onClick,
    orientation,
    tags,
    text,
    theme,
    thumbnail,
    thumbnailProps,
    title,
}) => {
    return (
        <div className={classNames(className, handleBasicClasses({ prefix: CLASSNAME, orientation, theme }))}>
            {thumbnail && (
                <div className={`${CLASSNAME}__thumbnail`}>
                    <Thumbnail
                        {...thumbnailProps}
                        image={thumbnail}
                        theme={theme}
                        onClick={onClick}
                        variant={ThumbnailVariant.rounded}
                        tabIndex="0"
                    />
                </div>
            )}

            <div className={`${CLASSNAME}__wrapper`}>
                {author && <div className={`${CLASSNAME}__author`}>{author}</div>}

                {title && (
                    <a className={`${CLASSNAME}__title`} onClick={onClick}>
                        {title}
                    </a>
                )}

                {meta && <span className={`${CLASSNAME}__meta`}>{meta}</span>}

                {isObject(text) && text.__html ? (
                    <p dangerouslySetInnerHTML={text} className={`${CLASSNAME}__text`} />
                ) : (
                    <p className={`${CLASSNAME}__text`}>{text}</p>
                )}

                {attachments && <div className={`${CLASSNAME}__attachments`}>{attachments}</div>}
                {(tags || actions) && (
                    <div className={`${CLASSNAME}__toolbar`}>
                        {tags && <div className={`${CLASSNAME}__tags`}>{tags}</div>}
                        {actions && <div className={`${CLASSNAME}__actions`}>{actions}</div>}
                    </div>
                )}
            </div>
        </div>
    );
};

PostBlock.displayName = COMPONENT_NAME;
PostBlock.defaultProps = DEFAULT_PROPS;

export { CLASSNAME, PostBlock, PostBlockProps };
