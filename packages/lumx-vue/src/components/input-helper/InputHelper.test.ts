import { render, screen } from '@testing-library/vue';

import BaseInputHelperTests, { setup } from '@lumx/core/js/components/InputHelper/Tests';
import { InputHelperClassName, InputHelperProps } from '@lumx/core/js/components/InputHelper';
import { commonTestsSuiteVTL, SetupRenderOptions } from '@lumx/vue/testing';

import { InputHelper } from '.';

const CLASSNAME = InputHelperClassName;

describe('<InputHelper />', () => {
    const renderInputHelper = (props: InputHelperProps, options?: SetupRenderOptions<InputHelperProps>) =>
        render(InputHelper, { props, ...options, slots: { default: props.children } });

    BaseInputHelperTests({ render: renderInputHelper, screen });

    const setupInputHelper = (
        props: Partial<InputHelperProps> = {},
        options: SetupRenderOptions<InputHelperProps> = {},
    ) => setup(props, { ...options, render: renderInputHelper, screen });

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
