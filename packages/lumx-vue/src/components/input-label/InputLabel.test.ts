import { render, screen } from '@testing-library/vue';

import BaseInputLabelTests, { setup } from '@lumx/core/js/components/InputLabel/Tests';
import { commonTestsSuiteVTL, SetupRenderOptions } from '@lumx/vue/testing';

import { InputLabel, InputLabelProps } from '.';

const CLASSNAME = InputLabel.className as string;

describe('<InputLabel />', () => {
    const renderInputHelper = (props: InputLabelProps, options?: SetupRenderOptions<InputLabelProps>) =>
        render(InputLabel, { props, ...options });

    BaseInputLabelTests({ render: renderInputHelper, screen });

    const setupInputLabel = (props: Partial<InputLabelProps> = {}, options: SetupRenderOptions<InputLabelProps> = {}) =>
        setup(props, { ...options, render: renderInputHelper, screen });

    commonTestsSuiteVTL(setupInputLabel, {
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
