import { ReactNode } from 'react';

import { Orientation, Theme, Thumbnail, ThumbnailProps, ThumbnailVariant } from '@lumx/react';
import { GenericProps, HasTheme } from '@lumx/react/utils/type';
import type { LumxClassName } from '@lumx/core/js/types';
import { classNames } from '@lumx/core/js/utils';
import { useTheme } from '@lumx/react/utils/theme/ThemeContext';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';

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
const { block, element } = classNames.bem(CLASSNAME);

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

    return (
        <div
            ref={ref}
            className={classNames.join(
                className,
                block({
                    [`orientation-${orientation}`]: Boolean(orientation),
                    [`theme-${theme}`]: Boolean(theme),
                }),
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

                {typeof text === 'string' ? (
                    <p className={element('text')}>{text}</p>
                ) : (
                    // eslint-disable-next-line react/no-danger
                    <p dangerouslySetInnerHTML={text} className={element('text')} />
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
