import { render, screen } from '@testing-library/vue';

import BaseLinkPreviewTests, { setup } from '@lumx/core/js/components/LinkPreview/Tests';
import { CLASSNAME } from '@lumx/core/js/components/LinkPreview';
import { commonTestsSuiteVTL, SetupRenderOptions } from '@lumx/vue/testing';

import { LinkPreview } from '.';

describe('<LinkPreview />', () => {
    const renderLinkPreview = (props: any, options?: SetupRenderOptions<any>) =>
        render(LinkPreview, { ...options, props });

    BaseLinkPreviewTests({ render: renderLinkPreview, screen });

    const setupLinkPreview = (props: any = {}, options: SetupRenderOptions<any> = {}) =>
        setup(props, { ...options, render: renderLinkPreview, screen });

    commonTestsSuiteVTL(setupLinkPreview, {
        baseClassName: CLASSNAME,
        forwardClassName: 'linkPreview',
        forwardAttributes: 'linkPreview',
        applyTheme: {
            affects: [{ element: 'linkPreview' }],
            viaProp: true,
            viaContext: true,
            defaultTheme: 'light',
        },
    });
});
