import React, { ReactElement, ReactNode } from 'react';

interface Props {
    linkAs: any;
}

/**
 * Render link with default <a> HTML component or a custom one provided by `linkAs`.
 *
 * Can be used to inject the `Link` component from `react-router` and provide better a11y on LumX components.
 *
 * @param linkAs    Custom link component.
 * @param children  Link children.
 * @return          A link.
 */
export const renderLink = <P extends Props>({ linkAs, ...forwardedProps }: P, ...children: ReactNode[]): ReactElement =>
    React.createElement(linkAs || 'a', forwardedProps, ...children);
