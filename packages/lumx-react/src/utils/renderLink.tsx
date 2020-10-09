import React from 'react';

/**
 * Render link with default <a> HTML component or a custom one provided by `linkAs`.
 *
 * Can be used to inject the `Link` component from `react-router` and provide better a11y on LumX components.
 *
 * @param linkAs    Custom link component.
 * @param children  Link children.
 * @return          A link.
 */
export const renderLink = ({ linkAs, ...forwardedProps }: any, ...children: any) =>
    React.createElement(linkAs || 'a', forwardedProps, ...children);
