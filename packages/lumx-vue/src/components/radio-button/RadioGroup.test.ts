import { render } from '@testing-library/vue';

import { CLASSNAME, RadioGroupProps } from '@lumx/core/js/components/RadioGroup';
import { commonTestsSuiteVTL, SetupRenderOptions } from '@lumx/vue/testing';

import { RadioGroup } from '.';

describe('<RadioGroup />', () => {
    const setup = (props: Partial<RadioGroupProps> = {}, options: SetupRenderOptions<RadioGroupProps> = {}) => {
        const renderResult = render(RadioGroup, {
            props,
            ...options,
        });

        const radioGroup = renderResult.container.querySelector(`.${CLASSNAME}`);

        return { ...renderResult, radioGroup, props };
    };

    // Common tests suite.
    commonTestsSuiteVTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'radioGroup',
        forwardAttributes: 'radioGroup',
    });
});
