import {
    Button,
    ColorPalette,
    FlexBox,
    Orientation,
    ProgressTracker,
    ProgressTrackerProvider,
    ProgressTrackerStep,
    ProgressTrackerStepPanel,
} from '@lumx/react';
import cloneDeep from 'lodash/cloneDeep';
import set from 'lodash/set';
import React, { useState } from 'react';

export default { title: 'LumX components/progress-tracker/Progress Tracker' };

export const Controlled = () => {
    const [activeStep, setActiveStep] = useState(1);

    const [steps, setSteps] = useState([
        {
            label: 'First',
            isDisabled: false,
            isComplete: true,
            hasError: false,
        },
        {
            label: 'Second',
            isDisabled: false,
            isComplete: false,
            hasError: false,
        },
        {
            label: 'Third',
            isDisabled: true,
            isComplete: false,
            hasError: false,
        },
        {
            label: 'Fourth',
            isDisabled: true,
            isComplete: false,
            hasError: false,
        },
        {
            label: 'Fifth',
            helper: 'Almost done',
            isDisabled: true,
            isComplete: false,
            hasError: false,
        },
    ]);

    const toggleError = (index: number) => () => {
        const clonedSteps = cloneDeep(steps);
        set(clonedSteps, [index, 'hasError'], !steps[index].hasError);
        set(clonedSteps, [index, 'isComplete'], false);
        setSteps(clonedSteps);
    };

    const previous = (index: number) => () => setActiveStep(index - 1);

    const next = (index: number) => () => {
        const isLast = index === steps.length - 1;
        const clonedSteps = cloneDeep(steps);
        set(clonedSteps, [index, 'isComplete'], true);
        set(clonedSteps, [index, 'hasError'], false);
        if (!isLast) {
            set(clonedSteps, [index + 1, 'isDisabled'], false);
            setActiveStep(index + 1);
        }
        setSteps(clonedSteps);
    };

    return (
        <ProgressTrackerProvider activeStepIndex={activeStep} onChange={setActiveStep}>
            <ProgressTracker aria-label="Steps with a linear progression">
                {steps.map((step) => (
                    <ProgressTrackerStep key={step.label} {...step} />
                ))}
            </ProgressTracker>
            {steps.map((step, index) => (
                <ProgressTrackerStepPanel key={`${step.label}-panel`}>
                    <FlexBox orientation={Orientation.horizontal}>
                        <FlexBox fillSpace />
                        <FlexBox
                            orientation={Orientation.vertical}
                            style={{ width: '700px' }}
                            className="lumx-spacing-margin-top-huge"
                        >
                            <p style={{ textAlign: 'justify' }}>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam semper aliquet purus, a
                                viverra odio pharetra vitae. Morbi condimentum et dui luctus tristique. Etiam turpis
                                turpis, tristique eu lobortis vel, vulputate at mi. Ut commodo metus non fringilla
                                semper. Aenean eu dignissim ante. Cras libero ligula, luctus quis mauris eget,
                                vestibulum mattis ante. Donec elementum mi nisl, quis dictum lorem scelerisque sit amet.
                                Nullam blandit tellus et tortor ornare efficitur. Vivamus blandit mauris in elementum
                                lobortis. Nam molestie aliquet vehicula. Maecenas lacinia sodales nunc. Nam orci nisl,
                                pellentesque sed hendrerit eget, tincidunt id lacus. Donec malesuada ex elit, eget
                                sagittis nisl aliquam vitae. Aliquam efficitur tellus non enim efficitur suscipit a sit
                                amet eros. Donec non lorem ullamcorper, varius ligula vitae, efficitur risus. Cras
                                porttitor libero justo, nec porta enim eleifend vel.
                            </p>
                            <FlexBox orientation={Orientation.horizontal} className="lumx-spacing-margin-top-huge">
                                <FlexBox fillSpace>
                                    {index === 0 ? undefined : (
                                        <Button onClick={previous(index)} color={ColorPalette.secondary}>
                                            Previous
                                        </Button>
                                    )}
                                </FlexBox>
                                <Button
                                    onClick={toggleError(index)}
                                    color={ColorPalette.red}
                                    className="lumx-spacing-margin-right-regular"
                                >
                                    Toggle error
                                </Button>
                                <Button
                                    onClick={next(index)}
                                    color={ColorPalette.primary}
                                    isDisabled={index === steps.length - 1 && step.isComplete}
                                >
                                    {index === steps.length - 1 ? 'Complete' : 'Next with success'}
                                </Button>
                            </FlexBox>
                        </FlexBox>
                        <FlexBox fillSpace />
                    </FlexBox>
                </ProgressTrackerStepPanel>
            ))}
        </ProgressTrackerProvider>
    );
};

export const NotControlled = () => (
    <ProgressTrackerProvider onChange={console.log}>
        <ProgressTracker aria-label="Steps with a linear progression">
            <ProgressTrackerStep label="Step 1" />
            <ProgressTrackerStep label="Step 2" />
        </ProgressTracker>
        <ProgressTrackerStepPanel className="lumx-spacing-padding">Step 1 panel</ProgressTrackerStepPanel>
        <ProgressTrackerStepPanel className="lumx-spacing-padding">Step 2 panel</ProgressTrackerStepPanel>
    </ProgressTrackerProvider>
);
