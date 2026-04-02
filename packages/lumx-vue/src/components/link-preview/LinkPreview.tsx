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
import { keysOf, VueToJSXProps } from '../../utils/VueToJSX';

export type LinkPreviewProps = VueToJSXProps<UIProps, 'TitleHeading' | 'Link' | 'Thumbnail'> & {
    /** Customize the title heading tag. */
    titleHeading?: string;
};

export { COMPONENT_NAME };

// Adapter: core passes `className` (JSX convention), Vue Link expects `class` (Vue convention).
// The second `context` argument is used to forward default slot content to Vue Link.
const LinkAdapter = ({ className, ...linkProps }: any, { slots }: any) => (
    <Link {...linkProps} class={className}>
        {slots.default?.()}
    </Link>
);

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

        return () => {
            const { titleHeading = DEFAULT_PROPS.titleHeading, linkAs, ...restProps } = props;

            return (
                <LinkPreviewUI
                    {...restProps}
                    {...attrs}
                    linkAs={toRaw(linkAs)}
                    className={props.class}
                    theme={props.theme || defaultTheme.value}
                    TitleHeading={titleHeading as any}
                    Link={LinkAdapter}
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
