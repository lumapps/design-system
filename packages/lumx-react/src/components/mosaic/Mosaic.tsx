import React, { forwardRef, MouseEventHandler, useMemo } from 'react';

import { Alignment, AspectRatio, Theme, Thumbnail, ThumbnailProps } from '@lumx/react';
import { Comp, GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';
import classNames from 'classnames';
import take from 'lodash/take';

/**
 * Defines the props of the component.
 */
export interface MosaicProps extends GenericProps {
    /** Theme adapting the component to light or dark background. */
    theme?: Theme;
    /** Thumbnails. */
    thumbnails: ThumbnailProps[];
    /** On image click callback. */
    onImageClick?(index: number): void;
}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'Mosaic';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * Component default props.
 */
const DEFAULT_PROPS: Partial<MosaicProps> = {
    theme: Theme.light,
};

/**
 * Mosaic component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const Mosaic: Comp<MosaicProps, HTMLDivElement> = forwardRef((props, ref) => {
    const { className, theme, thumbnails, onImageClick, ...forwardedProps } = props;
    const handleImageClick = useMemo(() => {
        if (!onImageClick) return undefined;

        return (index: number, onClick?: MouseEventHandler): MouseEventHandler => (event) => {
            onClick?.(event);
            onImageClick?.(index);
        };
    }, [onImageClick]);

    return (
        <div
            ref={ref}
            {...forwardedProps}
            className={classNames(className, handleBasicClasses({ prefix: CLASSNAME, theme }), {
                [`${CLASSNAME}--has-1-thumbnail`]: thumbnails?.length === 1,
                [`${CLASSNAME}--has-2-thumbnails`]: thumbnails?.length === 2,
                [`${CLASSNAME}--has-3-thumbnails`]: thumbnails?.length === 3,
                [`${CLASSNAME}--has-4-thumbnails`]: thumbnails?.length >= 4,
            })}
        >
            <div className={`${CLASSNAME}__wrapper`}>
                {take(thumbnails, 4).map((thumbnail: any, index: number) => {
                    const { image, onClick, align, ...thumbnailProps } = thumbnail;

                    return (
                        <div key={index} className={`${CLASSNAME}__thumbnail`}>
                            <Thumbnail
                                {...thumbnailProps}
                                align={align || Alignment.left}
                                image={image}
                                theme={theme}
                                aspectRatio={AspectRatio.free}
                                fillHeight
                                onClick={handleImageClick?.(index, onClick) || onClick}
                            />

                            {thumbnails.length > 4 && index === 3 && (
                                <div className={`${CLASSNAME}__overlay`}>
                                    <span>+{thumbnails.length - 4}</span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
});
Mosaic.displayName = COMPONENT_NAME;
Mosaic.className = CLASSNAME;
Mosaic.defaultProps = DEFAULT_PROPS;
