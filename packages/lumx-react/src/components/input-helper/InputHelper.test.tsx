import { render } from '@testing-library/react';

import BaseInputHelperTests, { setup } from '@lumx/core/js/components/InputHelper/Tests';
import { commonTestsSuiteRTL, SetupRenderOptions } from '@lumx/react/testing/utils';

import { InputHelper, InputHelperProps } from './InputHelper';

const CLASSNAME = InputHelper.className as string;

describe(`<${InputHelper.displayName}>`, () => {
    const renderInputHelper = (props: InputHelperProps, options?: SetupRenderOptions) =>
        render(<InputHelper {...props} />, options);

    BaseInputHelperTests({ render: renderInputHelper });

    const setupInputHelper = (props: Partial<InputHelperProps> = {}, options: SetupRenderOptions = {}) =>
        setup(props, { ...options, render: renderInputHelper });

    commonTestsSuiteRTL(setupInputHelper, {
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
