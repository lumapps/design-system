import React, { ReactElement, ReactNode } from 'react';
import { renderLink } from './renderLink';

interface Props {
    linkAs?: any;
    href?: any;
}

/**
 * Render <button> HTML component, fallbacks to `<a>` when a `href` is provided or a custom component with `linkAs`.
 */
export const renderButtonOrLink = <P extends Props>(props: P, ...children: ReactNode[]): ReactElement => {
    const { linkAs, href, ...forwardedProps } = props;
    if (linkAs || href) return renderLink(props, ...children);
    return React.createElement('button', { type: 'button', ...forwardedProps }, ...children);
};
