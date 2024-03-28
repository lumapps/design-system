// import React from 'react';

import { ProgressBar } from '@lumx/react';
import { getSelectArgType } from '@lumx/react/stories/controls/selectArgType';
import { withCombinations } from '@lumx/react/stories/decorators/withCombinations';

export default {
    title: 'LumX components/progress/ProgressBar',
    component: ProgressBar,
    args: ProgressBar.defaultProps,
    // argTypes: {
    //     size: getSelectArgType<ProgressPar>(sizes),
    // },
};

/**
 * Default progress circular
 */
export const Default = {};

// export default { component: ProgressBar };

// export const ProgressBarSimple = () => {
//     return (
//         <ProgressBar
//             maxWidth="200px"
//             colorDone={{ colorPalette: 'blue', colorVariant: 'D2' }}
//             colorRemaining={{ colorPalette: 'blue', colorVariant: 'L5' }}
//             percents={60}
//         />
//     );
// };

// export const ProgressBarSimpleFilled = () => {
//     return (
//         <ProgressBar
//             maxWidth="200px"
//             colorDone={{ colorPalette: 'blue', colorVariant: 'D2' }}
//             colorRemaining={{ colorPalette: 'blue', colorVariant: 'L5' }}
//             percents={100}
//         />
//     );
// };

// export const ProgressBarSimpleNotFilled = () => {
//     return (
//         <ProgressBar
//             maxWidth="200px"
//             colorDone={{ colorPalette: 'blue', colorVariant: 'D2' }}
//             colorRemaining={{ colorPalette: 'blue', colorVariant: 'L5' }}
//             percents={0}
//         />
//     );
// };

// export const ProgressBarWithLabel = () => {
//     return (
//         <ProgressBar
//             label
//             labelValue="Completion"
//             maxWidth="200px"
//             colorDone={{ colorPalette: 'blue', colorVariant: 'D2' }}
//             colorRemaining={{ colorPalette: 'blue', colorVariant: 'L5' }}
//             percents={60}
//         />
//     );
// };
