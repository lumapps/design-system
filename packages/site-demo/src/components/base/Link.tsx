import { Link as LumxLink } from '@lumx/react';
import { Link as RouterLink, withPrefix } from 'gatsby';
import React from 'react';

interface Props {
    href: string;
    [key: string]: any;
}

const formatInternalURL = (url: string) => {
    let formatted = url;
    if (!formatted.endsWith('/')) {
        // Force trailing slash on URL.
        formatted += '/';
    }
    if (formatted.startsWith('/')) {
        // Absolute path should be prefixed with Gatsby path prefix.
        formatted = withPrefix(formatted);
    }
    return formatted;
};

/**
 * External link RegExp (match URL with protocol).
 */
const EXTERNAL_LINK = /^\w*:\/\//;

/**
 * A Link component that uses a normal HTML anchor link for external links (with protocol) or a router Link otherwise.
 */
export const Link: React.FC<Props> = ({ href, ...forwardedProps }) => {
    const props: any = { ...forwardedProps };
    if (EXTERNAL_LINK.exec(href)) {
        // External link.
        props.href = href;
    } else {
        // User router link.
        props.linkAs = RouterLink;
        // Format internal URL.
        props.to = formatInternalURL(href);
    }

    return <LumxLink {...props} />;
};
