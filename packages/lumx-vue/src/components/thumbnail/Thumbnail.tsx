import { computed, defineComponent, ref, toRef, useAttrs } from 'vue';

import {
    Thumbnail as ThumbnailUI,
    type ThumbnailProps as UIProps,
    CLASSNAME,
    COMPONENT_NAME,
    DEFAULT_PROPS,
    element,
} from '@lumx/core/js/components/Thumbnail';
import { type FocusPoint } from '@lumx/core/js/components/Thumbnail/types';
import { classNames } from '@lumx/core/js/utils';
import { JSXElement } from '@lumx/core/js/types';

import { useTheme } from '../../composables/useTheme';
import { useDisableStateProps } from '../../composables/useDisableStateProps';
import { useHasEventListener } from '../../composables/useHasEventListener';
import { keysOf, VueToJSXProps } from '../../utils/VueToJSX';
import { useImageLoad } from './useImageLoad';
import { useFocusPointStyle } from './useFocusPointStyle';

export type ThumbnailProps = VueToJSXProps<
    Omit<
        UIProps,
        'loadingState' | 'isAnyDisabled' | 'focusPointStyle' | 'disabledStateProps' | 'badge' | 'imgRef' | 'fallback'
    >
> & {
    /** Apply relative vertical and horizontal shift (from -1 to 1) on the image position inside the thumbnail. */
    focusPoint?: FocusPoint;
    /** ARIA disabled state */
    'aria-disabled'?: boolean | 'true' | 'false';
};

export const emitSchema = {
    click: (event: Event) => event instanceof Event,
    keyPress: (event: Event) => event instanceof Event,
};

export { CLASSNAME, COMPONENT_NAME, DEFAULT_PROPS };

/**
 * Thumbnail component.
 *
 * @param  props Component props.
 * @return Vue element.
 */
const Thumbnail = defineComponent(
    (props: ThumbnailProps, { emit, slots }) => {
        const attrs = useAttrs();
        const defaultTheme = useTheme();
        const imgElement = ref<HTMLImageElement>();

        const hasClickListener = useHasEventListener('onClick');
        const hasKeyPressListener = useHasEventListener('onKeyPress');

        const { isAnyDisabled, disabledStateProps, otherProps } = useDisableStateProps(
            computed(() => ({ ...props, ...attrs })),
        );

        // Image loading state.
        const loadingState = useImageLoad(
            toRef(() => props.image),
            imgElement,
        );
        const isLoaded = computed(() => loadingState.value === 'isLoaded');

        // Focus point style.
        const focusPointStyle = useFocusPointStyle({
            image: toRef(() => props.image),
            aspectRatio: toRef(() => props.aspectRatio),
            focusPoint: toRef(() => props.focusPoint),
            width: toRef(() => (typeof props.imgProps?.width === 'number' ? props.imgProps.width : undefined)),
            height: toRef(() => (typeof props.imgProps?.height === 'number' ? props.imgProps.height : undefined)),
            element: imgElement,
            isLoaded,
        });

        const handleClick = (event: Event) => {
            if (isAnyDisabled.value) {
                return;
            }

            event.stopImmediatePropagation();
            emit('click', event);
        };

        const handleKeyPress = (event: Event) => {
            if (isAnyDisabled.value) {
                return;
            }

            event.stopImmediatePropagation();
            emit('keyPress', event);
        };

        return () => {
            const badge = slots.badge?.();
            const fallback = slots.fallback?.();

            return (
                <ThumbnailUI
                    {...otherProps.value}
                    {...{ onClick: hasClickListener ? handleClick : undefined }}
                    {...{ onKeyPress: hasKeyPressListener ? handleKeyPress : undefined }}
                    className={props.class}
                    theme={props.theme || defaultTheme.value}
                    isAnyDisabled={isAnyDisabled.value}
                    disabledStateProps={disabledStateProps.value}
                    focusPointStyle={focusPointStyle.value}
                    loadingState={loadingState.value}
                    imgRef={imgElement}
                    image={props.image}
                    fallback={fallback as JSXElement}
                    badge={
                        badge &&
                        (Array.isArray(badge)
                            ? badge.map((b: any) => ({
                                  ...b,
                                  props: {
                                      ...b.props,
                                      class: classNames.join(element('badge'), b.props?.class),
                                  },
                              }))
                            : {
                                  ...(badge as any),
                                  props: {
                                      ...(badge as any).props,
                                      class: classNames.join(element('badge'), (badge as any).props?.class),
                                  },
                              })
                    }
                />
            );
        };
    },
    {
        name: 'LumxThumbnail',
        inheritAttrs: false,
        props: keysOf<ThumbnailProps>()(
            'align',
            'alt',
            'aspectRatio',
            'class',
            'crossOrigin',
            'fillHeight',
            'focusPoint',
            'image',
            'imgProps',
            'isLoading',
            'linkAs',
            'linkProps',
            'loading',
            'loadingPlaceholderImageRef',
            'objectFit',
            'size',
            'theme',
            'variant',
            'aria-disabled',
            'aria-label',
        ),
        emits: emitSchema,
    },
);

export default Thumbnail;
