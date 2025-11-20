import {
    ProgressTracker,
    ProgressTrackerProvider,
    ProgressTrackerProviderProps,
    ProgressTrackerStep,
    ProgressTrackerStepPanel,
} from '@lumx/react';

import { render } from '@testing-library/react';
import { checkTabActive, query } from '../tabs/test-utils';

const setup = (props: Partial<ProgressTrackerProviderProps> = {}) =>
    render(
        <ProgressTrackerProvider {...props}>
            <ProgressTracker aria-label="Progress tracker steps">
                <ProgressTrackerStep label="Step 1" />
                <ProgressTrackerStep label="Step 2" />
            </ProgressTracker>

            <ProgressTrackerStepPanel>Progress tracker step 1 content</ProgressTrackerStepPanel>
            <ProgressTrackerStepPanel>Progress tracker step 2 content</ProgressTrackerStepPanel>
        </ProgressTrackerProvider>,
    );

describe(`<${ProgressTrackerProvider.displayName}>`, () => {
    describe('default config', () => {
        it('should render aria tab pattern', () => {
            setup();

            // Step list
            const tabList = query.tabList('Progress tracker steps');
            expect(tabList).toBeInTheDocument();
            expect(query.tabs(tabList).length).toBe(2);

            // Step 1
            const tab1 = query.tab('Step 1', tabList);
            expect(tab1).toBeInTheDocument();

            // Step 2
            const tab2 = query.tab('Step 2', tabList);
            expect(tab2).toBeInTheDocument();

            // Step panel 1
            const tabPanel1 = query.tabPanel('Step 1');
            expect(tabPanel1).toBeInTheDocument();
            expect(tab1).toHaveAttribute('aria-controls', tabPanel1?.id);

            // Step panel 2
            const tabPanel2 = query.tabPanel('Step 2');
            expect(tabPanel2).toBeInTheDocument();
            expect(tab2).toHaveAttribute('aria-controls', tabPanel2?.id);

            // First step is active
            checkTabActive('Step 1');
        });
    });

    describe('not lazy', () => {
        it('should render panel content', () => {
            setup({ isLazy: false });

            checkTabActive('Step 1', { isLazy: false });
        });
    });
});
