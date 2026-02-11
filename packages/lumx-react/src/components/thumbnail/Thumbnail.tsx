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
    CLASSNAME,
    COMPONENT_NAME,
    DEFAULT_PROPS,
    ThumbnailProps as UIProps,
    element,
} from '@lumx/core/js/components/Thumbnail';
import { FocusPoint } from '@lumx/core/js/components/Thumbnail/types';

/**
 * Defines the props of the component.
 */
export interface ThumbnailProps extends GenericProps, Omit<UIProps, 'badge'> {
    /** Apply relative vertical and horizontal shift (from -1 to 1) on the image position inside the thumbnail. */
    focusPoint?: FocusPoint;
    /** Badge. */
    badge?: ReactElement | Falsy;
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
    const { image, theme = defaultTheme } = otherProps;
    const [imgElement, setImgElement] = useState<HTMLImageElement>();

    // Image loading state.
    const loadingState = useImageLoad(image, imgElement);
    const isLoaded = loadingState === 'isLoaded';

    // Focus point.
    const focusPointStyle = useFocusPointStyle(props, imgElement, isLoaded);

    return UI({
        ref,
        focusPointStyle,
        loadingState,
        isAnyDisabled,
        theme,
        disabledStateProps,
        ...otherProps,
        badge:
            props.badge &&
            React.cloneElement(props.badge, {
                className: classNames.join(element('badge'), props.badge.props.className),
            }),
        imgRef: useMergeRefs(setImgElement, props.imgRef),
    });
});

Thumbnail.displayName = COMPONENT_NAME;
Thumbnail.className = CLASSNAME;
Thumbnail.defaultProps = DEFAULT_PROPS as ThumbnailProps;
