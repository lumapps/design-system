import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tooltip } from '@lumx/react/components/tooltip/Tooltip';
import { useOverflowTooltipLabel } from './useOverflowTooltipLabel';

const TruncatedLabel = () => {
    const { labelRef, tooltipLabel } = useOverflowTooltipLabel();
    return (
        <Tooltip label={tooltipLabel}>
            <button type="button">
                <span data-testid="label" ref={labelRef}>
                    Long label
                </span>
            </button>
        </Tooltip>
    );
};

describe('useOverflowTooltipLabel', () => {
    it('should show the label text in the tooltip when it overflows', async () => {
        render(<TruncatedLabel />);
        const label = screen.getByTestId('label');
        label.innerText = 'Long label';
        Object.defineProperty(label, 'offsetWidth', { value: 50 });
        Object.defineProperty(label, 'scrollWidth', { value: 100 });

        await userEvent.hover(screen.getByRole('button'));

        expect(await screen.findByRole('tooltip', { name: 'Long label' })).toBeInTheDocument();
    });

    it('should show no tooltip inside another tooltip', async () => {
        render(
            <Tooltip label="Parent">
                <div>
                    <TruncatedLabel />
                </div>
            </Tooltip>,
        );
        const label = screen.getByTestId('label');
        label.innerText = 'Long label';
        Object.defineProperty(label, 'offsetWidth', { value: 50 });
        Object.defineProperty(label, 'scrollWidth', { value: 100 });

        await userEvent.hover(screen.getByRole('button'));

        expect(await screen.findByRole('tooltip', { name: 'Parent' })).toBeInTheDocument();
        expect(screen.queryByRole('tooltip', { name: 'Long label' })).not.toBeInTheDocument();
    });
});
