import { render, screen } from '@testing-library/vue';
import BaseProgressCircularTests, { setup } from '@lumx/core/js/components/ProgressCircular/Tests';
import { CLASSNAME } from '@lumx/core/js/components/ProgressCircular';
import { commonTestsSuiteVTL, SetupRenderOptions } from '@lumx/vue/testing';

import { ProgressCircular } from '.';

describe('<ProgressCircular />', () => {
    const renderProgressCircular = (props: any, options?: SetupRenderOptions<any>) =>
        render(ProgressCircular, {
            ...options,
            props,
        });

    // Run core tests
    BaseProgressCircularTests({
        render: renderProgressCircular,
        screen,
    });

    const setupProgressCircular = (props: any = {}, options: SetupRenderOptions<any> = {}) =>
        setup(props, { ...options, render: renderProgressCircular, screen });

    // Common tests suite
    commonTestsSuiteVTL(setupProgressCircular, {
        baseClassName: CLASSNAME,
        forwardClassName: 'element',
        forwardAttributes: 'element',
        applyTheme: {
            affects: [{ element: 'element' }],
            viaProp: true,
            viaContext: true,
            defaultTheme: 'light',
        },
    });
});
