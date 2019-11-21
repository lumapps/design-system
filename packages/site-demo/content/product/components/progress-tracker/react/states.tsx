import React, { useState } from 'react';

import { ProgressTracker, ProgressTrackerStep } from '@lumx/react';

const App = ({ theme }) => {
    const [activeIndex, setActiveIndex] = useState(2);

    const stepProps = [
        { isComplete: true },
        { isComplete: true },
        { hasError: true },
        { isComplete: false },
        { isComplete: false },
    ];

    return (
        <>
            <ProgressTracker activeStep={activeIndex} theme={theme}>
                {stepProps.map((step, index) => (
                    <ProgressTrackerStep
                        key={index}
                        isActive={activeIndex === index}
                        onClick={index < 3 ? () => setActiveIndex(index) : null}
                        label={`Step ${index + 1}`}
                        helper={index == 2 ? 'Error message' : `Helper text ${index + 1}`}
                        {...step}
                    />
                ))}
            </ProgressTracker>
        </>
    );
};

export default App;
