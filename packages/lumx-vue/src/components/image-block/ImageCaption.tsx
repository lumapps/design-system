import { defineComponent } from 'vue';

import { ImageCaption as UI } from '@lumx/core/js/components/ImageBlock/ImageCaption';
import { type HorizontalAlignment, type Theme } from '@lumx/core/js/constants';

import { useTheme } from '../../composables/useTheme';
import { keysOf } from '../../utils/VueToJSX';
import { FlexBox } from '../flex-box';
import { Text } from '../text';

type ImageCaptionProps = {
    as?: 'div' | 'figcaption';
    align?: HorizontalAlignment;
    baseClassName?: string;
    captionStyle?: Record<string, any>;
    class?: string;
    description?: any;
    descriptionProps?: Record<string, any>;
    tags?: any;
    theme?: Theme;
    title?: string;
    titleProps?: Record<string, any>;
    truncate?: boolean;
};

/** Internal component used to render image captions */
const ImageCaption = defineComponent(
    (props: ImageCaptionProps) => {
        const defaultTheme = useTheme();

        return () => {
            const { class: _class, theme, align, ...restProps } = props as any;
            return (
                <UI
                    {...(restProps as any)}
                    align={align}
                    theme={theme || defaultTheme.value}
                    FlexBox={FlexBox}
                    Text={Text}
                    wrapperProps={{ verticalAlign: align, horizontalAlign: align === 'center' ? align : undefined }}
                />
            );
        };
    },
    {
        name: 'LumxImageCaption',
        inheritAttrs: false,
        props: keysOf<ImageCaptionProps>()(
            'align',
            'as',
            'baseClassName',
            'captionStyle',
            'class',
            'description',
            'descriptionProps',
            'tags',
            'theme',
            'title',
            'titleProps',
            'truncate',
        ),
    },
);

export default ImageCaption;
