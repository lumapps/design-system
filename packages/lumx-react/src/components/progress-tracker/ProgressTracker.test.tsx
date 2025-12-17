import { ProgressTrackerStep } from '@lumx/react';
import { render, within } from '@testing-library/react';
import { getByClassName } from '@lumx/react/testing/utils/queries';
import { commonTestsSuiteRTL } from '@lumx/react/testing/utils';

import { ProgressTracker, ProgressTrackerProps } from './ProgressTracker';

const CLASSNAME = ProgressTracker.className as string;

type SetupProps = Partial<ProgressTrackerProps>;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = (propsOverride: SetupProps = {}) => {
    const steps = [<ProgressTrackerStep key={0} label="Step 0" />, <ProgressTrackerStep key={1} label="Step 1" />];
    const props = {
        children: steps,
        'aria-label': 'Steps',
        ...propsOverride,
    };
    render(<ProgressTracker {...props} />);
    const progressTracker = getByClassName(document.body, CLASSNAME);

    return { props, progressTracker };
};

describe(`<${ProgressTracker.displayName}>`, () => {
    it('should render default', () => {
        const label = 'Steps';
        const { progressTracker } = setup({ 'aria-label': label });
        expect(within(progressTracker).queryByRole('tablist', { name: label })).toBeInTheDocument();
    });

    // Common tests suite.
    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'progressTracker',
        forwardAttributes: 'progressTracker',
        forwardRef: 'progressTracker',
    });
});
