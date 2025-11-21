import { render, screen } from '@testing-library/react';
import { getByClassName } from '@lumx/react/testing/utils/queries';
import { commonTestsSuiteRTL } from '@lumx/react/testing/utils';

import { ProgressTrackerStep, ProgressTrackerStepProps } from './ProgressTrackerStep';

const CLASSNAME = ProgressTrackerStep.className as string;

type SetupProps = Partial<ProgressTrackerStepProps>;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = (propsOverride: SetupProps = {}) => {
    const props = { label: 'Test Step Label', ...propsOverride };
    render(<ProgressTrackerStep {...props} />);
    const progressTrackerStep = getByClassName(document.body, CLASSNAME);

    return { props, progressTrackerStep };
};

describe(`<${ProgressTrackerStep.displayName}>`, () => {
    it('should render default', () => {
        const label = 'Step';
        const { progressTrackerStep } = setup({ label });
        expect(progressTrackerStep).toBe(screen.queryByRole('tab', { name: label }));
    });

    // Common tests suite.
    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'progressTrackerStep',
        forwardAttributes: 'progressTrackerStep',
        forwardRef: 'progressTrackerStep',
    });
});
