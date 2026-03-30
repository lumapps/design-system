import { useTheme } from '@lumx/react/utils/theme/ThemeContext';

import { Theme, Thumbnail, ThumbnailProps } from '@lumx/react';
import { GenericProps } from '@lumx/react/utils/type';
import {
    CLASSNAME,
    COMPONENT_NAME,
    DEFAULT_PROPS,
    Mosaic as UI,
    MosaicProps as UIProps,
    MosaicPropsToOverride,
} from '@lumx/core/js/components/Mosaic';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import { ReactToJSX } from '@lumx/react/utils/type/ReactToJSX';

/**
 * Defines the props of the component.
 */
export interface MosaicProps extends GenericProps, ReactToJSX<UIProps, MosaicPropsToOverride> {
    /** Thumbnails. */
    thumbnails: ThumbnailProps[];
    /** On image click callback. */
    onImageClick?(index: number): void;
}

/**
 * Mosaic component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const Mosaic = forwardRef<MosaicProps, HTMLDivElement>((props, ref) => {
    const defaultTheme = useTheme() || Theme.light;
    const { theme = defaultTheme, onImageClick, ...forwardedProps } = props;

    return UI({
        ref,
        theme,
        Thumbnail,
        handleClick: onImageClick,
        ...forwardedProps,
    });
});

Mosaic.displayName = COMPONENT_NAME;
Mosaic.className = CLASSNAME;
Mosaic.defaultProps = DEFAULT_PROPS;
