import React, { ReactNode } from 'react';

import classNames from 'classnames';

import isObject from 'lodash/isObject';

import { Orientation, Theme, Thumbnail, ThumbnailProps, ThumbnailVariant } from '@lumx/react';

import { COMPONENT_PREFIX } from '@lumx/react/constants';
import { GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

/**
 * Defines the props of the component.
 */
interface PostBlockProps extends GenericProps {
    /* Actions elements to be transcluded into the component */
    actions?: ReactNode;
    /* Atachments elements to be transcluded into the component */
    attachments?: ReactNode;
    /* Author element to be transcluded into the component */
    author?: ReactNode;
    /* Meta elements to be transcluded into the component */
    meta?: ReactNode;
    /* Orientation. */
    orientation?: Orientation;
    /* Tags elements to be transcluded into the component */
    tags?: ReactNode;
    /* Content text. Can be either a string, or sanitized html. */
    text?:
        | string
        | {
              __html: string;
          };
    /** Thumbnail image source */
    thumbnail?: string;
    /** The props to pass to the thumbnail, minus those already set by the PostBlock props. */
    thumbnailProps?: Omit<ThumbnailProps, 'image' | 'theme' | 'onClick' | 'variant' | 'tabIndex'>;
    /* Post title */
    title: string;
    /* Theme. */
    theme?: Theme;
    /* Callback for the click event. */
    onClick?(): void;
}

/**
 * Define the types of the default props.
 */
interface DefaultPropsType extends Partial<PostBlockProps> {}

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
const DEFAULT_PROPS: DefaultPropsType = {
    orientation: Orientation.horizontal,
    text: undefined,
    theme: Theme.light,
    thumbnailProps: undefined,
};

/**
 * PostBlock Element that display a Lumapps post
 *
 * @return The component.
 */
const PostBlock: React.FC<PostBlockProps> = ({
    actions,
    attachments,
    author,
    className,
    meta,
    onClick,
    orientation = DEFAULT_PROPS.orientation,
    tags,
    text = DEFAULT_PROPS.text,
    thumbnail,
    thumbnailProps = DEFAULT_PROPS.thumbnailProps,
    title,
    theme = DEFAULT_PROPS.theme,
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

export { CLASSNAME, DEFAULT_PROPS, PostBlock, PostBlockProps };
