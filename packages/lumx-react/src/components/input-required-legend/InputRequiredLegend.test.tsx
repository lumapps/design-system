import { render, screen } from '@testing-library/react';

import BaseInputRequiredLegendTests, { setup } from '@lumx/core/js/components/InputRequiredLegend/Tests';
import { commonTestsSuiteRTL, SetupRenderOptions } from '@lumx/react/testing/utils';

import { InputRequiredLegend, InputRequiredLegendProps } from './InputRequiredLegend';

const CLASSNAME = InputRequiredLegend.className as string;

describe(`<${InputRequiredLegend.displayName}>`, () => {
    const renderInputRequiredLegend = (props: InputRequiredLegendProps, options?: SetupRenderOptions) =>
        render(<InputRequiredLegend {...props} />, options);

    BaseInputRequiredLegendTests({ render: renderInputRequiredLegend, screen });

    const setupInputRequiredLegend = (
        props: Partial<InputRequiredLegendProps> = {},
        options: SetupRenderOptions = {},
    ) => setup(props, { ...options, render: renderInputRequiredLegend, screen });

    commonTestsSuiteRTL(setupInputRequiredLegend, {
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
