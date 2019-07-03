import React, { Fragment, ReactElement, useState } from 'react';

import { ProgressTracker, ProgressTrackerStep, ProgressTrackerStepProps, Theme } from 'LumX';

/////////////////////////////

interface IProps {
    /**
     * The theme to use to display this demo.
     */
    theme: Theme;
}

/////////////////////////////

/**
 * The demo for the default <ProgressTracker>s.
 *
 * @return The demo component.
 */
const DemoComponent: React.FC<IProps> = ({ theme }: IProps): ReactElement => {
    const [activeIndex, setActiveIndex] = useState(2);

    const stepProps: ProgressTrackerStepProps[] = [
        { isComplete: true },
        { isComplete: true },
        { hasError: true },
        { isComplete: false },
        { isComplete: false },
    ];

    return (
        <Fragment>
            Default ProgressTracker
            <ProgressTracker activeStep={activeIndex} theme={theme}>
                {stepProps.map((step: ProgressTrackerStepProps, index: number) => (
                    <ProgressTrackerStep
                        isActive={activeIndex === index}
                        theme={theme}
                        onClick={index < 3 ? (): void => setActiveIndex(index) : null}
                        label={`Label ${index}`}
                        helper={`Helper ${index}`}
                        {...step}
                    />
                ))}
            </ProgressTracker>
        </Fragment>
    );
};

/////////////////////////////

export default {
    view: DemoComponent,
};
