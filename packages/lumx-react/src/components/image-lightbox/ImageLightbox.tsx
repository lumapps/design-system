import React, { forwardRef } from 'react';

import classNames from 'classnames';
import { Lightbox } from '@lumx/react';
import { ClickAwayProvider } from '@lumx/react/utils';
import type { Comp } from '@lumx/react/utils/type';
import { useMergeRefs } from '@lumx/react/utils/mergeRefs';

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

    const onClickAway = React.useCallback(
        (evt: Event) => {
            const targetElement = evt.target;
            if (!(targetElement instanceof HTMLElement) || !(evt instanceof MouseEvent)) return;

            // Skip click away if clicking on the scrollbar
            if (targetElement.clientWidth < evt.clientX || targetElement.clientHeight < evt.clientY) return;

            onClose?.();
        },
        [onClose],
    );

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
            // Disable the close on click away as we want a custom one here
            preventAutoClose
        >
            <ClickAwayProvider childrenRefs={clickAwayChildrenRefs} callback={onClickAway}>
                <ImageSlideshow
                    activeImageIndex={activeImageIndex}
                    slideGroupLabel={slideGroupLabel}
                    slideshowControlsProps={slideshowControlsProps}
                    images={images}
                    zoomInButtonProps={zoomInButtonProps}
                    zoomOutButtonProps={zoomOutButtonProps}
                    footerRef={footerRef}
                    activeImageRef={useMergeRefs(propImageRef, imageRef)}
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
