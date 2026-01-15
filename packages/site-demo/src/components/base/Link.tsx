import React from 'react';
import { Link as LumxLink } from '@lumx/react';
import { Link as RouterLink } from 'gatsby';
import { useLocation } from '@gatsbyjs/reach-router';

interface Props {
    href: string;
    [key: string]: any;
}

const useResolveInternalPath = (href: string) => {
    const { pathname: locationPathname } = useLocation();
    // Current page (origin does not matter here, only the path)
    const location = `http://localhost${locationPathname}`;
    // Resolve href relative to the location
    const url = new URL(href, location);
    // Force trailing slash
    if (!url.pathname.endsWith('/')) {
        url.pathname += '/';
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
    const internalPath = useResolveInternalPath(href);
    const props: any = { ...forwardedProps };
    if (EXTERNAL_LINK.exec(href)) {
        // External link.
        props.href = href;
    } else {
        // User router link.
        props.linkAs = RouterLink;
        // Format internal link.
        props.to = internalPath;
    }

    return <LumxLink {...props} />;
};
