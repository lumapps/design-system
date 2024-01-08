import { Link as LumxLink } from '@lumx/react';
import { Link as RouterLink, withPrefix } from 'gatsby';
import React from 'react';

interface Props {
    href: string;
    [key: string]: any;
}

// Format internal link to have the gatsby prefix and trailing slash
const formatInternalLink = (path: string) => {
    // url relative to current page
    const url = new URL(path, window.location.href);
    if (!url.pathname.endsWith('/')) {
        url.pathname += '/';
    }
    if (path.startsWith('/')) {
        url.pathname = withPrefix(url.pathname);
    }
    return url.pathname;
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
        // Format internal link.
        props.to = formatInternalLink(href);
    }

    return <LumxLink {...props} />;
};
