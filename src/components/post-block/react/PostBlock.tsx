import React, { ReactElement, ReactNode, useEffect, useRef, useState } from 'react';

import { CSS_PREFIX } from 'LumX/core/constants';

import { COMPONENT_PREFIX } from 'LumX/core/react/constants';

import { Orientation, Theme, Thumbnail, ThumbnailAspectRatio, ThumbnailVariant } from 'LumX';

import { IGenericProps, getRootClassName } from 'LumX/core/react/utils';

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
const COMPONENT_NAME = `${COMPONENT_PREFIX}Progress`;

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
 * Simple Progress component that can be displayed as a linear or circular element
 *
 * @return The component.
 */
const PostBlock: React.FC<PostBlockProps> = ({
    actions,
    attachments,
    author,
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
    const [hasActions, setHasActions] = useState(false);
    const [hasAttachments, setHasAttachments] = useState(false);
    const [hasAuthor, setHasAuthor] = useState(false);
    const [hasTags, setHasTags] = useState(false);

    const el = useRef<HTMLDivElement>(null);

    const deleteElementClasses = (classRegex: RegExp): void => {
        if (!el || !el.current) {
            return;
        }

        const classesToDelete: string[] = el.current.classList.value
            .split(' ')
            .filter((value: string) => value.match(classRegex));

        for (const classItem of classesToDelete) {
            el.current.classList.remove(classItem);
        }
    };

    useEffect((): void => {
        if (actions) {
            setHasActions(true);
        }

        if (author) {
            setHasAuthor(true);
        }

        if (attachments) {
            setHasAttachments(true);
        }

        if (tags) {
            setHasTags(true);
        }
    }, [actions, author, tags]);

    useEffect((): void => {
        if (!el || !el.current) {
            return;
        }

        if (!theme) {
            el.current.classList.add(`${CSS_PREFIX}-post-block--theme-${DEFAULT_PROPS.theme}`);
        }

        deleteElementClasses(/(?:\S|-)*post-block--orientation-\S+/g);

        el.current.classList.add(`${CSS_PREFIX}-post-block--orientation-${orientation}`);
    }, [el, theme]);

    useEffect((): void => {
        if (!el || !el.current) {
            return;
        }

        if (!orientation) {
            el.current.classList.add(`${CSS_PREFIX}-post-block--orientation-${DEFAULT_PROPS.orientation}`);
        }

        deleteElementClasses(/(?:\S|-)*post-block--orientation-\S+/g);

        el.current.classList.add(`${CSS_PREFIX}-post-block--orientation-${orientation}`);
    }, [el, orientation]);

    return (
        <div ref={el} className="lumx-post-block">
            {thumbnail && (
                <div className="lumx-post-block__thumbnail">
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

            <div className="lumx-post-block__wrapper">
                {hasAuthor && <div className="lumx-post-block__author">{author}</div>}

                {title && (
                    <a className="lumx-post-block__title" onClick={onClick}>
                        {title}
                    </a>
                )}

                {meta && <span className="lumx-post-block__meta">{meta}</span>}

                <p className="lumx-post-block__text">{text}</p>

                {hasAttachments && <div className="lumx-post-block__attachments">{attachments}</div>}
                {hasTags && <div className="lumx-post-block__tags">{tags}</div>}
                {hasActions && <div className="lumx-post-block__actions">{actions}</div>}
            </div>
        </div>
    );
};

PostBlock.displayName = COMPONENT_NAME;

/////////////////////////////

export { CLASSNAME, DEFAULT_PROPS, PostBlock, PostBlockProps };
