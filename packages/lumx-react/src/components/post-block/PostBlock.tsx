import React, { forwardRef, ReactNode } from 'react';

import classNames from 'classnames';

import isObject from 'lodash/isObject';

import { Orientation, Theme, Thumbnail, ThumbnailProps, ThumbnailVariant } from '@lumx/react';

import { Comp, GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

/**
 * Defines the props of the component.
 */
export interface PostBlockProps extends GenericProps {
    /** Action toolbar content. */
    actions?: ReactNode;
    /** Attachment content. */
    attachments?: ReactNode;
    /** Author content. */
    author?: ReactNode;
    /** Metadata content. */
    meta?: ReactNode;
    /** Orientation. */
    orientation?: Orientation;
    /** Tag content. */
    tags?: ReactNode;
    /** Content (string, or sanitized html). */
    text?: string | { __html: string };
    /** Theme adapting the component to light or dark background. */
    theme?: Theme;
    /** Thumbnail. */
    thumbnailProps?: ThumbnailProps;
    /** Title. */
    title: string;
    /** On click callback. */
    onClick?(): void;
}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'PostBlock';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * Component default props.
 */
const DEFAULT_PROPS: Partial<PostBlockProps> = {
    orientation: Orientation.horizontal,
    theme: Theme.light,
};

/**
 * PostBlock component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const PostBlock: Comp<PostBlockProps, HTMLDivElement> = forwardRef((props, ref) => {
    const {
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
        thumbnailProps,
        title,
        ...forwardedProps
    } = props;

    return (
        <div
            ref={ref}
            className={classNames(className, handleBasicClasses({ prefix: CLASSNAME, orientation, theme }))}
            {...forwardedProps}
        >
            {thumbnailProps && (
                <div className={`${CLASSNAME}__thumbnail`}>
                    <Thumbnail {...thumbnailProps} theme={theme} variant={ThumbnailVariant.rounded} />
                </div>
            )}

            <div className={`${CLASSNAME}__wrapper`}>
                {author && <div className={`${CLASSNAME}__author`}>{author}</div>}

                {title && (
                    <button type="button" className={`${CLASSNAME}__title`} onClick={onClick}>
                        {title}
                    </button>
                )}

                {meta && <span className={`${CLASSNAME}__meta`}>{meta}</span>}

                {isObject(text) && text.__html ? (
                    // eslint-disable-next-line react/no-danger
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
});
PostBlock.displayName = COMPONENT_NAME;
PostBlock.className = CLASSNAME;
PostBlock.defaultProps = DEFAULT_PROPS;
