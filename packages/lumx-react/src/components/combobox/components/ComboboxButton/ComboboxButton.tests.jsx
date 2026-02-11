import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { visuallyHidden } from '@lumx/core/js/utils/classNames';
import { IconButton } from '@lumx/react';

import { Combobox } from '../Combobox';

function setup({ comboboxProps, comboboxButtonProps } = {}) {
    render(
        <Combobox {...comboboxProps}>
            <Combobox.Button label="Label" {...comboboxButtonProps} />
            <Combobox.List>
                <Combobox.Option id="option1">Option 1</Combobox.Option>
            </Combobox.List>
        </Combobox>,
    );
}

describe('ComboboxButton', () => {
    describe('labelDisplayMode="show-selection"', () => {
        it('should render without selection', async () => {
            setup();
            const combobox = screen.queryByRole('combobox');
            expect(combobox).toHaveAccessibleName('Label');
            expect(combobox).toHaveTextContent('Label');

            // Tooltip hidden
            await userEvent.hover(combobox);
            const tooltip = screen.getByRole('tooltip');
            expect(tooltip).toHaveClass(visuallyHidden());
        });

        it('should render with selection', async () => {
            setup({
                comboboxProps: { selectedIds: ['option1'], inputValue: 'Option 1' },
            });
            const combobox = screen.queryByRole('combobox');
            expect(combobox).toHaveAccessibleName('Label');
            expect(combobox).toHaveTextContent('Option 1');

            // Tooltip visible
            await userEvent.hover(combobox);
            const tooltip = screen.getByRole('tooltip');
            expect(tooltip).not.toHaveClass(visuallyHidden());

            // Tooltip hides on open
            await userEvent.click(combobox);
            expect(tooltip).toHaveClass(visuallyHidden());
        });
    });

    describe('labelDisplayMode="show-label"', () => {
        it('should render without selection', async () => {
            setup({
                comboboxButtonProps: { labelDisplayMode: 'show-label' },
            });
            const combobox = screen.queryByRole('combobox');
            expect(combobox).toHaveAccessibleName('Label');
            expect(combobox).toHaveTextContent('Label');

            // Tooltip hidden
            await userEvent.hover(combobox);
            const tooltip = screen.getByRole('tooltip');
            expect(tooltip).toHaveClass(visuallyHidden());
        });

        it('should render with selection', async () => {
            setup({
                comboboxButtonProps: { labelDisplayMode: 'show-label' },
                comboboxProps: { selectedIds: ['option1'], inputValue: 'Option 1' },
            });
            const combobox = screen.queryByRole('combobox');
            expect(combobox).toHaveAccessibleName('Label');
            expect(combobox).toHaveTextContent('Label');

            // Tooltip hidden
            await userEvent.hover(combobox);
            const tooltip = screen.getByRole('tooltip');
            expect(tooltip).toHaveClass(visuallyHidden());
        });
    });

    describe('labelDisplayMode="show-tooltip"', () => {
        it('should render without selection', async () => {
            setup({
                comboboxButtonProps: { as: IconButton, labelDisplayMode: 'show-tooltip' },
            });
            const combobox = screen.queryByRole('combobox');
            expect(combobox).toHaveAccessibleName('Label');
            expect(combobox).not.toHaveTextContent();

            // Tooltip visible
            await userEvent.hover(combobox);
            const tooltip = screen.getByRole('tooltip');
            expect(tooltip).not.toHaveClass(visuallyHidden());

            // Tooltip hides on open
            await userEvent.click(combobox);
            expect(tooltip).toHaveClass(visuallyHidden());
        });

        it('should render with selection', async () => {
            setup({
                comboboxButtonProps: { as: IconButton, labelDisplayMode: 'show-tooltip' },
                comboboxProps: { selectedIds: ['option1'], inputValue: 'Option 1' },
            });
            const combobox = screen.queryByRole('combobox');
            expect(combobox).toHaveAccessibleName('Label');
            expect(combobox).not.toHaveTextContent();

            // Tooltip visible
            await userEvent.hover(combobox);
            const tooltip = screen.getByRole('tooltip');
            expect(tooltip).not.toHaveClass(visuallyHidden());

            // Tooltip hides on open
            await userEvent.click(combobox);
            expect(tooltip).toHaveClass(visuallyHidden());
        });
    });
});
