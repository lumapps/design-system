import {
    ProgressTracker,
    ProgressTrackerProvider,
    ProgressTrackerProviderProps,
    ProgressTrackerStep,
    ProgressTrackerStepPanel,
} from '@lumx/react';

import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { checkTabActive, query } from '../tabs/test-utils';

const setup = (props: Partial<ProgressTrackerProviderProps> = {}) =>
    render(
        <ProgressTrackerProvider {...props}>
            <ProgressTracker aria-label="Progress tracker steps">
                <ProgressTrackerStep label="Step 1" />
                <ProgressTrackerStep label="Step 2" />
                <ProgressTrackerStep label="Step 3" />
            </ProgressTracker>

            <ProgressTrackerStepPanel>Progress tracker step 1 content</ProgressTrackerStepPanel>
            <ProgressTrackerStepPanel>Progress tracker step 2 content</ProgressTrackerStepPanel>
            <ProgressTrackerStepPanel>Progress tracker step 3 content</ProgressTrackerStepPanel>
        </ProgressTrackerProvider>,
    );

describe(`<${ProgressTrackerProvider.displayName}>`, () => {
    describe('default config', () => {
        it('should render aria tab pattern', () => {
            setup();

            // Step list
            const tabList = query.tabList('Progress tracker steps');
            expect(tabList).toBeInTheDocument();
            expect(query.tabs(tabList).length).toBe(3);

            // Step 1
            const tab1 = query.tab('Step 1', tabList);
            expect(tab1).toBeInTheDocument();

            // Step 2
            const tab2 = query.tab('Step 2', tabList);
            expect(tab2).toBeInTheDocument();

            // Step 3
            const tab3 = query.tab('Step 3', tabList);
            expect(tab3).toBeInTheDocument();

            // Step panel 1
            const tabPanel1 = query.tabPanel('Step 1');
            expect(tabPanel1).toBeInTheDocument();
            expect(tab1).toHaveAttribute('aria-controls', tabPanel1?.id);

            // Step panel 2
            const tabPanel2 = query.tabPanel('Step 2');
            expect(tabPanel2).toBeInTheDocument();
            expect(tab2).toHaveAttribute('aria-controls', tabPanel2?.id);

            // Step panel 3
            const tabPanel3 = query.tabPanel('Step 3');
            expect(tabPanel3).toBeInTheDocument();
            expect(tab3).toHaveAttribute('aria-controls', tabPanel3?.id);

            // First step is active
            checkTabActive('Step 1');
        });

        it('should be navigable with keyboard', async () => {
            setup();

            checkTabActive('Step 1');

            // Tab into the step list — active step gets focus
            await userEvent.tab();
            expect(query.tab('Step 1')).toHaveFocus();

            // Tab again — focus moves to the active step panel
            await userEvent.tab();
            expect(query.tabPanel('Step 1')).toHaveFocus();

            // Shift+Tab back to the step
            await userEvent.tab({ shift: true });
            expect(query.tab('Step 1')).toHaveFocus();

            // ArrowRight navigates to Step 2
            await userEvent.keyboard('[ArrowRight]');
            expect(query.tab('Step 2')).toHaveFocus();

            // ArrowRight navigates to Step 3
            await userEvent.keyboard('[ArrowRight]');
            expect(query.tab('Step 3')).toHaveFocus();

            // ArrowRight wraps to Step 1
            await userEvent.keyboard('[ArrowRight]');
            expect(query.tab('Step 1')).toHaveFocus();

            // ArrowLeft wraps to Step 3
            await userEvent.keyboard('[ArrowLeft]');
            expect(query.tab('Step 3')).toHaveFocus();
        });

        it('should navigate with Home and End keys', async () => {
            setup();

            // Tab into the step list
            await userEvent.tab();
            expect(query.tab('Step 1')).toHaveFocus();

            // End key should go to the last step
            await userEvent.keyboard('[End]');
            expect(query.tab('Step 3')).toHaveFocus();

            // Home key should go to the first step
            await userEvent.keyboard('[Home]');
            expect(query.tab('Step 1')).toHaveFocus();
        });
    });

    describe('initial activeTabIndex', () => {
        it('should render the correct step as active on first render when activeStepIndex is non-zero', () => {
            setup({ activeStepIndex: 2 });

            // Step 3 (index 2) should be active from the very first render
            checkTabActive('Step 3');
        });
    });

    describe('not lazy', () => {
        it('should render panel content', () => {
            setup({ isLazy: false });

            checkTabActive('Step 1', { isLazy: false });
        });
    });
});
