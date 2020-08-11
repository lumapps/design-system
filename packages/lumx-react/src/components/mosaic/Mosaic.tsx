import React from 'react';

import { AspectRatio, CrossOrigin, FocusPoint, Theme, Thumbnail } from '@lumx/react';
import { COMPONENT_PREFIX } from '@lumx/react/constants';
import { GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';
import classNames from 'classnames';
import take from 'lodash/take';

interface MosaicElement {
    /**
     * Allows images that are loaded from foreign origins
     * to be used as if they had been loaded from the current origin.
     */
    crossOrigin?: CrossOrigin;
    focusPoint?: FocusPoint;
    /** Active cross origin. */
    isCrossOriginEnabled?: boolean;
    url: string;
    onClick?(index: number): void;
}

/**
 * Defines the props of the component.
 */
interface MosaicProps extends GenericProps {
    theme?: Theme;
    thumbnails: MosaicElement[];
}

interface DefaultPropsType extends Partial<MosaicProps> {}

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
const DEFAULT_PROPS: DefaultPropsType = {
    theme: Theme.light,
};
const Mosaic: React.FC<MosaicProps> = ({ className, theme = DEFAULT_PROPS.theme, thumbnails, ...forwardedProps }) => (
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
            {take(thumbnails, 4).map((thumbnail, index) => {
                const handleClick = () => {
                    if (thumbnail.onClick) {
                        thumbnail.onClick(index);
                    }
                };

                return (
                    <div key={index} className={`${CLASSNAME}__thumbnail`}>
                        <Thumbnail
                            aspectRatio={AspectRatio.free}
                            crossOrigin={thumbnail.crossOrigin}
                            fillHeight
                            focusPoint={thumbnail.focusPoint}
                            image={thumbnail.url}
                            isCrossOriginEnabled={thumbnail.isCrossOriginEnabled}
                            tabIndex={thumbnail.onClick && '0'}
                            theme={theme}
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

export { CLASSNAME, DEFAULT_PROPS, Mosaic, MosaicProps };
