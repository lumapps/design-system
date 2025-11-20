import { commonTestsSuiteRTL } from '@lumx/react/testing/utils';
import { getByClassName } from '@lumx/react/testing/utils/queries';
import { render, screen } from '@testing-library/react';

import { TabPanel, TabPanelProps } from './TabPanel';

const CLASSNAME = TabPanel.className as string;

type SetupProps = Partial<TabPanelProps>;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = (propsOverride: SetupProps = {}) => {
    const props: TabPanelProps = { ...propsOverride, children: 'Tab panel content' };

    render(<TabPanel {...props} />);
    const tabPanel = getByClassName(document.body, CLASSNAME);

    return { props, tabPanel };
};

describe(`<${TabPanel.displayName}>`, () => {
    it('should render default', () => {
        const content = 'Content';
        const { tabPanel } = setup({ children: content });
        expect(tabPanel).toBe(screen.queryByRole('tabpanel'));
    });

    // Common tests suite.
    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'tabPanel',
        forwardAttributes: 'tabPanel',
        forwardRef: 'tabPanel',
    });
});
