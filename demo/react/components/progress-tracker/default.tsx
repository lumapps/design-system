import React, { Fragment, useState } from 'react';

import { ProgressTracker, ProgressTrackerStep, Theme } from 'LumX';

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
const DemoComponent: React.FC<IProps> = ({ theme }: IProps): React.ReactElement => {
    // tslint:disable-next-line: typedef
    const [activeIndex, setActiveIndex] = useState(2);

    const stepProps = [
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
                {stepProps.map((step, index: number) => (
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
