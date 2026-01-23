import { render, screen } from '@testing-library/react';

import BaseInputLabelTests, { setup } from '@lumx/core/js/components/InputLabel/Tests';
import { commonTestsSuiteRTL, SetupRenderOptions } from '@lumx/react/testing/utils';

import { InputLabel, InputLabelProps } from './InputLabel';

const CLASSNAME = InputLabel.className as string;

describe(`<${InputLabel.displayName}>`, () => {
    const renderInputLabel = (props: InputLabelProps, options?: SetupRenderOptions) =>
        render(<InputLabel {...props} />, options);

    BaseInputLabelTests({ render: renderInputLabel, screen });

    const setupInputLabel = (props: Partial<InputLabelProps> = {}, options: SetupRenderOptions = {}) =>
        setup(props, { ...options, render: renderInputLabel, screen });

    commonTestsSuiteRTL(setupInputLabel, {
        baseClassName: CLASSNAME,
        forwardClassName: 'label',
        forwardAttributes: 'label',
        applyTheme: {
            affects: [{ element: 'label' }],
            viaProp: true,
            viaContext: true,
            defaultTheme: 'light',
        },
    });
});
