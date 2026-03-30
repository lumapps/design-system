import { render, screen } from '@testing-library/vue';
import BaseMosaicTests, { setup } from '@lumx/core/js/components/Mosaic/Tests';
import { CLASSNAME } from '@lumx/core/js/components/Mosaic';
import { commonTestsSuiteVTL, SetupRenderOptions } from '@lumx/vue/testing';

import { Mosaic } from '.';

describe('<Mosaic />', () => {
    const renderMosaic = (props: any, options?: SetupRenderOptions<any>) =>
        render(Mosaic, {
            ...options,
            props,
        });

    // Run core tests
    BaseMosaicTests({
        render: renderMosaic,
        screen,
    });

    const setupMosaic = (props: any = {}, options: SetupRenderOptions<any> = {}) =>
        setup(props, { ...options, render: renderMosaic, screen });

    // Common tests suite
    commonTestsSuiteVTL(setupMosaic, {
        baseClassName: CLASSNAME,
        forwardClassName: 'mosaic',
        forwardAttributes: 'mosaic',
        forwardRef: 'mosaic',
        applyTheme: {
            affects: [{ element: 'mosaic' }, { element: 'thumbnails' }],
            viaProp: true,
            viaContext: true,
            defaultTheme: 'light',
        },
    });
});
