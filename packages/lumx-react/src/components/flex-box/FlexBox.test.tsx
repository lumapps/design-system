import { commonTestsSuiteRTL } from '@lumx/react/testing/utils';

import { queryByClassName } from '@lumx/react/testing/utils/queries';
import { render } from '@testing-library/react';
import { FlexBox, FlexBoxProps } from './FlexBox';

const CLASSNAME = FlexBox.className as string;

type SetupProps = Partial<FlexBoxProps>;

const setup = (propsOverride: SetupProps = {}) => {
    const props: FlexBoxProps = {
        children: null,
        ...propsOverride,
    };
    render(<FlexBox {...props} />);
    const flexBox = queryByClassName(document.body, CLASSNAME);
    return { props, flexBox };
};

describe(`<${FlexBox.displayName}>`, () => {
    // Common tests suite.
    commonTestsSuiteRTL(setup, { baseClassName: CLASSNAME, forwardClassName: 'flexBox', forwardAttributes: 'flexBox' });
});
