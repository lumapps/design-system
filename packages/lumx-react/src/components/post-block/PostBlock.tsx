import { ReactNode } from 'react';

import isObject from 'lodash/isObject';

import { Orientation, Theme, Thumbnail, ThumbnailProps, ThumbnailVariant } from '@lumx/react';
import { GenericProps, HasTheme } from '@lumx/react/utils/type';
import type { LumxClassName } from '@lumx/core/js/types';
import { useTheme } from '@lumx/react/utils/theme/ThemeContext';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import { useClassnames } from '@lumx/react/utils';

/**
 * Defines the props of the component.
 */
export interface PostBlockProps extends GenericProps, HasTheme {
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
const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-post-block';

/**
 * Component default props.
 */
const DEFAULT_PROPS: Partial<PostBlockProps> = {
    orientation: Orientation.horizontal,
};

/**
 * PostBlock component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const PostBlock = forwardRef<PostBlockProps, HTMLDivElement>((props, ref) => {
    const defaultTheme = useTheme() || Theme.light;
    const {
        actions,
        attachments,
        author,
        className,
        meta,
        onClick,
        orientation = DEFAULT_PROPS.orientation,
        tags,
        text,
        theme = defaultTheme,
        thumbnailProps,
        title,
        ...forwardedProps
    } = props;
    const { block, element } = useClassnames(CLASSNAME);

    return (
        <div
            ref={ref}
            className={block(
                {
                    [`orientation-${orientation}`]: Boolean(orientation),
                    [`theme-${theme}`]: Boolean(theme),
                },
                className,
            )}
            {...forwardedProps}
        >
            {thumbnailProps && (
                <div className={element('thumbnail')}>
                    <Thumbnail {...thumbnailProps} theme={theme} variant={ThumbnailVariant.rounded} />
                </div>
            )}
            <div className={element('wrapper')}>
                {author && <div className={element('author')}>{author}</div>}

                {title && (
                    <button type="button" className={element('title')} onClick={onClick}>
                        {title}
                    </button>
                )}

                {meta && <span className={element('meta')}>{meta}</span>}

                {isObject(text) && text.__html ? (
                    // eslint-disable-next-line react/no-danger
                    <p dangerouslySetInnerHTML={text} className={element('text')} />
                ) : (
                    <p className={element('text')}>{text}</p>
                )}

                {attachments && <div className={element('attachments')}>{attachments}</div>}
                {(tags || actions) && (
                    <div className={element('toolbar')}>
                        {tags && <div className={element('tags')}>{tags}</div>}
                        {actions && <div className={element('actions')}>{actions}</div>}
                    </div>
                )}
            </div>
        </div>
    );
});
PostBlock.displayName = COMPONENT_NAME;
PostBlock.className = CLASSNAME;
PostBlock.defaultProps = DEFAULT_PROPS;
