import { render, screen } from '@testing-library/vue';

import BaseInputRequiredLegendTests, { setup } from '@lumx/core/js/components/InputRequiredLegend/Tests';
import { InputRequiredLegendClassName, InputRequiredLegendProps } from '@lumx/core/js/components/InputRequiredLegend';
import { commonTestsSuiteVTL, SetupRenderOptions } from '@lumx/vue/testing';

import { InputRequiredLegend } from '.';

const CLASSNAME = InputRequiredLegendClassName;

describe('<InputRequiredLegend />', () => {
    const renderInputRequiredLegend = (
        props: InputRequiredLegendProps,
        options?: SetupRenderOptions<InputRequiredLegendProps>,
    ) => render(InputRequiredLegend, { ...options, props });

    BaseInputRequiredLegendTests({ render: renderInputRequiredLegend, screen });

    const setupInputRequiredLegend = (
        props: Partial<InputRequiredLegendProps> = {},
        options: SetupRenderOptions<InputRequiredLegendProps> = {},
    ) => setup(props, { ...options, render: renderInputRequiredLegend, screen });

    // Common tests suite.
    commonTestsSuiteVTL(setupInputRequiredLegend, {
        baseClassName: CLASSNAME,
        forwardClassName: 'legend',
        forwardAttributes: 'legend',
        applyTheme: {
            affects: [{ element: 'legend' }],
            viaProp: true,
            viaContext: true,
            defaultTheme: 'light',
        },
    });
});
