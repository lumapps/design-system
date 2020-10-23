import React from 'react';

import { AspectRatio, Theme, Thumbnail, ThumbnailProps } from '@lumx/react';
import { COMPONENT_PREFIX } from '@lumx/react/constants';
import { GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';
import classNames from 'classnames';
import take from 'lodash/take';

interface MosaicElement extends Omit<ThumbnailProps, 'aspectRatio' | 'fillHeight' | 'theme' | 'image'> {
    /** @deprecated Use `image` instead. */
    url: string;
    /** @todo breaking change removing the `url` prop and making the `image` required. */
    image?: ThumbnailProps['image'];
    onClick?(index: number): void;
}

/**
 * Defines the props of the component.
 */
interface MosaicProps extends GenericProps {
    theme?: Theme;
    thumbnails: MosaicElement[];
}

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}Mosaic`;

/**
 * The default class name and classes prefix for this component.
 */
const CLASSNAME: string = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
 */
const DEFAULT_PROPS: Partial<MosaicProps> = {
    theme: Theme.light,
};

const Mosaic: React.FC<MosaicProps> = ({ className, theme, thumbnails, ...forwardedProps }) => (
    <div
        {...forwardedProps}
        className={classNames(className, handleBasicClasses({ prefix: CLASSNAME, theme }), {
            [`${CLASSNAME}--has-1-thumbnail`]: thumbnails?.length === 1,
            [`${CLASSNAME}--has-2-thumbnails`]: thumbnails?.length === 2,
            [`${CLASSNAME}--has-3-thumbnails`]: thumbnails?.length === 3,
            [`${CLASSNAME}--has-4-thumbnails`]: thumbnails?.length >= 4,
        })}
    >
        <div className={`${CLASSNAME}__wrapper`}>
            {take(thumbnails, 4).map(({ url, image, onClick, ...thumbnail }, index) => {
                const handleClick = () => {
                    if (onClick) {
                        onClick(index);
                    }
                };

                return (
                    <div key={index} className={`${CLASSNAME}__thumbnail`}>
                        <Thumbnail
                            {...thumbnail}
                            theme={theme}
                            image={image ?? url}
                            aspectRatio={AspectRatio.free}
                            fillHeight
                            tabIndex={onClick && '0'}
                            onClick={handleClick}
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

Mosaic.displayName = COMPONENT_NAME;
Mosaic.defaultProps = DEFAULT_PROPS;

export { CLASSNAME, Mosaic, MosaicProps };
