import { AspectRatio, Theme, Thumbnail } from '@lumx/react';
import { COMPONENT_PREFIX } from '@lumx/react/constants';
import { IGenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';
import classNames from 'classnames';
import React, { ReactElement } from 'react';

/////////////////////////////

/**
 * Defines the props of the component.
 */
interface IMosaicProps extends IGenericProps {
    theme?: Theme;
    thumbnails: string[];
}

interface IDefaultPropsType extends Partial<IMosaicProps> {}

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
const DEFAULT_PROPS: IDefaultPropsType = {
    theme: Theme.light,
};

const Mosaic: React.FC<IMosaicProps> = ({
    className = '',
    theme = DEFAULT_PROPS.theme,
    thumbnails,
    ...props
}: IMosaicProps): ReactElement => (
    <div
        className={classNames(className, handleBasicClasses({ prefix: CLASSNAME, theme }), {
            [`${CLASSNAME}--has-2-thumbnails`]: thumbnails.length === 2,
            [`${CLASSNAME}--has-3-thumbnails`]: thumbnails.length === 3,
            [`${CLASSNAME}--has-4-thumbnails`]: thumbnails.length >= 4,
        })}
        {...props}
    >
        <div className={`${CLASSNAME}__wrapper`}>
            {thumbnails.map((thumbnail, index) => (
                <div key={index} className={`${CLASSNAME}__thumbnail`}>
                    <Thumbnail aspectRatio={AspectRatio.free} fillHeight image={thumbnail} theme={theme} />

                    {thumbnails.length > 4 && index === 3 && (
                        <div className={`${CLASSNAME}__overlay`}>
                            <span>+{thumbnails.length - 4}</span>
                        </div>
                    )}
                </div>
            ))}
        </div>
    </div>
);

Mosaic.displayName = COMPONENT_NAME;

export { CLASSNAME, DEFAULT_PROPS, Mosaic, IMosaicProps };
