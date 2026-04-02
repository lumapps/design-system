import { Link, LinkProps, Theme, Thumbnail } from '@lumx/react';

import { GenericProps, HeadingElement } from '@lumx/react/utils/type';
import { useTheme } from '@lumx/react/utils/theme/ThemeContext';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import {
    CLASSNAME,
    COMPONENT_NAME,
    DEFAULT_PROPS,
    LinkPreview as UI,
    LinkPreviewProps as UIProps,
    LinkPreviewPropsToOverride,
} from '@lumx/core/js/components/LinkPreview';
import { ReactToJSX } from '@lumx/react/utils/type/ReactToJSX';

/**
 * Defines the props of the component.
 */
export interface LinkPreviewProps extends GenericProps, ReactToJSX<UIProps, LinkPreviewPropsToOverride> {
    /** Props to pass to the link (minus those already set by the LinkPreview props). */
    linkProps?: Omit<LinkProps, 'color' | 'colorVariant' | 'href' | 'target'>;
    /** Customize the title heading tag. */
    titleHeading?: HeadingElement;
}

/**
 * LinkPreview component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const LinkPreview = forwardRef<LinkPreviewProps, HTMLDivElement>((props, ref) => {
    const defaultTheme = useTheme() || Theme.light;
    const { theme = defaultTheme, titleHeading = DEFAULT_PROPS.titleHeading, ...forwardedProps } = props;
    // Use title heading as title wrapper (see DEFAULT_PROPS for the default value).
    const TitleHeading = titleHeading as HeadingElement;

    return UI({
        theme,
        TitleHeading,
        ref,
        Link,
        Thumbnail,
        ...forwardedProps,
    });
});

LinkPreview.displayName = COMPONENT_NAME;
LinkPreview.className = CLASSNAME;
LinkPreview.defaultProps = DEFAULT_PROPS;
