import React from 'react';

import { AspectRatio, FocusPoint, Theme, Thumbnail } from '@lumx/react';
import { COMPONENT_PREFIX } from '@lumx/react/constants';
import { GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';
import classNames from 'classnames';
import take from 'lodash/take';

interface MosaicElement {
    url: string;
    focusPoint?: FocusPoint;
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
const Mosaic: React.FC<MosaicProps> = ({ className, theme = DEFAULT_PROPS.theme, thumbnails, ...props }) => (
    <div
        className={classNames(className, handleBasicClasses({ prefix: CLASSNAME, theme }), {
            [`${CLASSNAME}--has-1-thumbnail`]: thumbnails?.length === 1,
            [`${CLASSNAME}--has-2-thumbnails`]: thumbnails?.length === 2,
            [`${CLASSNAME}--has-3-thumbnails`]: thumbnails?.length === 3,
            [`${CLASSNAME}--has-4-thumbnails`]: thumbnails?.length >= 4,
        })}
        {...props}
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
                            tabIndex={thumbnail.onClick && '0'}
                            onClick={handleClick}
                            aspectRatio={AspectRatio.free}
                            fillHeight
                            image={thumbnail.url}
                            theme={theme}
                            focusPoint={thumbnail.focusPoint}
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
