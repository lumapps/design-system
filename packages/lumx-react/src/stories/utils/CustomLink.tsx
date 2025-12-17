import React from 'react';
/**
 * Example custom link that can be used in linkAs props.
 */
export const CustomLink = React.forwardRef<HTMLAnchorElement, { to: string; children?: React.ReactNode }>(
    ({ to = '#', children, ...props }, ref) => (
        <a ref={ref} href={to} data-custom-link {...props}>
            {children}
        </a>
    ),
);
CustomLink.displayName = 'CustomLink';
