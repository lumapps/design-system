import React from 'react';

import { Theme } from '@lumx/react';
import { commonTestsSuiteRTL } from '@lumx/react/testing/utils';
import { render } from '@testing-library/react';
import { getByClassName, queryByClassName } from '@lumx/react/testing/utils/queries';
import userEvent from '@testing-library/user-event';
import { Chip, ChipProps } from './Chip';

const CLASSNAME = Chip.className as string;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = (propOverrides: Partial<ChipProps> = {}) => {
    const props = {
        ...propOverrides,
    };

    render(<Chip {...props} />);
    const chip = getByClassName(document.body, CLASSNAME);
    const before = queryByClassName(chip, `${CLASSNAME}__before`);
    const after = queryByClassName(chip, `${CLASSNAME}__after`);

    return { props, chip, before, after };
};

describe('<Chip />', () => {
    describe('Props', () => {
        it('should render default', () => {
            const { chip } = setup({ children: 'Chip text' });
            expect(chip).toBeInTheDocument();
            expect(chip).toHaveTextContent('Chip text');
            expect(chip.className).toMatchInlineSnapshot(
                '"lumx-chip lumx-chip--color-dark lumx-chip--size-m lumx-chip--is-unselected"',
            );
        });

        it('should render dark theme', () => {
            const { chip } = setup({ theme: Theme.dark });
            expect(chip).toHaveClass('lumx-chip--color-light');
        });

        it('should render clickable', () => {
            const onClick = jest.fn();
            const { chip } = setup({ children: 'Chip text', onClick });
            expect(chip).toHaveAttribute('role', 'button');
            expect(chip.className).toMatchInlineSnapshot(
                '"lumx-chip lumx-chip--is-clickable lumx-chip--color-dark lumx-chip--size-m lumx-chip--is-unselected"',
            );
        });
    });

    describe('Events', () => {
        const onClick = jest.fn();
        const onAfterClick = jest.fn();
        const onBeforeClick = jest.fn();

        beforeEach(jest.clearAllMocks);

        it('should trigger onBeforeClick only when clicking on the "before" element', async () => {
            const { after, before, chip } = setup({
                after: 'after',
                before: 'before',
                onAfterClick,
                onBeforeClick,
                onClick,
            });

            await userEvent.click(chip);
            expect(onBeforeClick).not.toHaveBeenCalled();

            jest.clearAllMocks();

            await userEvent.click(after as any);
            expect(onBeforeClick).not.toHaveBeenCalled();

            jest.clearAllMocks();

            await userEvent.click(before as any);
            expect(onBeforeClick).toHaveBeenCalled();
        });

        it('should trigger onClick when clicking on the label area', async () => {
            const { after, before, chip } = setup({
                after: 'after',
                before: 'before',
                onAfterClick,
                onBeforeClick,
                onClick,
            });

            await userEvent.click(chip);
            expect(onClick).toHaveBeenCalled();

            jest.clearAllMocks();

            await userEvent.click(after as any);
            expect(onClick).not.toHaveBeenCalled();

            jest.clearAllMocks();

            await userEvent.click(before as any);
            expect(onClick).not.toHaveBeenCalled();
        });

        it('should trigger onAfterClick only when clicking on the "after" element', async () => {
            const { after, before, chip } = setup({
                after: 'after',
                before: 'before',
                onAfterClick,
                onBeforeClick,
                onClick,
            });

            await userEvent.click(chip);
            expect(onAfterClick).not.toHaveBeenCalled();

            jest.clearAllMocks();

            await userEvent.click(after as any);
            expect(onAfterClick).toHaveBeenCalled();

            jest.clearAllMocks();

            await userEvent.click(before as any);
            expect(onAfterClick).not.toHaveBeenCalled();
        });

        it('should not stop propagation when clicking on a "before" or "after" element without an event handler', async () => {
            const { after, before } = setup({
                after: 'after',
                before: 'before',
                onClick,
            });

            await userEvent.click(before as any);
            expect(onClick).toHaveBeenCalled();

            onClick.mockClear();

            await userEvent.click(after as any);
            expect(onClick).toHaveBeenCalled();
        });
    });

    commonTestsSuiteRTL(setup, { baseClassName: CLASSNAME, forwardClassName: 'chip', forwardAttributes: 'chip' });
});
