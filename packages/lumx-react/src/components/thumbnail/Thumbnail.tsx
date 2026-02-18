import React, { ReactElement, useState } from 'react';

import { Theme } from '@lumx/react';
import { Falsy, GenericProps } from '@lumx/react/utils/type';
import { classNames } from '@lumx/core/js/utils';
import { useMergeRefs } from '@lumx/react/utils/react/mergeRefs';
import { useImageLoad } from '@lumx/react/components/thumbnail/useImageLoad';
import { useFocusPointStyle } from '@lumx/react/components/thumbnail/useFocusPointStyle';
import { useTheme } from '@lumx/react/utils/theme/ThemeContext';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';

import { useDisableStateProps } from '@lumx/react/utils/disabled';
import {
    Thumbnail as UI,
    ThumbnailProps as UIProps,
    CLASSNAME,
    COMPONENT_NAME,
    DEFAULT_PROPS,
    element,
} from '@lumx/core/js/components/Thumbnail';
import { ReactToJSX } from '@lumx/react/utils/type/ReactToJSX';
import { FocusPoint } from './types';

/**
 * Defines the props of the component.
 */
export interface ThumbnailProps
    extends GenericProps,
        ReactToJSX<UIProps, 'loadingState' | 'isAnyDisabled' | 'focusPointStyle' | 'disabledStateProps' | 'badge'> {
    /** Apply relative vertical and horizontal shift (from -1 to 1) on the image position inside the thumbnail. */
    focusPoint?: FocusPoint;
    /** Badge. */
    badge?: ReactElement | Falsy;
    /** On click callback. */
    onClick?: React.MouseEventHandler<HTMLDivElement>;
    /** On key press callback. */
    onKeyPress?: React.KeyboardEventHandler<HTMLDivElement>;
}

/**
 * Thumbnail component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const Thumbnail = forwardRef<ThumbnailProps>((props, ref) => {
    const { isAnyDisabled, otherProps, disabledStateProps } = useDisableStateProps(props);
    const defaultTheme = useTheme() || Theme.light;
    const { badge, focusPoint, image, imgRef: propImgRef, ...forwardedProps } = otherProps;
    const [imgElement, setImgElement] = useState<HTMLImageElement>();

    // Image loading state.
    const loadingState = useImageLoad(image, imgElement);
    const isLoaded = loadingState === 'isLoaded';

    // Focus point.
    const focusPointStyle = useFocusPointStyle(props, imgElement, isLoaded);

    return UI({
        ref,
        ...forwardedProps,
        theme: forwardedProps.theme || defaultTheme,
        isAnyDisabled,
        disabledStateProps,
        focusPointStyle,
        loadingState,
        imgRef: useMergeRefs(setImgElement, propImgRef),
        image,
        badge:
            badge &&
            React.cloneElement(badge, {
                className: classNames.join(element('badge'), badge.props.className),
            }),
    });
});

Thumbnail.displayName = COMPONENT_NAME;
Thumbnail.className = CLASSNAME;
Thumbnail.defaultProps = DEFAULT_PROPS as ThumbnailProps;
