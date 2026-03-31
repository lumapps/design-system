import { defineComponent, useAttrs } from 'vue';

import {
    ImageBlock as UI,
    type ImageBlockProps as UIProps,
    CLASSNAME,
    COMPONENT_NAME,
    DEFAULT_PROPS,
    ImageBlockCaptionPosition,
} from '@lumx/core/js/components/ImageBlock';

import { useTheme } from '../../composables/useTheme';
import { keysOf, VueToJSXProps } from '../../utils/VueToJSX';
import { Thumbnail } from '../thumbnail';
import ImageCaption from './ImageCaption';

export type ImageBlockProps = Omit<
    VueToJSXProps<
        UIProps,
        'Thumbnail' | 'ImageCaption' | 'FlexBox' | 'Text' | 'titleProps' | 'descriptionProps' | 'captionStyle'
    >,
    never
> & {
    titleProps?: Record<string, any>;
    descriptionProps?: Record<string, any>;
    captionStyle?: Record<string, any>;
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

        return () => {
            const { class: className, theme, tags: tagsProp, actions: actionsProp, ...restProps } = props as any;
            const tags = (slots.tags?.() ?? tagsProp) as any;
            const actions = (slots.actions?.() ?? actionsProp) as any;

            return (
                <UI
                    {...(restProps as any)}
                    {...attrs}
                    className={className}
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
