import { defineComponent, h } from 'vue';
import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { Tooltip } from '../components/tooltip';
import { useOverflowTooltipLabel } from './useOverflowTooltipLabel';

const TruncatedLabel = defineComponent(() => {
    const { labelRef, tooltipLabel } = useOverflowTooltipLabel();
    return () =>
        h(Tooltip, { label: tooltipLabel }, () =>
            h('button', { type: 'button' }, [h('span', { 'data-testid': 'label', ref: labelRef }, 'Long label')]),
        );
});

describe('useOverflowTooltipLabel', () => {
    it('should show the label text in the tooltip when it overflows', async () => {
        render(TruncatedLabel);
        const label = screen.getByTestId('label');
        label.innerText = 'Long label';
        Object.defineProperty(label, 'offsetWidth', { value: 50 });
        Object.defineProperty(label, 'scrollWidth', { value: 100 });

        await userEvent.hover(screen.getByRole('button'));

        expect(await screen.findByRole('tooltip', { name: 'Long label' })).toBeInTheDocument();
    });

    it('should show no tooltip inside another tooltip', async () => {
        render(defineComponent(() => () => h(Tooltip, { label: 'Parent' }, () => h('div', [h(TruncatedLabel)]))));
        const label = screen.getByTestId('label');
        label.innerText = 'Long label';
        Object.defineProperty(label, 'offsetWidth', { value: 50 });
        Object.defineProperty(label, 'scrollWidth', { value: 100 });

        await userEvent.hover(screen.getByRole('button'));

        expect(await screen.findByRole('tooltip', { name: 'Parent' })).toBeInTheDocument();
        expect(screen.queryByRole('tooltip', { name: 'Long label' })).not.toBeInTheDocument();
    });
});
