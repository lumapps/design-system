import { render, screen, userEvent, waitFor, act, within } from '@testing-library/react';

import {
    Default,
    FullControlled,
    HasClearButton,
    FocusSpecificOption,
    ButtonCombobox,
    Loading,
    LoadingMore,
    WithCustomActions,
    WithCustomSkeletons,
    WithLoadingSections,
    WithSections,
} from './index.stories';

const names = [
    'Sue Pittman',
    'Louise Copeland',
    'Joe Patrick',
    'Flora Burke',
    'Bertie Brewer',
    'Harry Mills',
    'Leon Douglas',
];

function slugify(name) {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
}

const defaultOptions = names.map((name, index) => ({
    id: slugify(name),
    textValue: name,
    data: {
        picture: `https://i.pravatar.cc/64?img=${index}`,
    },
}));

/**
 * Select the given option name.
 * Options must be displayed
 *
 * @param {*} optionName The option to select
 * @param {*} user The userEvent instance
 */
const selectOption = async (optionName, user) => {
    const combobox = screen.getByRole('combobox');
    await user.clear(combobox);
    await user.type(combobox, optionName);
    const option = await screen.findByRole('option', { name: optionName });

    await user.click(option);

    await waitFor(() => expect(combobox).toHaveValue('Sue Pittman'));
};

/**
 * Open the listbox using the toggle button.
 *
 * @param {*} user The userEvent instance
 */
const openListBoxWithToggle = async (user, listRole = 'listbox') => {
    await user.click(screen.getByRole('button', { name: 'Show suggestions' }));

    const listbox = await screen.findByRole(listRole);
    return listbox;
};

/** Assertion function */
const assertions = {
    /** Check that the given option is selected */
    expectOptionToBeSelected: (option) => {
        expect(option).toHaveAttribute('aria-selected', 'true');
    },
    /** Check that the given option is explicitely not selected */
    expectOptionToBeNotSelected: (option) => {
        expect(option).toHaveAttribute('aria-selected', 'false');
    },
    /** Check that the given option is highlighted */
    expectOptionToBeHighlighted: (option) => {
        // The actual option element doesn't have the class, but the parent does.
        expect(option.closest('.lumx-list-item__link')).toHaveClass('lumx-list-item__link--is-highlighted');
    },
    /** Check that the given action is highlighted */
    expectActionToBeHighlighted: (option) => {
        expect(option).toHaveAttribute('data-focus-visible-added', 'true');
    },
};

/** Find a cell in a grid */
const getCell = (rowIndex, cellIndex) => {
    const rows = screen.getAllByRole('row');
    const targetRow = rows[rowIndex];
    return within(targetRow).getAllByRole('gridcell')[cellIndex];
};

