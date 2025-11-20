import { commonTestsSuiteRTL } from '@lumx/react/testing/utils';

import { render } from '@testing-library/react';
import { queryByClassName } from '@lumx/react/testing/utils/queries';
import { RadioGroup, RadioGroupProps } from './RadioGroup';

const CLASSNAME = RadioGroup.className as string;

type SetupProps = Partial<RadioGroupProps>;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = (propsOverride: SetupProps = {}) => {
    const props: any = { ...propsOverride };
    render(<RadioGroup {...props} />);

    const radioGroup = queryByClassName(document.body, CLASSNAME);
    return { props, radioGroup };
};

describe(`<${RadioGroup.displayName}>`, () => {
    // Common tests suite.
    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'radioGroup',
        forwardAttributes: 'radioGroup',
    });
});
