import take from 'lodash/take';

import { Alignment, AspectRatio } from '../../constants';
import type { CommonRef, HasClassName, LumxClassName, HasTheme } from '../../types';
import { classNames } from '../../utils';

/**
 * Defines the props of the component.
 */
export interface MosaicProps extends HasClassName, HasTheme {
    /** Thumbnails. */
    thumbnails: any[];
    /** On image click callback. */
    handleClick?(index: number): void;
    Thumbnail: any;
    ref?: CommonRef;
}

export type MosaicPropsToOverride = 'Thumbnail' | 'thumbnails';

/**
 * Component display name.
 */
export const COMPONENT_NAME = 'Mosaic';

/**
 * Component default class name and class prefix.
 */
export const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-mosaic';
export const { block, element } = classNames.bem(CLASSNAME);

/**
 * Component default props.
 */
export const DEFAULT_PROPS: Partial<MosaicProps> = {};

/**
 * Mosaic component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const Mosaic = (props: MosaicProps) => {
    const { className, theme, thumbnails, handleClick, Thumbnail, ref, ...forwardedProps } = props;
    const onImageClick = () => {
        if (!handleClick) return undefined;

        return (index: number, onClick?: any): any =>
            (event: any) => {
                onClick?.(event);
                handleClick?.(index);
            };
    };

    return (
        <div
            ref={ref}
            {...forwardedProps}
            className={classNames.join(
                className,
                block({
                    [`theme-${theme}`]: Boolean(theme),
                    'has-1-thumbnail': thumbnails?.length === 1,
                    'has-2-thumbnails': thumbnails?.length === 2,
                    'has-3-thumbnails': thumbnails?.length === 3,
                    'has-4-thumbnails': thumbnails?.length >= 4,
                }),
            )}
        >
            <div className={element('wrapper')}>
                {take(thumbnails, 4).map((thumbnail: any, index: number) => {
                    const { image, onClick, align, ...thumbnailProps } = thumbnail;

                    return (
                        <div key={index} className={element('thumbnail')}>
                            <Thumbnail
                                {...thumbnailProps}
                                align={align || Alignment.left}
                                image={image}
                                theme={theme}
                                aspectRatio={AspectRatio.free}
                                fillHeight
                                onClick={onImageClick()?.(index, onClick) || onClick}
                            />

                            {thumbnails.length > 4 && index === 3 && (
                                <div className={element('overlay')}>
                                    <span>+{thumbnails.length - 4}</span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
