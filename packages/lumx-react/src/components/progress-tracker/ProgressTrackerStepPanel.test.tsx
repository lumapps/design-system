import { render, screen } from '@testing-library/react';
import { getByClassName } from '@lumx/react/testing/utils/queries';

import { commonTestsSuiteRTL } from '@lumx/react/testing/utils';
import { ProgressTrackerStepPanel, ProgressTrackerStepPanelProps } from './ProgressTrackerStepPanel';

const CLASSNAME = ProgressTrackerStepPanel.className as string;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = (propsOverride: Partial<ProgressTrackerStepPanelProps> = {}) => {
    const props = { ...propsOverride, children: 'Tab panel content' };
    render(<ProgressTrackerStepPanel {...props} />);
    const progressTrackerStepPanel = getByClassName(document.body, CLASSNAME);

    return { props, progressTrackerStepPanel };
};

describe(`<${ProgressTrackerStepPanel.displayName}>`, () => {
    it('should render default', () => {
        const content = 'Content';
        const { progressTrackerStepPanel } = setup({ children: content });
        expect(progressTrackerStepPanel).toBe(screen.queryByRole('tabpanel'));
    });

    // Common tests suite.
    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'progressTrackerStepPanel',
        forwardRef: 'progressTrackerStepPanel',
        forwardAttributes: 'progressTrackerStepPanel',
    });
});
