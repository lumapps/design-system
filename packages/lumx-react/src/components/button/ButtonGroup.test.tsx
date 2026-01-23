import { mdiPlus } from '@lumx/icons';
import { Button, IconButton } from '@lumx/react';
import { commonTestsSuiteRTL } from '@lumx/react/testing/utils';
import { render } from '@testing-library/react';
import { getByClassName } from '@lumx/react/testing/utils/queries';

import { ButtonGroup, ButtonGroupProps } from './ButtonGroup';

const CLASSNAME = ButtonGroup.className as string;

type SetupProps = Partial<ButtonGroupProps>;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = (propsOverride: SetupProps = {}) => {
    const props: ButtonGroupProps = {
        children: (
            <>
                <Button>Label</Button>
                <IconButton label="Add" icon={mdiPlus} />
            </>
        ),
        ...propsOverride,
    };

    render(<ButtonGroup {...props} />);
    const buttonGroup = getByClassName(document.body, CLASSNAME);

    return { props, buttonGroup };
};

describe(`<${ButtonGroup.displayName}>`, () => {
    describe('Props', () => {
        it('should render children', () => {
            const { buttonGroup } = setup();
            expect(buttonGroup).toHaveTextContent('Label');
        });
    });

    // Common tests suite.
    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'buttonGroup',
        forwardAttributes: 'buttonGroup',
        forwardRef: 'buttonGroup',
    });
});
