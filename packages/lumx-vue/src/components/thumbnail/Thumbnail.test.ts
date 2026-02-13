import { render, screen } from '@testing-library/vue';
import BaseThumbnailTests, { setup } from '@lumx/core/js/components/Thumbnail/Tests';
import { CLASSNAME } from '@lumx/core/js/components/Thumbnail';
import { commonTestsSuiteVTL, SetupRenderOptions } from '@lumx/vue/testing';

import { Thumbnail } from '.';

describe('<Thumbnail />', () => {
    const renderThumbnail = (props: any, options?: SetupRenderOptions<any>) =>
        render(Thumbnail, {
            ...options,
            props,
        });

    // Run core tests
    BaseThumbnailTests({
        render: renderThumbnail,
        screen,
    });

    const setupThumbnail = (props: any = {}, options: SetupRenderOptions<any> = {}) =>
        setup(props, { ...options, render: renderThumbnail, screen });

    // Common tests suite
    commonTestsSuiteVTL(setupThumbnail, {
        baseClassName: CLASSNAME,
        forwardClassName: 'thumbnail',
        forwardAttributes: 'thumbnail',
        forwardRef: 'thumbnail',
    });
});
