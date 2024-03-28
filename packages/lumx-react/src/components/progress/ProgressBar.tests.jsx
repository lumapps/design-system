// import React from 'react';
// import { render, screen } from '@lumapps/testing/library';

// import { ProgressBarSimple, ProgressBarWithLabel } from './ProgressBar.stories';

// describe('<ProgressBar />', () => {
//     it('should render the ProgressBar without label', () => {
//         render(<ProgressBarSimple />);

//         expect(screen.queryByClassName('progress-bar__bar')).toBeInTheDocument();
//         expect(screen.getByText(/done/i)).toBeInTheDocument();
//         expect(screen.queryByText(/completion/i)).not.toBeInTheDocument();
//         expect(screen.queryByText(/60%/i)).not.toBeInTheDocument();
//     });

//     it('should render the ProgressBar with label', () => {
//         render(<ProgressBarWithLabel />);

//         expect(screen.queryByClassName('progress-bar__bar')).toBeInTheDocument();
//         expect(screen.queryByClassName('progress-bar__label')).toBeInTheDocument();
//         expect(screen.getByText(/done/i)).toBeInTheDocument();
//         expect(screen.getByText(/completion/i)).toBeInTheDocument();
//         expect(screen.getByText(/60%/i)).toBeInTheDocument();
//     });
// });
