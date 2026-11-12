import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { useCoreState, type CoreStateOptions } from './useCoreState';

/** Counter core state: reads the `step` prop on each click. */
const createCounter = vi.fn(({ getProps, onUpdate }: CoreStateOptions<{ step: number }>) => {
    let count = 0;
    return {
        getView: () => ({ count }),
        increment() {
            count += getProps().step;
            onUpdate();
        },
    };
});

const Counter = ({ step }: { step: number }) => {
    const state = useCoreState(createCounter, { step });
    return (
        <button type="button" onClick={state.increment}>
            {state.getView().count}
        </button>
    );
};

describe(useCoreState, () => {
    it('should create the state once, read the latest props and render on update', async () => {
        const { rerender } = render(<Counter step={1} />);
        await userEvent.click(screen.getByRole('button'));
        expect(screen.getByRole('button')).toHaveTextContent('1');

        rerender(<Counter step={10} />);
        await userEvent.click(screen.getByRole('button'));
        expect(screen.getByRole('button')).toHaveTextContent('11');
        expect(createCounter).toHaveBeenCalledTimes(1);
    });
});
