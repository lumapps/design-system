import { commonTestsSuiteRTL, SetupRenderOptions } from '@lumx/react/testing/utils';
import { render, screen } from '@testing-library/react';

import BaseLinkPreviewTests, { setup } from '@lumx/core/js/components/LinkPreview/Tests';
import { LinkPreview, LinkPreviewProps } from './LinkPreview';

const CLASSNAME = LinkPreview.className as string;

describe(`<${LinkPreview.displayName}>`, () => {
    const renderLinkPreview = (props: LinkPreviewProps, options?: SetupRenderOptions) =>
        render(<LinkPreview {...(props as any)} />, options);

    BaseLinkPreviewTests({ render: renderLinkPreview, screen });

    const setupLinkPreview = (props: Partial<LinkPreviewProps> = {}, options: SetupRenderOptions = {}) =>
        setup(props, { ...options, render: renderLinkPreview, screen });

    commonTestsSuiteRTL(setupLinkPreview, {
        baseClassName: CLASSNAME,
        forwardClassName: 'linkPreview',
        forwardAttributes: 'linkPreview',
        forwardRef: 'linkPreview',
        applyTheme: {
            affects: [{ element: 'linkPreview' }],
            viaProp: true,
            viaContext: true,
            defaultTheme: 'light',
        },
    });
});
