import { defineComponent, useAttrs } from 'vue';

import {
    ImageBlock as UI,
    type ImageBlockProps as UIProps,
    CLASSNAME,
    COMPONENT_NAME,
    DEFAULT_PROPS,
    ImageBlockCaptionPosition,
    ImageBlockPropsToOverride,
} from '@lumx/core/js/components/ImageBlock';

import { useTheme } from '../../composables/useTheme';
import { useClassName } from '../../composables/useClassName';
import { keysOf, VueToJSXProps } from '../../utils/VueToJSX';
import { Thumbnail, ThumbnailProps } from '../thumbnail';
import ImageCaption from './ImageCaption';

export type ImageBlockProps = Omit<VueToJSXProps<UIProps, ImageBlockPropsToOverride>, never> & {
    /** Props to pass to the thumbnail (minus those already set by the ImageBlock props). */
    thumbnailProps?: Omit<ThumbnailProps, 'image' | 'size' | 'theme' | 'align' | 'fillHeight' | 'alt'>;
};

export { CLASSNAME, COMPONENT_NAME, DEFAULT_PROPS, ImageBlockCaptionPosition };

/**
 * ImageBlock component.
 *
 * @param  props Component props.
 * @return Vue element.
 */
const ImageBlock = defineComponent(
    (props: ImageBlockProps, { slots }) => {
        const attrs = useAttrs();
        const defaultTheme = useTheme();
        const className = useClassName(() => props.class);

        return () => {
            const { class: _class, theme, tags: tagsProp, actions: actionsProp, ...restProps } = props as any;
            const tags = (slots.tags?.() ?? tagsProp) as any;
            const actions = (slots.actions?.() ?? actionsProp) as any;

            return (
                <UI
                    {...(restProps as any)}
                    {...attrs}
                    className={className.value}
                    theme={theme || defaultTheme.value}
                    tags={tags}
                    actions={actions}
                    Thumbnail={Thumbnail}
                    ImageCaption={ImageCaption}
                />
            );
        };
    },
    {
        name: 'LumxImageBlock',
        inheritAttrs: false,
        props: keysOf<ImageBlockProps>()(
            'actions',
            'align',
            'alt',
            'captionPosition',
            'captionStyle',
            'class',
            'description',
            'descriptionProps',
            'fillHeight',
            'image',
            'size',
            'tags',
            'theme',
            'thumbnailProps',
            'title',
            'titleProps',
        ),
    },
);

export default ImageBlock;
