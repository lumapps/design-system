import { render, screen } from '@testing-library/vue';

import { InputLabelClassName, type InputLabelProps } from '@lumx/core/js/components/InputLabel';
import BaseInputLabelTests, { setup } from '@lumx/core/js/components/InputLabel/Tests';
import { commonTestsSuiteVTL, SetupRenderOptions } from '@lumx/vue/testing';

import { InputLabel } from '.';

const CLASSNAME = InputLabelClassName;

describe('<InputLabel />', () => {
    const renderInputHelper = (props: InputLabelProps, options?: SetupRenderOptions<InputLabelProps>) =>
        render(InputLabel, { ...options, props, slots: { default: props.children } });

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
