import { render, screen } from '@testing-library/vue';
import BaseProgressLinearTests, { setup } from '@lumx/core/js/components/ProgressLinear/Tests';
import { CLASSNAME } from '@lumx/core/js/components/ProgressLinear';
import { commonTestsSuiteVTL, SetupRenderOptions } from '@lumx/vue/testing';

import { ProgressLinear } from '.';

describe('<ProgressLinear />', () => {
    const renderProgressLinear = (props: any, options?: SetupRenderOptions<any>) =>
        render(ProgressLinear, {
            ...options,
            props,
        });

    // Run core tests
    BaseProgressLinearTests({
        render: renderProgressLinear,
        screen,
    });

    const setupProgressLinear = (props: any = {}, options: SetupRenderOptions<any> = {}) =>
        setup(props, { ...options, render: renderProgressLinear, screen });

    // Common tests suite
    commonTestsSuiteVTL(setupProgressLinear, {
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
