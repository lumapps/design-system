import { defineComponent, toRaw, useAttrs } from 'vue';

import {
    LinkPreview as LinkPreviewUI,
    type LinkPreviewProps as UIProps,
    COMPONENT_NAME,
    DEFAULT_PROPS,
} from '@lumx/core/js/components/LinkPreview';

import { Link } from '../link';
import { Thumbnail } from '../thumbnail';
import { useTheme } from '../../composables/useTheme';
import { useClassName } from '../../composables/useClassName';
import { keysOf, VueToJSXProps } from '../../utils/VueToJSX';

export type LinkPreviewProps = VueToJSXProps<UIProps, 'TitleHeading' | 'Link' | 'Thumbnail'> & {
    /** Customize the title heading tag. */
    titleHeading?: string;
};

export { COMPONENT_NAME };

/**
 * LinkPreview component.
 *
 * @param  props Component props.
 * @return Vue element.
 */
const LinkPreview = defineComponent(
    (props: LinkPreviewProps) => {
        const attrs = useAttrs();
        const defaultTheme = useTheme();
        const className = useClassName(() => props.class);

        return () => {
            const { titleHeading = DEFAULT_PROPS.titleHeading, linkAs, ...restProps } = props;

            return (
                <LinkPreviewUI
                    {...restProps}
                    {...attrs}
                    linkAs={toRaw(linkAs)}
                    className={className.value}
                    theme={props.theme || defaultTheme.value}
                    TitleHeading={titleHeading as any}
                    Link={Link}
                    Thumbnail={Thumbnail}
                />
            );
        };
    },
    {
        name: 'LumxLinkPreview',
        inheritAttrs: false,
        props: keysOf<LinkPreviewProps>()(
            'class',
            'description',
            'link',
            'linkAs',
            'linkProps',
            'size',
            'theme',
            'thumbnailProps',
            'title',
            'titleHeading',
        ),
    },
);

export default LinkPreview;