/** Test suite of common behavior all variants of the combobox must pass. */
const executeTestSuite = (ui, { selectedIds, options, onSelect } = {}) => {
    const getSelectedOption = () => options.find((o) => selectedIds.includes(o.id));

    it('should be able to search for a user and select a user using the keyboard', async () => {
        const user = userEvent.setup();
        render(ui);

        // Listbox shouldn't be displayed by default
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();

        // Clear any default value that might be set
        const input = screen.getByLabelText('Pick a user');
        await user.clear(input);

        // Type a single letter to check that options are getting filtered
        await user.type(input, 'S');
        expect(input).toHaveValue('S');

        /** Listbox should appear */
        await screen.findByRole('listbox');
        // Matching options should be displayed
        const opts = screen.getAllByRole('option');
        expect(opts).toHaveLength(4);

        // Make a more precise search
        await user.keyboard('ue');

        // There should only be one option matching the new search
        const filteredOptions = screen.getAllByRole('option');
        await waitFor(() => expect(filteredOptions).toHaveLength(1));
        expect(filteredOptions.at(0)).toHaveTextContent('Sue Pittman');

        await user.click(screen.getByRole('option', { name: /Sue/i }));

        // Value selected
        expect(onSelect).toHaveBeenCalledWith(
            expect.objectContaining({
                id: 'sue-pittman',
                textValue: 'Sue Pittman',
            }),
        );
        // Listbox must've closed
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('should be able to navigate using the keyboard', async () => {
        const user = userEvent.setup({ delay: null });
        render(ui);

        const input = screen.getByRole('combobox');
        const selectedOption = getSelectedOption();
        const defaultHighlighted = selectedOption ? options.indexOf(selectedOption) : 0;
        act(() => {
            input.focus();
        });
        // Pressing down arrow should display all options
        await user.keyboard('{ArrowDown}');
        const listOption = within(screen.getByRole('listbox')).getAllByRole('option');
        expect(listOption).toHaveLength(listOption.length || 0);

        // Pressing down arrow should virtually focus the first item
        const firstHighlightedItem = listOption.at(defaultHighlighted);
        await waitFor(() => assertions.expectOptionToBeHighlighted(firstHighlightedItem));

        // Focus next item
        const nextHighlightedItem = listOption.at(defaultHighlighted + 1) || listOption.at(0);
        await user.keyboard('{ArrowDown}');
        expect(input).toHaveAttribute('aria-activedescendant', nextHighlightedItem.getAttribute('id'));
        await waitFor(() => assertions.expectOptionToBeHighlighted(nextHighlightedItem));

        // Close
        await user.keyboard('{Escape}');

        // Pressing up arrow should display all options
        await user.keyboard('{ArrowUp}');
        const newOptions = within(screen.getByRole('listbox')).getAllByRole('option');
        expect(newOptions).toHaveLength(defaultOptions.length || 0);

        // Pressing up arrow should virtually focus the last item
        const lastHighlightedItemIndex = defaultHighlighted || -1;
        const lastHighlightedItem = newOptions.at(lastHighlightedItemIndex);
        expect(input).toHaveAttribute('aria-activedescendant', lastHighlightedItem.getAttribute('id'));
        await waitFor(() => assertions.expectOptionToBeHighlighted(lastHighlightedItem));

        // Focus previous item
        const previousHighlightedItem = newOptions.at(lastHighlightedItemIndex - 1);
        await user.keyboard('{ArrowUp}');
        expect(input).toHaveAttribute('aria-activedescendant', previousHighlightedItem.getAttribute('id'));
        await waitFor(() => assertions.expectOptionToBeHighlighted(previousHighlightedItem));

        // Focus first item
        const firstItem = newOptions.at(0);
        await user.keyboard('{Home}');
        expect(input).toHaveAttribute('aria-activedescendant', firstItem.getAttribute('id'));
        await waitFor(() => assertions.expectOptionToBeHighlighted(firstItem));

        // Focus last item
        const lastItem = newOptions.at(-1);
        await user.keyboard('{End}');
        expect(input).toHaveAttribute('aria-activedescendant', lastItem.getAttribute('id'));
        await waitFor(() => assertions.expectOptionToBeHighlighted(lastItem));
    });

    it('should reset the keyboard navigation after selection', async () => {
        const user = userEvent.setup({ delay: null });
        render(ui);

        const input = screen.getByRole('combobox');
        await user.clear(input);

        await selectOption('Sue Pittman', user);
        expect(input).toHaveValue('Sue Pittman');

        // Select whole text to change it
        await user.tripleClick(input);
        await user.keyboard('l');
        expect(input).toHaveValue('l');

        /** Listbox should appear */
        await screen.findByRole('listbox');

        // Matching options should be displayed
        const opts = screen.getAllByRole('option');
        expect(opts).toHaveLength(4);

        // make sur Sue is not displayed
        expect(screen.queryByRole('option', { name: /Sue/i })).not.toBeInTheDocument();

        // Highlight first option

        await user.keyboard('{ArrowDown}');

        await waitFor(() => assertions.expectOptionToBeHighlighted(screen.getByRole('option', { name: /Louise/i })));

        // Add a letter
        await user.keyboard('o');
        await waitFor(() => expect(screen.getAllByRole('option')).toHaveLength(2));
        expect(input).toHaveValue('lo');

        // Highlight last option

        await user.keyboard('{ArrowUp}');

        await waitFor(() => assertions.expectOptionToBeHighlighted(screen.getByRole('option', { name: /Flora/i })));
    });

    it('should be able to display all suggestions using the toggle button', async () => {
        const user = userEvent.setup();
        render(ui, { enableTranslations: true });

        // The option should be set as selected
        // Open the combobox
        const listbox = await openListBoxWithToggle(user);
        const opts = within(listbox).getAllByRole('option');
        expect(opts).toHaveLength(opts.length || 0);
    });

    it('should reset the highlighted option on input close', async () => {
        const user = userEvent.setup();
        render(ui);

        // Clear any default value that might be set
        const input = screen.getByLabelText('Pick a user');
        await user.clear(input);

        // Type a single letter to check that options are getting filtered
        await user.type(input, 'u');

        /** Listbox should appear */
        await screen.findByRole('listbox');

        // Matching options should be displayed
        const listOptions = screen.getAllByRole('option');
        expect(listOptions).toHaveLength(4);

        // Highlight first option

        await user.keyboard('{ArrowDown}');

        await waitFor(() =>
            assertions.expectOptionToBeHighlighted(screen.getByRole('option', { name: 'Sue Pittman' })),
        );

        // Highlight second option

        await user.keyboard('{ArrowDown}');

        await waitFor(() => assertions.expectOptionToBeHighlighted(screen.getByRole('option', { name: /Louise/i })));

        // Close the listbox

        await user.keyboard('{Escape}');

        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();

        // Reopen with all suggestions

        await user.keyboard('{ArrowDown}');

        await screen.findByRole('listbox');
        expect(screen.getAllByRole('option')).toHaveLength(defaultOptions.length);

        // Selected or first item should still receive highlighted focus
        const selectedOrFirstOption = getSelectedOption() || options[0];
        await waitFor(() =>
            assertions.expectOptionToBeHighlighted(
                screen.getByRole('option', { name: selectedOrFirstOption.textValue }),
            ),
        );
    });

    it('should reset the highlighted option on input change', async () => {
        const user = userEvent.setup();
        render(ui);

        // Clear any default value that might be set
        const input = screen.getByLabelText('Pick a user');
        await user.clear(input);

        // Type a single letter to check that options are getting filtered
        await user.type(input, 'o');

        /** Listbox should appear */
        await screen.findByRole('listbox');

        // Matching options should be displayed
        const listOptions = screen.getAllByRole('option');
        expect(listOptions).toHaveLength(4);

        // Move virtual focus (highlight)
        await user.keyboard('{ArrowDown}');

        // Should highlight the correct option
        const selectedOptionName = getSelectedOption()?.textValue;
        const highlightedOption = selectedOptionName
            ? // Selected option
              screen.queryByRole('option', { name: selectedOptionName })
            : // First option after filtering
              screen.queryByRole('option', { name: /Louise/ });
        await waitFor(() => assertions.expectOptionToBeHighlighted(highlightedOption));

        // Type a single letter to check that options are getting filtered
        await user.type(input, 'u');
        await waitFor(() => expect(screen.getAllByRole('option')).toHaveLength(2));
        // Active descendant should have been reset
        await waitFor(() => expect(input).toHaveAttribute('aria-activedescendant', ''));
    });

    it('should empty field when pressing Escape with suggestion closed', async () => {
        const user = userEvent.setup();
        render(ui);

        // Clear any default value that might be set
        const input = screen.getByLabelText('Pick a user');
        await user.clear(input);

        // Type a single letter to check that options are getting filtered
        await user.type(input, 'o');

        /** Listbox should appear */
        await screen.findByRole('listbox');

        // Highlight first option
        await user.keyboard('{Escape}');

        // should have closed listbox
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
        // value should still be set
        expect(input).toHaveValue('o');

        // Highlight first option
        await user.keyboard('{Escape}');

        // It should have emptied the text field
        await waitFor(() => expect(input).toHaveValue(''));
    });

    it('should close the suggestion when pressing enter with no suggestion highlighted', async () => {
        const user = userEvent.setup();
        render(ui);

        // Clear any default value that might be set
        const input = screen.getByLabelText('Pick a user');
        await user.clear(input);

        // Type a single letter to check that options are getting filtered
        await user.type(input, 'o');

        /** Listbox should appear */
        await screen.findByRole('listbox');

        // Highlight first option
        await user.keyboard('{Enter}');

        // should have closed listbox
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
        // value should still be set
        expect(input).toHaveValue('o');
    });
};

describe('Combobox', () => {
    describe('Default', () => {
        const args = { onSelect: jest.fn(), options: defaultOptions, selectedIds: [] };
        executeTestSuite(<Default {...args} />, args);

        it('should open the suggestions on focus', async () => {
            const user = userEvent.setup();
            render(<Default options={defaultOptions} openOnFocus selectedIds={[]} />);

            const combobox = screen.getByRole('combobox');
            expect(screen.queryByRole('listbox')).not.toBeInTheDocument();

            // The listbox should appear on click
            await user.click(combobox);
            expect(await screen.findByRole('listbox')).toBeInTheDocument();
            // Every options should be explicitely marked as non selected
            for (const option of screen.queryAllByRole('option')) {
                assertions.expectOptionToBeNotSelected(option);
            }
        });
    });

    describe('HasClearButton', () => {
        it('should be able to clear the combobox using the clear button', async () => {
            const user = userEvent.setup();
            render(<HasClearButton options={defaultOptions} />, { enableTranslations: true });

            await selectOption('Sue Pittman', user);
            expect(screen.getByRole('combobox')).toHaveValue('Sue Pittman');

            await user.click(screen.getByRole('button', { name: 'Clear' }));

            await waitFor(() => expect(screen.getByRole('combobox')).toHaveValue(''));
        });
    });

    describe('FullControlled', () => {
        const args = { onSelect: jest.fn(), options: defaultOptions, selectedIds: [defaultOptions[2].id] };
        executeTestSuite(<FullControlled {...args} />, args);
    });

    describe('Loading', () => {
        it('should show a loading state even if options are set', async () => {
            const user = userEvent.setup();
            render(<Loading options={defaultOptions} />);

            // listbox hidden by default
            expect(screen.queryByRole('listbox')).not.toBeInTheDocument();

            // User should be able to type during loading state
            await user.type(screen.getByRole('combobox'), 'S');
            const listbox = await screen.findByRole('listbox');
            // Full loading state should show 3 skeletons
            expect(within(listbox).queryAllByClassName('lumx-skeleton-typography')).toHaveLength(3);
            // Options should not be displayed
            expect(within(listbox).queryAllByRole('option')).toHaveLength(0);
        });
    });

    describe('Loading More', () => {
        it('should show a single loading skeleton with options', async () => {
            const user = userEvent.setup();
            render(<LoadingMore options={defaultOptions} />);

            // listbox hidden by default
            expect(screen.queryByRole('listbox')).not.toBeInTheDocument();

            // User should be able to type during loading state
            await user.type(screen.getByRole('combobox'), 'S');
            const listbox = await screen.findByRole('listbox');
            // Full loading state should show 3 skeletons
            expect(within(listbox).queryAllByClassName('lumx-skeleton-typography')).toHaveLength(1);
            // Options should still be displayed
            expect(within(listbox).queryAllByRole('option')).toHaveLength(4);
        });
    });

    describe('Custom Skeleton', () => {
        it('should be able to override the skeleton', async () => {
            const user = userEvent.setup();
            render(<WithCustomSkeletons options={defaultOptions} customSkeleton={<div>Fake Skeleton</div>} />);

            // listbox hidden by default
            expect(screen.queryByRole('listbox')).not.toBeInTheDocument();

            // User should be able to type during loading state
            await user.type(screen.getByRole('combobox'), 'S');
            const listbox = await screen.findByRole('listbox');
            // Full loading state should show 3 skeletons
            expect(within(listbox).queryAllByClassName('lumx-skeleton-typography')).toHaveLength(0);
            // Options should should not be displayed
            expect(within(listbox).queryAllByRole('option')).toHaveLength(0);
            // The custom skeletons item should be displayed
            expect(within(listbox).getAllByText('Fake Skeleton')).toHaveLength(3);
        });
    });

    describe('WithSections', () => {
        const args = { onSelect: jest.fn(), options: defaultOptions, selectedIds: [defaultOptions[2].id] };
        executeTestSuite(<WithSections {...args} />, args);

        it('should have split the options into two sections', async () => {
            const user = userEvent.setup();
            render(<WithSections {...args} />, { enableTranslations: true });

            await openListBoxWithToggle(user);

            const listbox = await screen.findByRole('listbox');
            const optionGroups = within(listbox).getAllByRole('group');
            expect(optionGroups).toHaveLength(4);
            // First section
            const firstSection = optionGroups[0];
            expect(firstSection).toHaveAccessibleName('Section 1');
            expect(within(firstSection).getAllByRole('option')).toHaveLength(3);
            // Name-less Section
            const secondSection = optionGroups[1];
            expect(secondSection).toHaveAccessibleName('');
            expect(within(secondSection).getAllByRole('option')).toHaveLength(2);
        });
    });

    describe('WithLoadingSections', () => {
        it('should have show loading sections with title', async () => {
            const user = userEvent.setup();
            render(<WithLoadingSections options={defaultOptions} />, { enableTranslations: true });

            await openListBoxWithToggle(user);

            const listbox = await screen.findByRole('listbox');
            const optionGroups = within(listbox).queryAllByClassName('lumx-combobox-section__content');
            expect(optionGroups).toHaveLength(2);

            // First section
            const firstSection = optionGroups[0];
            expect(firstSection).toHaveAccessibleName('Section 1');
            expect(within(firstSection).queryAllByRole('option')).toHaveLength(0);
            // Skeletons should be displayed
            expect(within(firstSection).queryAllByClassName('lumx-skeleton-typography')).toHaveLength(3);

            // Second Section
            const secondSection = optionGroups[1];
            expect(secondSection).toHaveAccessibleName('Section 2');
            expect(within(secondSection).queryAllByRole('option')).toHaveLength(0);
            // Skeletons should be displayed
            expect(within(secondSection).queryAllByClassName('lumx-skeleton-typography')).toHaveLength(3);
        });
    });

    describe('WithCustomLoadingSections', () => {
        it('should have show custom loading sections with title', async () => {
            const user = userEvent.setup();
            render(<WithLoadingSections options={defaultOptions} customSkeleton={<div>Fake skeleton</div>} />, {
                enableTranslations: true,
            });

            await openListBoxWithToggle(user);

            const listbox = await screen.findByRole('listbox');
            const optionGroups = within(listbox).getAllByRole('group');
            expect(optionGroups).toHaveLength(2);
            // First section
            const firstSection = optionGroups[0];
            expect(firstSection).toHaveAccessibleName('Section 1');
            expect(within(firstSection).queryAllByRole('option')).toHaveLength(0);
            // Skeletons should be displayed
            expect(within(firstSection).getAllByText('Fake skeleton')).toHaveLength(3);

            // Second Section
            const secondSection = optionGroups[1];
            expect(secondSection).toHaveAccessibleName('Section 2');
            expect(within(secondSection).queryAllByRole('option')).toHaveLength(0);
            // Skeletons should be displayed
            expect(within(secondSection).getAllByText('Fake skeleton')).toHaveLength(3);
        });
    });

    describe('WithCustomActions', () => {
        it('should manage keyboard navigation for actions', async () => {
            const user = userEvent.setup();
            render(<WithCustomActions />, { enableTranslations: true });

            await openListBoxWithToggle(user, 'grid');

            /** Move down a few options */
            await user.keyboard('{ArrowDown>5}');

            /** Check that the option is highlighted */
            const option = getCell(4, 0);
            await waitFor(() => assertions.expectOptionToBeHighlighted(option));

            /** Move to the option's action */
            await user.keyboard('{ArrowRight}');
            const deleteAction = getCell(4, 1);
            await waitFor(() => assertions.expectActionToBeHighlighted(deleteAction));

            /** Moving down should focus the next action */
            await user.keyboard('{ArrowDown>}');
            const nextDeleteAction = getCell(5, 1);
            await waitFor(() => assertions.expectActionToBeHighlighted(nextDeleteAction));

            /** You should be able to trigger the action using the keyboard */
            await user.keyboard('{Enter}');
            await waitFor(() => expect(nextDeleteAction).not.toBeInTheDocument());

            /** Focus should have been restored to previous action */
            const previousDeleteAction = getCell(4, 1);
            await waitFor(() => assertions.expectActionToBeHighlighted(previousDeleteAction));

            /** Typing a letter should update the input */
            await user.keyboard('s');
            await waitFor(() => expect(screen.getByRole('combobox')).toHaveValue('s'));
        });

        /**
         * Unfortunately, userEvent v14 doesn't allow default events to be prevented.
         * TODO: Move to integration test
         */
        it.skip('should only highlight options once up or down arrow is used', async () => {
            const user = userEvent.setup();
            render(<WithCustomActions />);

            const combobox = screen.getByRole('combobox');

            // Start typing in the combobox
            await user.type(combobox, 'la');
            expect(combobox).toHaveValue('la');
            // Move cursor to start of string
            await user.keyboard('{ArrowLeft>2}');
            // add a letter
            await user.keyboard('b');
            // Since the cursor has moved, the b was set at the start of the string
            expect(combobox).toHaveValue('bla');
            // No active descendant has been set yet
            expect(combobox).toHaveAttribute('aria-activedescendant', '');

            // Moving down should focus the first option
            await user.keyboard('{ArrowDown}');
            expect(combobox).toHaveAttribute('aria-activedescendant', expect.stringContaining('option-'));

            // Moving right should focus the action
            await user.keyboard('{ArrowRight}');
            expect(combobox).toHaveAttribute('aria-activedescendant', expect.stringContaining('action-'));

            // add a letter
            await user.keyboard('a');

            // The cursor should not have moved
            expect(combobox).toHaveValue('bala');

            // Now using arrows should move the cursor again
            await user.keyboard('{ArrowRight>3}');
            // add a letter
            await user.keyboard('h');
            expect(combobox).toHaveValue('balah');
        });

        it('should be able to click on actions', async () => {
            const user = userEvent.setup();
            render(<WithCustomActions />, { enableTranslations: true });

            await user.click(screen.getByRole('button'));

            await screen.findByRole('grid');
            // Actions should not be counted as options
            expect(screen.getByText(/18 options available/)).toBeInTheDocument();
            const fifthOption = getCell(4, 0);
            const deleteAction = getCell(4, 1);

            await user.click(deleteAction);
            await waitFor(() => expect(fifthOption).not.toBeInTheDocument());

            /** Grid should still be visible */
            expect(screen.getByRole('grid')).toBeVisible();
            /** Previous deletion button should be virtually focused */
            const input = screen.getByRole('combobox');
            expect(input).toHaveAttribute('aria-activedescendant', getCell(3, 1).getAttribute('id'));
        });
    });

    describe('Button trigger', () => {
        it('should activate with mouse', async () => {
            const user = userEvent.setup();

            render(<ButtonCombobox />);

            const combobox = screen.queryByRole('combobox', { name: /Select a fruit/ });
            expect(combobox).toBeInTheDocument();

            // select dropdown not expanded
            expect(screen.queryByRole('listbox')).not.toBeInTheDocument();

            await user.click(combobox);

            const listBox = await screen.findByRole('listbox');
            expect(listBox).toBeInTheDocument();

            const option1 = within(listBox).getByRole('option', { name: /Apple/i });
            expect(option1).toBeInTheDocument();

            const option2 = within(listBox).getByRole('option', { name: /Banana/i });
            expect(option2).toBeInTheDocument();

            const option3 = within(listBox).getByRole('option', { name: /Boysenberry/i });
            expect(option3).toBeInTheDocument();

            // Select the section option
            await user.click(option2);
            // => Label kept as-is
            expect(combobox).toHaveAccessibleName('Select a fruit');
        });

        it('should activate & navigate with keyboard', async () => {
            const user = userEvent.setup();

            render(<ButtonCombobox />);

            const combobox = screen.queryByRole('combobox', { name: /Select a fruit/ });
            expect(combobox).toBeInTheDocument();
            expect(combobox).toHaveAttribute('aria-expanded', 'false');

            // Focus
            await user.tab();
            expect(combobox).toHaveFocus();

            // Open
            await user.keyboard('{ArrowDown}');
            expect(combobox).toHaveAttribute('aria-expanded', 'true');
            const listBox = await screen.findByRole('listbox');
            expect(listBox).toBeInTheDocument();
            expect(listBox).toBeVisible();

            const [option1, option2, option3] = screen.getAllByRole('option');
            // First option highlighted
            expect(combobox).toHaveAttribute('aria-activedescendant', option1.getAttribute('id'));

            // Move down
            await user.keyboard('{ArrowDown}');
            expect(combobox).toHaveAttribute('aria-activedescendant', option2.getAttribute('id'));

            // Move down again
            await user.keyboard('{ArrowDown}');
            expect(combobox).toHaveAttribute('aria-activedescendant', option3.getAttribute('id'));

            // Select current option
            await user.keyboard('{Enter}');

            expect(listBox).not.toBeVisible();
            expect(combobox).toHaveAttribute('aria-expanded', 'false');
            expect(combobox).toHaveAccessibleName('Select a fruit');
        });

        it('should open on printable character pressed (not matching any options)', async () => {
            const user = userEvent.setup();

            render(<ButtonCombobox />);

            const combobox = screen.getByRole('combobox', { name: /Select a fruit/i });

            // Type "z" => does not match any options but we still open the combobox
            await user.type(combobox, 'z');
            expect(screen.getByRole('listbox')).toBeInTheDocument();
            expect(combobox).toHaveAttribute('aria-activedescendant', '');
        });

        it('should search next on repeated printable character pressed', async () => {
            const user = userEvent.setup();

            render(<ButtonCombobox />);

            const combobox = screen.getByRole('combobox', { name: /Select a fruit/ });

            // Type "b" => jump to first option starting with "b"
            await user.type(combobox, 'b');
            const optionsStartingWithB = screen.getAllByRole('option', { name: /^b.*/i });
            expect(optionsStartingWithB).toHaveLength(3);
            const [first, second, third] = optionsStartingWithB;
            expect(combobox).toHaveAttribute('aria-activedescendant', first.getAttribute('id'));

            // Type "B" again => jump to second option starting with "b"
            await user.type(combobox, 'B');
            expect(combobox).toHaveAttribute('aria-activedescendant', second.getAttribute('id'));

            // Type "b" again => jump to third option starting with "b"
            await user.type(combobox, 'b');
            expect(combobox).toHaveAttribute('aria-activedescendant', third.getAttribute('id'));

            // Type "b" again => lopp back to the first option starting with "b"
            await user.type(combobox, 'b');
            expect(combobox).toHaveAttribute('aria-activedescendant', first.getAttribute('id'));
        });

        it('should search on printable character pressed', async () => {
            const user = userEvent.setup();

            render(<ButtonCombobox />);

            const combobox = screen.getByRole('combobox', { name: /Select a fruit/ });

            // Type "b" => jump to first option starting with "b"
            await user.type(combobox, 'b');
            const optionsStartingWithB = screen.getAllByRole('option', { name: /^b.*/i });
            expect(optionsStartingWithB).toHaveLength(3);
            const first = optionsStartingWithB[0];
            const third = optionsStartingWithB[2];
            expect(combobox).toHaveAttribute('aria-activedescendant', first.getAttribute('id'));

            // Type "l" (searching "bl") => jump to third option starting with "bl"
            await user.type(combobox, 'l');
            expect(combobox).toHaveAttribute('aria-activedescendant', third.getAttribute('id'));
        });
    });

    describe('WithoutSelection', () => {
        it('should not put any aria-selected on options if there is no selection', async () => {
            const user = userEvent.setup();
            render(<Default options={defaultOptions} openOnFocus selectedIds={undefined} />);

            const combobox = screen.getByRole('combobox');
            expect(screen.queryByRole('listbox')).not.toBeInTheDocument();

            // The listbox should appear on click
            await user.click(combobox);
            expect(await screen.findByRole('listbox')).toBeInTheDocument();
            for (const option of screen.queryAllByRole('option')) {
                expect(option).not.toHaveAttribute('aria-selected');
            }
        });
    });

    describe('autofocus', () => {
        it('should highlight the third option by default', async () => {
            const user = userEvent.setup();
            render(<FocusSpecificOption options={defaultOptions} />, { enableTranslations: true });

            const combobox = screen.getByRole('combobox');
            expect(screen.queryByRole('listbox')).not.toBeInTheDocument();

            await user.click(screen.getByRole('button', { name: 'Show suggestions' }));
            expect(await screen.findByRole('listbox')).toBeInTheDocument();

            /** The second option should be focused by default */
            expect(combobox).toHaveAttribute(
                'aria-activedescendant',
                screen.queryAllByRole('option').at(2).getAttribute('id'),
            );

            /** Pressing arrow down should focus the next option */
            await user.keyboard('{ArrowDown}');

            expect(combobox).toHaveAttribute(
                'aria-activedescendant',
                screen.queryAllByRole('option').at(3).getAttribute('id'),
            );
        });
    });

    describe('Translations', () => {
        const translations = {
            clearLabel: 'Custom Clear',
            showSuggestionsLabel: 'Custom Show Suggestions',
            noResultsForInputLabel: (input) => (input ? `Custom No results for ${input}` : 'Custom No results'),
            loadingLabel: 'Custom Loading',
            serviceUnavailableLabel: 'Custom Error',
            tryReloadLabel: 'Custom Reload',
            nbOptionsLabel: (count) => `${count} custom options`,
        };

        it('should use custom labels for clear and show suggestions buttons', async () => {
            const user = userEvent.setup();
            render(<HasClearButton options={defaultOptions} translations={translations} />, {
                enableTranslations: true,
            });

            // Show suggestions button
            const showSuggestionsButton = screen.getByRole('button', { name: translations.showSuggestionsLabel });
            expect(showSuggestionsButton).toBeInTheDocument();

            // Clear button (needs value to be shown)
            await selectOption('Sue Pittman', user);
            const clearButton = screen.getByRole('button', { name: translations.clearLabel });
            expect(clearButton).toBeInTheDocument();
        });

        it('should use custom label for no results', async () => {
            const user = userEvent.setup();
            render(<Default options={defaultOptions} translations={translations} showEmptyState />);

            const input = screen.getByRole('combobox');
            await user.type(input, 'NonExistentOption');

            await screen.findByRole('listbox');
            expect(screen.getAllByText('Custom No results for NonExistentOption')[0]).toBeInTheDocument();
        });

        it('should use custom label for empty input no results', async () => {
            const user = userEvent.setup();
            render(<Default options={[]} showEmptyState translations={translations} openOnFocus />);

            const input = screen.getByRole('combobox');
            await user.click(input); // Open it

            await screen.findByRole('listbox');
            expect(screen.getAllByText('Custom No results')[0]).toBeInTheDocument();
        });

        it('should use custom label for loading', async () => {
            render(<Loading options={[]} translations={translations} />);
            expect(screen.getByText(translations.loadingLabel)).toBeInTheDocument();
        });

        it('should use custom labels for error state', async () => {
            const user = userEvent.setup();
            render(<Default options={[]} status="error" showErrorState translations={translations} openOnFocus />);
            await user.click(screen.getByRole('combobox'));

            expect(screen.getByText(translations.serviceUnavailableLabel)).toBeInTheDocument();
            expect(screen.getByText(translations.tryReloadLabel)).toBeInTheDocument();
        });

        it('should use custom label for options count', async () => {
            const user = userEvent.setup();
            render(<Default options={defaultOptions} translations={translations} />);

            await user.click(screen.getByRole('button', { name: translations.showSuggestionsLabel }));

            // optionsLength is 7 (defaultOptions length)
            expect(screen.getByText('7 custom options')).toBeInTheDocument();
        });
    });
});
