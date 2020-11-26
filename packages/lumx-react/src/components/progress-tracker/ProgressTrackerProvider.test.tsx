import { ProgressTracker, ProgressTrackerProvider, ProgressTrackerStep, ProgressTrackerStepPanel } from '@lumx/react';
import { mount } from 'enzyme';
import 'jest-enzyme';
import React from 'react';

describe(`<${ProgressTrackerProvider.displayName}>`, () => {
    // 1. Test render via snapshot (default states of component).
    describe('Snapshots and structure', () => {
        it('should render', () => {
            const wrapper = mount(
                <ProgressTrackerProvider>
                    <ProgressTracker aria-label="Progress tracker steps">
                        <ProgressTrackerStep label="step 1" />
                        <ProgressTrackerStep label="step 1" />
                    </ProgressTracker>

                    <ProgressTrackerStepPanel>Progress tracker step 1 content</ProgressTrackerStepPanel>
                    <ProgressTrackerStepPanel>Progress tracker step 2 content</ProgressTrackerStepPanel>
                </ProgressTrackerProvider>,
            );
            const steps = wrapper.find(ProgressTrackerStep).find('button');
            const firstProgressTrackerStep = steps.get(0);
            const secondProgressTrackerStep = steps.get(1);

            const stepPanels = wrapper.find(ProgressTrackerStepPanel).find('div');
            const firstProgressTrackerStepPanel = stepPanels.get(0);
            const secondProgressTrackerStepPanel = stepPanels.get(1);

            // First step is selected.
            expect(firstProgressTrackerStep.props['aria-selected']).toBe(true);
            expect(secondProgressTrackerStep.props['aria-selected']).toBe(false);

            // ProgressTrackerStep id and step panel aria-labelledby by should match
            expect(firstProgressTrackerStep.props.id).toBe(firstProgressTrackerStepPanel.props['aria-labelledby']);
            expect(secondProgressTrackerStep.props.id).toBe(secondProgressTrackerStepPanel.props['aria-labelledby']);

            // ProgressTrackerStep panel id and step aria-controls by should match
            expect(firstProgressTrackerStepPanel.props.id).toBe(firstProgressTrackerStep.props['aria-controls']);
            expect(secondProgressTrackerStepPanel.props.id).toBe(secondProgressTrackerStep.props['aria-controls']);
        });
    });
});
