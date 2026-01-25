import { commonTestsSuiteRTL, SetupRenderOptions } from '@lumx/react/testing/utils';
import { render } from '@testing-library/react';
import { getByClassName } from '@lumx/react/testing/utils/queries';

import { ButtonRoot, ButtonRootProps, BUTTON_CLASSNAME } from '@lumx/core/js/components/Button/ButtonRoot';

type SetupProps = Partial<ButtonRootProps>;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = (propsOverride: SetupProps = {}, { wrapper }: SetupRenderOptions = {}) => {
    const props: any = { ...propsOverride };
    render(<ButtonRoot {...props} variant="button" />, { wrapper });
    const button = getByClassName(document.body, BUTTON_CLASSNAME);
    return { props, button };
};

describe('<ButtonRoot />', () => {
    // Common tests suite.
    commonTestsSuiteRTL(setup, {
        baseClassName: BUTTON_CLASSNAME,
        forwardClassName: 'button',
        forwardAttributes: 'button',
        forwardRef: 'button',
    });
});
