import { commonTestsSuiteRTL } from '@lumx/react/testing/utils';
import { render, screen } from '@testing-library/react';
import { getByClassName, queryByClassName } from '@lumx/react/testing/utils/queries';

import { Icon } from '@lumx/react';
import { mdiPlay } from '@lumx/icons';
import { Tab, TabProps } from './Tab';

const CLASSNAME = Tab.className as string;

type SetupProps = Partial<TabProps>;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = (propsOverride: SetupProps = {}) => {
    const props = { label: 'Label', ...propsOverride };
    render(<Tab {...props} />);
    const tab = getByClassName(document.body, CLASSNAME);
    const icon = queryByClassName(tab, Icon.className as string);
    return { props, tab, icon };
};

describe(`<${Tab.displayName}>`, () => {
    it('should render default', () => {
        const label = 'Label';
        const { tab, icon } = setup({ label });
        expect(tab).toBe(screen.queryByRole('tab', { name: label }));
        expect(tab.tagName).toBe('BUTTON');
        expect(tab).toHaveAttribute('type', 'button');
        expect(icon).not.toBeInTheDocument();
    });

    it('should render icon', () => {
        const { icon } = setup({ icon: mdiPlay });
        expect(icon).toBeInTheDocument();
    });

    it('should render icon with props', () => {
        const { icon } = setup({ icon: mdiPlay, iconProps: { color: 'green', colorVariant: 'L2', hasShape: true } });
        expect(icon).toHaveClass('lumx-icon--color-green', 'lumx-icon--color-variant-L2');
    });

    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'tab',
        forwardAttributes: 'tab',
        forwardRef: 'tab',
    });
});
