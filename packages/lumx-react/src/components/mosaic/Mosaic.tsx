import React, { forwardRef, MouseEventHandler, useCallback } from 'react';

import { AspectRatio, Theme, Thumbnail, ThumbnailProps } from '@lumx/react';
import { COMPONENT_PREFIX } from '@lumx/react/constants';
import { Comp, GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';
import classNames from 'classnames';
import take from 'lodash/take';

/**
 * Defines the props of the component.
 */
export interface MosaicProps extends GenericProps {
    /** The theme to apply to the component. Can be either 'light' or 'dark'. */
    theme?: Theme;
    /** The list of thumbnails. */
    thumbnails: Array<Omit<ThumbnailProps, 'theme' | 'aspectRatio' | 'fillHeight' | 'tabIndex'>>;
    /** The function called on click on a mosaic image. */
    onImageClick?(index: number): void;
}

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}Mosaic`;

/**
 * The default class name and classes prefix for this component.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
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
    const handleImageClick = useCallback(
        (index: number, onClick?: MouseEventHandler): MouseEventHandler => (event) => {
            onClick?.(event);
            onImageClick?.(index);
        },
        [onImageClick],
    );
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
                    const { image, onClick, ...thumbnailProps } = thumbnail;

                    return (
                        <div key={index} className={`${CLASSNAME}__thumbnail`}>
                            <Thumbnail
                                {...thumbnailProps}
                                image={image}
                                theme={theme}
                                aspectRatio={AspectRatio.free}
                                fillHeight
                                tabIndex={(onClick || onImageClick) && '0'}
                                onClick={handleImageClick(index, onClick)}
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
