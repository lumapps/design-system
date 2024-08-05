import React, { forwardRef } from 'react';

import classNames from 'classnames';
import { Lightbox } from '@lumx/react';
import { ClickAwayProvider } from '@lumx/react/utils';
import type { Comp } from '@lumx/react/utils/type';
import { mergeRefs } from '@lumx/react/utils/mergeRefs';

import { ImageSlideshow } from './internal/ImageSlideshow';
import { useImageLightbox } from './useImageLightbox';
import type { ImageLightboxProps } from './types';
import { CLASSNAME, COMPONENT_NAME } from './constants';

const Inner: Comp<ImageLightboxProps, HTMLDivElement> = forwardRef((props, ref) => {
    const {
        className,
        isOpen,
        closeButtonProps,
        onClose,
        parentElement,
        activeImageIndex,
        slideshowControlsProps,
        slideGroupLabel,
        images,
        zoomOutButtonProps,
        zoomInButtonProps,
        activeImageRef: propImageRef,
        ...forwardedProps
    } = props;
    const currentPaginationItemRef = React.useRef(null);
    const footerRef = React.useRef(null);
    const imageRef = React.useRef(null);
    const clickAwayChildrenRefs = React.useRef([imageRef, footerRef]);

    return (
        <Lightbox
            ref={ref}
            className={classNames(className, CLASSNAME)}
            parentElement={parentElement}
            isOpen={isOpen}
            onClose={onClose}
            closeButtonProps={closeButtonProps}
            focusElement={currentPaginationItemRef}
            {...forwardedProps}
        >
            <ClickAwayProvider childrenRefs={clickAwayChildrenRefs} callback={onClose}>
                <ImageSlideshow
                    activeImageIndex={activeImageIndex}
                    slideGroupLabel={slideGroupLabel}
                    slideshowControlsProps={slideshowControlsProps}
                    images={images}
                    zoomInButtonProps={zoomInButtonProps}
                    zoomOutButtonProps={zoomOutButtonProps}
                    footerRef={footerRef}
                    activeImageRef={mergeRefs(propImageRef, imageRef)}
                    currentPaginationItemRef={currentPaginationItemRef}
                />
            </ClickAwayProvider>
        </Lightbox>
    );
});
Inner.displayName = COMPONENT_NAME;
Inner.className = CLASSNAME;

/**
 * ImageLightbox component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const ImageLightbox = Object.assign(Inner, { useImageLightbox });
