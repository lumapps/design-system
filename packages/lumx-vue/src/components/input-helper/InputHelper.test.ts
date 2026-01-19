import { render } from '@testing-library/vue';

import BaseInputHelperTests, { setup } from '@lumx/core/js/components/InputHelper/Tests';
import { commonTestsSuiteVTL, SetupRenderOptions } from '@lumx/vue/testing';

import { InputHelper, InputHelperProps } from '.';

const CLASSNAME = InputHelper.className as string;

describe('<InputHelper />', () => {
    const renderInputHelper = (props: InputHelperProps, options?: SetupRenderOptions<InputHelperProps>) =>
        render(InputHelper, { props, ...options });

    BaseInputHelperTests({ render: renderInputHelper });

    const setupInputHelper = (
        props: Partial<InputHelperProps> = {},
        options: SetupRenderOptions<InputHelperProps> = {},
    ) => setup(props, { ...options, render: renderInputHelper });

    // Common tests suite.
    commonTestsSuiteVTL(setupInputHelper, {
        baseClassName: CLASSNAME,
        forwardClassName: 'helper',
        forwardAttributes: 'helper',
        applyTheme: {
            affects: [{ element: 'helper' }],
            viaProp: true,
            viaContext: true,
            defaultTheme: 'light',
        },
    });
});
