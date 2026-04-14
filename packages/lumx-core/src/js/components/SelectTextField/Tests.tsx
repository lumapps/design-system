/* eslint-disable no-await-in-loop */
import userEvent from '@testing-library/user-event';
import { getByRole, getConfig, waitFor } from '@testing-library/dom';

// ─── Fixtures ────────────────────────────────────────────────────

interface Fruit {
    id: string;
    name: string;
    category: string;
    description?: string;
}

const FRUITS: Fruit[] = [
    { id: 'apple', name: 'Apple', category: 'Pome', description: 'A sweet red fruit' },
    { id: 'apricot', name: 'Apricot', category: 'Stone', description: 'A soft orange fruit' },
    { id: 'banana', name: 'Banana', category: 'Tropical', description: 'A long yellow fruit' },
    { id: 'blueberry', name: 'Blueberry', category: 'Berry', description: 'A small blue fruit' },
    { id: 'cherry', name: 'Cherry', category: 'Stone', description: 'A small red fruit' },
    { id: 'grape', name: 'Grape', category: 'Berry', description: 'A small purple fruit' },
    { id: 'lemon', name: 'Lemon', category: 'Citrus', description: 'A sour yellow fruit' },
    { id: 'orange', name: 'Orange', category: 'Citrus', description: 'A citrus fruit' },
    { id: 'peach', name: 'Peach', category: 'Stone', description: 'A soft fuzzy fruit' },
    { id: 'strawberry', name: 'Strawberry', category: 'Berry', description: 'A sweet red berry' },
];

export const TRANSLATIONS = {
    clearLabel: 'Clear',
    showSuggestionsLabel: 'Show suggestions',
};

export const MULTI_TRANSLATIONS = {
    ...TRANSLATIONS,
    chipGroupLabel: 'Selected fruits',
    chipRemoveLabel: 'Remove',
};

// ─── Types ───────────────────────────────────────────────────────

type RenderResult = { unmount: () => void; container: HTMLElement };

/**
 * Options to set up the SelectTextField test suite.
 * Injected by the framework-specific test file (React or Vue).
 */
export interface SelectTextFieldTestSetup {
    components: {
        SelectTextField: any;
        Combobox: any;
    };
    /**
     * Render a SelectTextField template with controlled state management.
     *
     * @param template    JSX render function receiving `{ value, onChange, ... }`.
     * @param initialArgs Initial props (value, spies, etc.).
     */
    renderWithState: (template: (props: any) => any, initialArgs?: Record<string, any>) => RenderResult;
}

// ─── DOM Helpers ─────────────────────────────────────────────────
// Options and listbox are rendered in a portal (document.body).
// All option/listbox queries target document.body.
// NB: Queries for the dropdown listbox and options are scoped to `.lumx-combobox-list`
// to avoid matching the SelectionChipGroup's [role="listbox"] and [role="option"] elements.

function getInput(): HTMLInputElement {
    return document.body.querySelector<HTMLInputElement>('[role="combobox"]')!;
}

function getListbox(): HTMLElement | null {
    return document.body.querySelector<HTMLElement>('.lumx-combobox-list[role="listbox"]');
}

function getVisibleOptions(): HTMLElement[] {
    return Array.from(
        document.body.querySelectorAll<HTMLElement>('.lumx-combobox-list [role="option"]:not([data-filtered])'),
    );
}

function getAllOptions(): HTMLElement[] {
    return Array.from(document.body.querySelectorAll<HTMLElement>('.lumx-combobox-list [role="option"]'));
}

/** Get chip elements inside the selection chip group. Chips render as [role="option"] inside a listbox. */
function getChips(): HTMLElement[] {
    return Array.from(
        document.body.querySelectorAll<HTMLElement>('[role="listbox"][aria-label="Selected fruits"] [role="option"]'),
    );
}

// ─── Template factory ─────────────────────────────────────────────

export function createTemplates(SelectTextField: any) {
    /** Default single-select template (filter="auto") */
    const defaultTemplate = (props: any) => (
        <SelectTextField
            selectionType="single"
            label="Select a fruit"
            placeholder="Search fruits..."
            options={FRUITS}
            getOptionId="id"
            getOptionName="name"
            filter="auto"
            translations={TRANSLATIONS}
            {...props}
        />
    );

    /** Single-select with consumer-controlled search (filter="manual" by default) */
    const searchTemplate = (props: any) => {
        const { onSearch, options: filteredOptions, ...rest } = props;
        return (
            <SelectTextField
                selectionType="single"
                label="Select a fruit"
                placeholder="Type to search..."
                options={filteredOptions ?? FRUITS}
                getOptionId="id"
                getOptionName="name"
                filter="manual"
                translations={TRANSLATIONS}
                onSearch={onSearch}
                {...rest}
            />
        );
    };

    /** Default multi-select template (filter="auto") */
    const multiTemplate = (props: any) => (
        <SelectTextField
            selectionType="multiple"
            label="Select fruits"
            placeholder="Search fruits..."
            options={FRUITS}
            getOptionId="id"
            getOptionName="name"
            filter="auto"
            translations={MULTI_TRANSLATIONS}
            {...props}
        />
    );

    return { defaultTemplate, searchTemplate, multiTemplate };
}

// ═══════════════════════════════════════════════════════════════════
// Main test suite
// ═══════════════════════════════════════════════════════════════════

const LOADING_TRANSLATIONS = {
    ...TRANSLATIONS,
    loadingMessage: 'Loading fruits…',
};

const ERROR_TRANSLATIONS = {
    ...TRANSLATIONS,
    errorMessage: 'Failed to load',
    errorTryReloadMessage: 'Please try again later',
};

function getSkeletons(): HTMLElement[] {
    return Array.from(document.body.querySelectorAll<HTMLElement>('.lumx-combobox-option-skeleton'));
}

export default function selectTextFieldTests({ components, renderWithState }: SelectTextFieldTestSetup) {
    const { SelectTextField, Combobox } = components;
    const { defaultTemplate, searchTemplate, multiTemplate } = createTemplates(SelectTextField);

    // ─── Static rendering ────────────────────────────────────────

    describe('Static rendering', () => {
        it('should render the input with label', () => {
            renderWithState(defaultTemplate);
            // Use testing-library getByRole to find by accessible name (label element, not aria-label on input)
            const input = getByRole(document.body, 'combobox', { name: 'Select a fruit' });
            expect(input).toBeTruthy();
        });

        it('should render placeholder when no value is selected', () => {
            renderWithState(defaultTemplate);
            const input = getInput();
            expect(input.getAttribute('placeholder')).toBe('Search fruits...');
            expect(input.value).toBe('');
        });

        it('should display selected value name in the input', () => {
            renderWithState(defaultTemplate, { value: FRUITS[2] }); // FRUITS[2] = Banana
            const input = getInput();
            expect(input.value).toBe('Banana');
        });

        it('should render the toggle button', () => {
            renderWithState(defaultTemplate);
            const toggleButton = document.body.querySelector<HTMLButtonElement>('[aria-label="Show suggestions"]');
            expect(toggleButton).toBeTruthy();
        });

        it('should not render the toggle button when showSuggestionsLabel is omitted', () => {
            const { showSuggestionsLabel: _, ...translationsWithoutToggle } = TRANSLATIONS;
            renderWithState(defaultTemplate, { translations: translationsWithoutToggle });
            // No button with aria-expanded should exist besides the combobox input itself
            const toggleButtons = document.body.querySelectorAll<HTMLButtonElement>('button[aria-expanded]');
            expect(toggleButtons).toHaveLength(0);
        });

        it('should render the clear button when value is set', () => {
            renderWithState(defaultTemplate, { value: FRUITS[0] });
            const clearButton = document.body.querySelector<HTMLButtonElement>('[aria-label="Clear"]');
            expect(clearButton).toBeTruthy();
        });

        it('should not render clear button when hasClearButton is false', () => {
            renderWithState(defaultTemplate, { value: FRUITS[0], hasClearButton: false });
            const clearButton = document.body.querySelector<HTMLButtonElement>('[aria-label="Clear"]');
            expect(clearButton).toBeNull();
        });

        it('should not render clear button when no value is selected', () => {
            renderWithState(defaultTemplate);
            const clearButton = document.body.querySelector<HTMLButtonElement>('[aria-label="Clear"]');
            expect(clearButton).toBeNull();
        });

        it('should render options in the listbox', () => {
            renderWithState(defaultTemplate);
            const options = getAllOptions();
            expect(options).toHaveLength(FRUITS.length);
            expect(options[0].textContent).toBe('Apple');
            expect(options[1].textContent).toBe('Apricot');
            expect(options[2].textContent).toBe('Banana');
        });

        it('should render option descriptions when getOptionDescription is provided', () => {
            renderWithState(defaultTemplate, { getOptionDescription: 'description' });
            const options = getAllOptions();
            const describedBy = options[0].getAttribute('aria-describedby');
            expect(describedBy).toBeTruthy();
            const descriptionId = describedBy!.split(' ')[0];
            const description = document.getElementById(descriptionId);
            expect(description?.textContent).toBe('A sweet red fruit');
        });

        it('should mark selected option with aria-selected', () => {
            renderWithState(defaultTemplate, { value: FRUITS[1] }); // Apricot
            const options = getAllOptions();
            expect(options[0].getAttribute('aria-selected')).toBe('false');
            expect(options[1].getAttribute('aria-selected')).toBe('true');
            expect(options[2].getAttribute('aria-selected')).toBe('false');
        });

        it('should render in disabled state', () => {
            renderWithState(defaultTemplate, { isDisabled: true, value: FRUITS[0] });
            const input = getInput();
            expect((input as HTMLInputElement).disabled).toBe(true);
            expect(input.value).toBe('Apple');
        });

        it('should render sections when getSectionId is provided', () => {
            renderWithState(defaultTemplate, {
                getSectionId: 'category',
            });
            const groups = document.body.querySelectorAll('[role="group"]');
            expect(groups.length).toBeGreaterThan(0);
        });

        it('should render beforeOptions content', () => {
            renderWithState(defaultTemplate, {
                beforeOptions: <div data-testid="before-content">Before</div>,
            });
            const beforeContent = document.body.querySelector('[data-testid="before-content"]');
            expect(beforeContent).toBeTruthy();
            expect(beforeContent?.textContent).toBe('Before');
        });

        it('should have proper ARIA attributes on the combobox', () => {
            renderWithState(defaultTemplate);
            const input = getInput();
            expect(input.getAttribute('aria-autocomplete')).toBe('list');
            expect(input.getAttribute('aria-controls')).toBeTruthy();
            expect(input.getAttribute('aria-expanded')).toBeTruthy();
        });

        it('should render the listbox with aria-label', () => {
            renderWithState(defaultTemplate);
            const listbox = getListbox();
            expect(listbox?.getAttribute('aria-label')).toBe('Select a fruit');
        });
    });

    // ─── Open and select ─────────────────────────────────────────

    describe('Open and select', () => {
        it('should open on click and close after selecting an option', async () => {
            renderWithState(defaultTemplate);
            const input = getInput();

            await userEvent.click(input);
            await waitFor(() => {
                expect(input.getAttribute('aria-expanded')).toBe('true');
            });

            expect(getListbox()).toBeTruthy();

            const options = getVisibleOptions();
            await userEvent.click(options[2]); // Banana

            await waitFor(() => {
                expect(input.getAttribute('aria-expanded')).toBe('false');
                expect(input.value).toBe('Banana');
            });
        });

        it('should show selected value in input when pre-selected', async () => {
            renderWithState(defaultTemplate, { value: FRUITS[3] }); // Blueberry
            expect(getInput().value).toBe('Blueberry');
        });

        it('should call onOpen with true when opening and false when closing', async () => {
            const onOpen = vi.fn();
            renderWithState(defaultTemplate, { onOpen });
            const input = getInput();

            // Open on click
            await userEvent.click(input);
            await waitFor(() => {
                expect(input.getAttribute('aria-expanded')).toBe('true');
            });
            expect(onOpen).toHaveBeenCalledWith(true);

            // Close by selecting an option
            const options = getVisibleOptions();
            await userEvent.click(options[0]); // Apple

            await waitFor(() => {
                expect(input.getAttribute('aria-expanded')).toBe('false');
            });
            expect(onOpen).toHaveBeenCalledWith(false);
        });
    });

    // ─── Clear button ────────────────────────────────────────────

    describe('Clear button', () => {
        it('should clear the selection when clicking the clear button', async () => {
            renderWithState(defaultTemplate, { value: FRUITS[0] });
            const input = getInput();

            expect(input.value).toBe('Apple');

            const clearButton = document.body.querySelector<HTMLButtonElement>('[aria-label="Clear"]')!;
            await userEvent.click(clearButton);

            await waitFor(() => {
                expect(input.value).toBe('');
            });
        });

        it('should not show clear button when hasClearButton is false', async () => {
            renderWithState(defaultTemplate, { value: FRUITS[0], hasClearButton: false });
            expect(getInput().value).toBe('Apple');
            expect(document.body.querySelector('[aria-label="Clear"]')).toBeNull();
        });
    });

    // ─── Input clear ─────────────────────────────────────────────

    describe('Input clear', () => {
        it('should clear the selection when the user empties the input', async () => {
            const onChange = vi.fn();
            renderWithState(defaultTemplate, { value: FRUITS[0], onChange });
            const input = getInput();

            // Input shows the selected value name
            expect(input.value).toBe('Apple');

            // User focuses the field and clears the text
            await userEvent.click(input);
            await userEvent.clear(input);

            await waitFor(() => {
                expect(onChange).toHaveBeenCalledWith(undefined);
            });
        });

        it('should not clear the selection while the user is still typing (non-empty input)', async () => {
            const onChange = vi.fn();
            renderWithState(defaultTemplate, { value: FRUITS[0], onChange });
            const input = getInput();

            await userEvent.click(input);
            await userEvent.type(input, 'App');

            // onChange must not have been called with undefined during partial typing
            expect(onChange).not.toHaveBeenCalledWith(undefined);
        });
    });

    // ─── Search / filter ─────────────────────────────────────────

    describe('Search / filter', () => {
        it('should call onSearch when typing', async () => {
            const onSearch = vi.fn();
            renderWithState(searchTemplate, { onSearch, options: FRUITS });
            const input = getInput();

            await userEvent.click(input);
            await waitFor(() => {
                expect(input.getAttribute('aria-expanded')).toBe('true');
            });

            await userEvent.type(input, 'ban');
            expect(onSearch).toHaveBeenCalled();
        });

        it('should use filter="auto" when no onSearch is provided', async () => {
            renderWithState(defaultTemplate);
            const input = getInput();

            await userEvent.click(input);
            await waitFor(() => {
                expect(input.getAttribute('aria-expanded')).toBe('true');
            });

            await waitFor(() => {
                expect(getVisibleOptions()).toHaveLength(FRUITS.length);
            });

            await userEvent.type(input, 'Ap');

            await waitFor(() => {
                // Apple, Apricot, and Grape contain "ap" (case-insensitive substring match)
                expect(getVisibleOptions().length).toBe(3);
            });
        });

        it('should reset filter after selecting an option', async () => {
            renderWithState(defaultTemplate);
            const input = getInput();

            await userEvent.click(input);
            await waitFor(() => {
                expect(input.getAttribute('aria-expanded')).toBe('true');
            });

            await userEvent.type(input, 'Ap');
            await waitFor(() => {
                expect(getVisibleOptions().length).toBe(3);
            });

            const filteredOptions = getVisibleOptions();
            await userEvent.click(filteredOptions[0]);

            await waitFor(() => {
                expect(input.getAttribute('aria-expanded')).toBe('false');
                expect(input.value).toBe('Apple');
            });

            await userEvent.click(input);
            await waitFor(() => {
                expect(input.getAttribute('aria-expanded')).toBe('true');
            });

            await waitFor(() => {
                expect(getVisibleOptions()).toHaveLength(FRUITS.length);
            });
        });

        it('should reset filter after clearing the selection', async () => {
            renderWithState(defaultTemplate, { value: FRUITS[0] });
            const input = getInput();

            expect(input.value).toBe('Apple');

            const clearButton = document.body.querySelector<HTMLButtonElement>('[aria-label="Clear"]')!;
            await userEvent.click(clearButton);
            await waitFor(() => {
                expect(input.value).toBe('');
            });

            await userEvent.click(input);
            await waitFor(() => {
                expect(input.getAttribute('aria-expanded')).toBe('true');
            });

            await waitFor(() => {
                expect(getVisibleOptions()).toHaveLength(FRUITS.length);
            });
        });

        it('should filter with substring matching (not just prefix)', async () => {
            renderWithState(defaultTemplate);
            const input = getInput();

            await userEvent.click(input);
            await waitFor(() => {
                expect(input.getAttribute('aria-expanded')).toBe('true');
            });

            // "ana" is a substring of "Banana" but not a prefix
            await userEvent.type(input, 'ana');

            await waitFor(() => {
                const visible = getVisibleOptions();
                expect(visible.length).toBe(1);
                expect(visible[0].textContent).toBe('Banana');
            });
        });

        it('should not filter when filter is "manual"', async () => {
            renderWithState(defaultTemplate, { filter: 'manual' });
            const input = getInput();

            await userEvent.click(input);
            await waitFor(() => {
                expect(input.getAttribute('aria-expanded')).toBe('true');
            });

            await waitFor(() => {
                expect(getVisibleOptions()).toHaveLength(FRUITS.length);
            });

            await userEvent.type(input, 'xyz');

            // All options should still be visible
            await waitFor(() => {
                expect(getVisibleOptions()).toHaveLength(FRUITS.length);
            });
        });

        it('should show consumer-filtered options with filter="manual" (single select)', async () => {
            // Simulate consumer-controlled search: pass a pre-filtered subset of options
            const filteredFruits = FRUITS.filter((f) => f.name.toLowerCase().includes('ap'));
            renderWithState(searchTemplate, { options: filteredFruits });
            const input = getInput();

            await userEvent.click(input);
            await waitFor(() => {
                expect(input.getAttribute('aria-expanded')).toBe('true');
            });

            // Only the pre-filtered options should be rendered
            await waitFor(() => {
                const options = getVisibleOptions();
                expect(options).toHaveLength(filteredFruits.length);
            });

            // Selecting a filtered option should work
            const options = getVisibleOptions();
            await userEvent.click(options[0]);
            await waitFor(() => {
                expect(input.value).toBe(filteredFruits[0].name);
            });
        });

        it('should show consumer-filtered options with filter="manual" (multiple select)', async () => {
            // Simulate consumer-controlled search: pass a pre-filtered subset of options
            const filteredFruits = FRUITS.filter((f) => f.name.toLowerCase().includes('ber'));
            renderWithState(searchTemplate, {
                options: filteredFruits,
                selectionType: 'multiple',
                translations: MULTI_TRANSLATIONS,
            });
            const input = getInput();

            await userEvent.click(input);
            await waitFor(() => {
                expect(input.getAttribute('aria-expanded')).toBe('true');
            });

            // Only the pre-filtered options should be rendered
            await waitFor(() => {
                const options = getVisibleOptions();
                expect(options).toHaveLength(filteredFruits.length);
            });

            // Selecting options in multi mode should add chips
            const options = getVisibleOptions();
            await userEvent.click(options[0]);
            await waitFor(() => {
                expect(getChips()).toHaveLength(1);
            });

            // Dropdown stays open after selection in multi mode
            expect(input.getAttribute('aria-expanded')).toBe('true');
        });

        it('should support filter="auto" with onSearch together', async () => {
            const onSearch = vi.fn();
            renderWithState(searchTemplate, { filter: 'auto', onSearch, options: FRUITS });
            const input = getInput();

            await userEvent.click(input);
            await waitFor(() => {
                expect(input.getAttribute('aria-expanded')).toBe('true');
            });

            await userEvent.type(input, 'Ap');

            // Client-side filtering should hide non-matching options
            await waitFor(() => {
                expect(getVisibleOptions().length).toBe(3); // Apple, Apricot, Grape
            });

            // onSearch should also have been called
            expect(onSearch).toHaveBeenCalled();
        });
    });

    // ─── Sections ────────────────────────────────────────────────

    describe('Sections', () => {
        it('should render sections as ARIA groups and allow selecting options', async () => {
            renderWithState(defaultTemplate, {
                getSectionId: 'category',
            });
            const input = getInput();

            await userEvent.click(input);
            await waitFor(() => {
                expect(input.getAttribute('aria-expanded')).toBe('true');
            });

            const groups = document.body.querySelectorAll('[role="group"]');
            expect(groups.length).toBeGreaterThan(0);

            const options = getVisibleOptions();
            expect(options).toHaveLength(FRUITS.length);

            const blueberry = Array.from(options).find((o) => o.textContent === 'Blueberry')!;
            await userEvent.click(blueberry);

            await waitFor(() => {
                expect(input.value).toBe('Blueberry');
            });
        });
    });

    // ─── Custom option render ────────────────────────────────────

    describe('Custom option render', () => {
        it('should render custom option content and show descriptions', async () => {
            renderWithState(defaultTemplate, {
                getOptionDescription: 'description',
                renderOption: (fruit: Fruit) => (
                    <Combobox.Option value={fruit.id}>
                        <strong>{fruit.name}</strong>
                    </Combobox.Option>
                ),
            });
            const input = getInput();

            await userEvent.click(input);
            await waitFor(() => {
                expect(getListbox()).toBeTruthy();
            });

            const options = getVisibleOptions();
            const firstOption = options[0];
            expect(firstOption.textContent).toContain('Apple');

            const describedBy = firstOption.getAttribute('aria-describedby') as string;
            const descriptionId = describedBy.split(' ')[0];
            const description = document.getElementById(descriptionId);
            expect(description?.textContent).toBe('A sweet red fruit');
        });
    });

    // ─── Keyboard navigation ─────────────────────────────────────

    describe('Keyboard navigation', () => {
        it('should navigate with ArrowDown and select with Enter', async () => {
            renderWithState(defaultTemplate);
            const input = getInput();

            await userEvent.click(input);
            await waitFor(() => {
                expect(input.getAttribute('aria-expanded')).toBe('true');
            });

            await userEvent.keyboard('{ArrowDown}');
            const firstOption = getAllOptions()[0];
            await waitFor(() => {
                expect(input.getAttribute('aria-activedescendant')).toBe(firstOption?.id ?? '');
            });

            await userEvent.keyboard('{Enter}');
            await waitFor(() => {
                expect(input.getAttribute('aria-expanded')).toBe('false');
                expect(input.value).toBe('Apple');
            });
        });

        it('should focus selected option when pressing ArrowDown with a pre-selected value', async () => {
            renderWithState(defaultTemplate, { value: FRUITS[4] }); // Cherry (index 4)
            const input = getInput();

            await userEvent.click(input);
            await waitFor(() => {
                expect(input.getAttribute('aria-expanded')).toBe('true');
            });

            await userEvent.keyboard('{ArrowDown}');
            const allOptions = getAllOptions();
            const cherryOption = allOptions[4];
            await waitFor(() => {
                expect(input.getAttribute('aria-activedescendant')).toBe(cherryOption?.id ?? '');
                expect(cherryOption.getAttribute('aria-selected')).toBe('true');
            });
        });

        it('should focus selected option when pressing ArrowUp with a pre-selected value', async () => {
            renderWithState(defaultTemplate, { value: FRUITS[2] }); // Banana (index 2)
            const input = getInput();

            await userEvent.click(input);
            await waitFor(() => {
                expect(input.getAttribute('aria-expanded')).toBe('true');
            });

            // Close first, then ArrowUp to reopen
            await userEvent.keyboard('{Escape}');
            await waitFor(() => {
                expect(input.getAttribute('aria-expanded')).toBe('false');
            });

            await userEvent.keyboard('{ArrowUp}');
            await waitFor(() => {
                expect(input.getAttribute('aria-expanded')).toBe('true');
            });

            const allOptions = getAllOptions();
            const bananaOption = allOptions[2];
            await waitFor(() => {
                expect(input.getAttribute('aria-activedescendant')).toBe(bananaOption?.id ?? '');
                expect(bananaOption.getAttribute('aria-selected')).toBe('true');
            });
        });

        it('should close dropdown on Escape', async () => {
            renderWithState(defaultTemplate);
            const input = getInput();

            await userEvent.click(input);
            await waitFor(() => {
                expect(input.getAttribute('aria-expanded')).toBe('true');
            });

            await userEvent.keyboard('{Escape}');
            await waitFor(() => {
                expect(input.getAttribute('aria-expanded')).toBe('false');
            });
        });
    });

    // ─── Disabled state (isDisabled) ────────────────────────────

    describe('Disabled state (isDisabled)', () => {
        it('should set the native disabled attribute on the input', () => {
            renderWithState(defaultTemplate, { isDisabled: true, value: FRUITS[0] });
            const input = getInput();

            expect(input.value).toBe('Apple');
            expect(input.disabled).toBe(true);
        });

        it('should not open dropdown on click when disabled', async () => {
            renderWithState(defaultTemplate, { isDisabled: true });
            const input = getInput();

            await userEvent.click(input);

            // Dropdown should remain closed (browser blocks events on disabled inputs)
            expect(input.getAttribute('aria-expanded')).toBe('false');
        });

        it('should not show clear button when disabled', () => {
            renderWithState(defaultTemplate, { isDisabled: true, value: FRUITS[0] });
            const clearButton = document.body.querySelector<HTMLButtonElement>('[aria-label="Clear"]');
            expect(clearButton).toBeNull();
        });

        it('should not be focusable when disabled', () => {
            renderWithState(defaultTemplate, { isDisabled: true });
            const input = getInput();

            input.focus();

            // A natively disabled input should not receive focus
            expect(document.activeElement).not.toBe(input);
        });
    });

    // ─── Aria-disabled state ─────────────────────────────────────

    describe('Aria-disabled state', () => {
        it('should NOT set the native disabled attribute on the input', () => {
            renderWithState(defaultTemplate, { 'aria-disabled': true, value: FRUITS[0] });
            const input = getInput();

            expect(input.value).toBe('Apple');
            expect(input.disabled).toBe(false);
        });

        it('should set aria-disabled on the input', () => {
            renderWithState(defaultTemplate, { 'aria-disabled': true });
            const input = getInput();

            expect(input.getAttribute('aria-disabled')).toBe('true');
        });

        it('should still be focusable when aria-disabled', () => {
            renderWithState(defaultTemplate, { 'aria-disabled': true });
            const input = getInput();

            // Wrap in eventWrapper to flush framework state updates triggered by focus.
            getConfig().eventWrapper(() => {
                input.focus();
            });

            expect(document.activeElement).toBe(input);
        });

        it('should not open dropdown on focus when aria-disabled', async () => {
            renderWithState(defaultTemplate, { 'aria-disabled': true });
            const input = getInput();

            // Wrap in eventWrapper to flush framework state updates triggered by focus.
            getConfig().eventWrapper(() => {
                input.focus();
            });

            // Give time for any async handlers to fire
            await waitFor(() => {
                expect(input.getAttribute('aria-expanded')).toBe('false');
            });
        });

        it('should not open dropdown on click when aria-disabled', async () => {
            renderWithState(defaultTemplate, { 'aria-disabled': true });
            const input = getInput();

            await userEvent.click(input);

            await waitFor(() => {
                expect(input.getAttribute('aria-expanded')).toBe('false');
            });
        });

        it('should make the input read-only when aria-disabled', () => {
            renderWithState(defaultTemplate, { 'aria-disabled': true });
            const input = getInput();

            expect(input.readOnly).toBe(true);
        });

        it('should not show clear button when aria-disabled', () => {
            renderWithState(defaultTemplate, { 'aria-disabled': true, value: FRUITS[0] });
            const clearButton = document.body.querySelector<HTMLButtonElement>('[aria-label="Clear"]');
            expect(clearButton).toBeNull();
        });

        it('should apply disabled styling (lumx-text-field--is-disabled class)', () => {
            renderWithState(defaultTemplate, { 'aria-disabled': true });
            const textField = document.body.querySelector('.lumx-text-field');
            expect(textField?.classList.contains('lumx-text-field--is-disabled')).toBe(true);
        });

        it('should disable the toggle button when aria-disabled', () => {
            renderWithState(defaultTemplate, { 'aria-disabled': true });
            const toggleButton = document.body.querySelector<HTMLButtonElement>('[aria-label="Show suggestions"]');
            expect(toggleButton?.disabled).toBe(true);
        });
    });

    // ─── Multiple selection ──────────────────────────────────────

    describe('Multiple selection', () => {
        it('should add chips when selecting options and keep dropdown open', async () => {
            renderWithState(multiTemplate, { value: [] });
            const input = getInput();

            await userEvent.click(input);
            await waitFor(() => {
                expect(input.getAttribute('aria-expanded')).toBe('true');
            });

            const options = getVisibleOptions();
            await userEvent.click(options[0]); // Apple

            await waitFor(() => {
                expect(input.getAttribute('aria-expanded')).toBe('true');
            });

            // Select second option
            const optionsAfter = getVisibleOptions();
            await userEvent.click(optionsAfter[1]); // Apricot

            await waitFor(() => {
                // Chips render as [role="option"] elements inside a [role="listbox"]
                expect(getChips().length).toBe(2);
            });

            expect(input.value).toBe('');
        });

        it('should deselect an option when clicking it again', async () => {
            renderWithState(multiTemplate, { value: [FRUITS[0], FRUITS[2]] }); // Apple, Banana
            const input = getInput();

            await waitFor(() => {
                expect(getChips().length).toBe(2);
            });

            await userEvent.click(input);
            await waitFor(() => {
                expect(input.getAttribute('aria-expanded')).toBe('true');
            });

            const options = getVisibleOptions();
            await userEvent.click(options[0]); // Deselect Apple

            await waitFor(() => {
                expect(getChips().length).toBe(1);
            });
        });

        it('should remove a chip by clicking it', async () => {
            renderWithState(multiTemplate, { value: [FRUITS[0], FRUITS[2]] }); // Apple, Banana

            await waitFor(() => {
                expect(getChips().length).toBe(2);
            });

            const firstChip = getChips()[0]!;
            await userEvent.click(firstChip);

            await waitFor(() => {
                expect(getChips().length).toBe(1);
            });
        });

        it('should render pre-selected values as chips', async () => {
            renderWithState(multiTemplate, { value: [FRUITS[0], FRUITS[3], FRUITS[7]] }); // Apple, Blueberry, Orange
            const input = getInput();

            expect(input.value).toBe('');
            expect(getChips().length).toBe(3);
        });

        it('should display option name in each chip', async () => {
            renderWithState(multiTemplate, { value: [FRUITS[0], FRUITS[2]] }); // Apple, Banana

            const chips = getChips();
            expect(chips).toHaveLength(2);

            // Each chip should contain the option name as visible text
            expect(chips[0].textContent).toContain('Apple');
            expect(chips[1].textContent).toContain('Banana');
        });

        it('should keep dropdown open after each selection', async () => {
            renderWithState(multiTemplate, { value: [] });
            const input = getInput();

            await userEvent.click(input);
            await waitFor(() => {
                expect(input.getAttribute('aria-expanded')).toBe('true');
            });

            const options = getVisibleOptions();
            await userEvent.click(options[0]);

            await waitFor(() => {
                expect(input.getAttribute('aria-expanded')).toBe('true');
            });

            const optionsAfter = getVisibleOptions();
            await userEvent.click(optionsAfter[2]);

            await waitFor(() => {
                expect(input.getAttribute('aria-expanded')).toBe('true');
            });
        });

        it('should select via keyboard and keep dropdown open with preserved visual focus', async () => {
            renderWithState(multiTemplate, { value: [] });
            const input = getInput();

            await userEvent.click(input);
            await waitFor(() => {
                expect(input.getAttribute('aria-expanded')).toBe('true');
            });

            await userEvent.keyboard('{ArrowDown}');
            const firstOption = getAllOptions()[0];
            await waitFor(() => {
                expect(input.getAttribute('aria-activedescendant')).toBe(firstOption?.id ?? '');
            });

            await userEvent.keyboard('{Enter}');

            await waitFor(() => {
                expect(input.getAttribute('aria-expanded')).toBe('true');
            });

            await waitFor(() => {
                expect(input.getAttribute('aria-activedescendant')).toBe(firstOption?.id ?? '');
            });

            await waitFor(() => {
                expect(getChips().length).toBe(1);
            });
        });

        it('should focus first selected option when pressing ArrowDown in multi mode', async () => {
            renderWithState(multiTemplate, { value: [FRUITS[2], FRUITS[5]] }); // Banana, Grape
            const input = getInput();

            await userEvent.click(input);
            await waitFor(() => {
                expect(input.getAttribute('aria-expanded')).toBe('true');
            });

            await userEvent.keyboard('{ArrowDown}');
            const allOptions = getAllOptions();
            const bananaOption = allOptions[2];
            await waitFor(() => {
                expect(input.getAttribute('aria-activedescendant')).toBe(bananaOption?.id ?? '');
                expect(bananaOption.getAttribute('aria-selected')).toBe('true');
            });
        });

        it('should mark selected options with aria-selected in multi mode', async () => {
            renderWithState(multiTemplate, { value: [FRUITS[0], FRUITS[2]] }); // Apple, Banana
            const input = getInput();

            await userEvent.click(input);
            await waitFor(() => {
                expect(input.getAttribute('aria-expanded')).toBe('true');
            });

            const options = getAllOptions();
            await waitFor(() => {
                expect(options[0].getAttribute('aria-selected')).toBe('true');
                expect(options[1].getAttribute('aria-selected')).toBe('false');
                expect(options[2].getAttribute('aria-selected')).toBe('true');
                expect(options[3].getAttribute('aria-selected')).toBe('false');
            });
        });

        it('should set aria-multiselectable on the listbox in multi mode', async () => {
            renderWithState(multiTemplate, { value: [] });
            const input = getInput();

            await userEvent.click(input);
            await waitFor(() => {
                expect(input.getAttribute('aria-expanded')).toBe('true');
            });

            await waitFor(() => {
                const listbox = getListbox();
                expect(listbox?.getAttribute('aria-multiselectable')).toBe('true');
            });
        });

        it('should not show a clear button in multi mode', () => {
            renderWithState(multiTemplate, { value: [FRUITS[0]] });
            expect(document.body.querySelector('[aria-label="Clear"]')).toBeNull();
        });

        it('should call onSearch when typing in multi mode', async () => {
            const onSearch = vi.fn();
            renderWithState(searchTemplate, {
                onSearch,
                options: FRUITS,
                selectionType: 'multiple',
                translations: MULTI_TRANSLATIONS,
            });
            const input = getInput();

            await userEvent.click(input);
            await waitFor(() => {
                expect(input.getAttribute('aria-expanded')).toBe('true');
            });

            await userEvent.type(input, 'ber');
            expect(onSearch).toHaveBeenCalled();
        });

        it('should reset filter after selecting in multi mode', async () => {
            renderWithState(multiTemplate, { value: [] });
            const input = getInput();

            await userEvent.click(input);
            await waitFor(() => {
                expect(input.getAttribute('aria-expanded')).toBe('true');
            });

            await waitFor(() => {
                expect(getVisibleOptions()).toHaveLength(FRUITS.length);
            });

            await userEvent.type(input, 'Ap');
            await waitFor(() => {
                expect(getVisibleOptions().length).toBe(3); // Apple, Apricot, Grape
            });

            const filteredOptions = getVisibleOptions();
            await userEvent.click(filteredOptions[0]);

            await waitFor(() => {
                expect(input.getAttribute('aria-expanded')).toBe('true');
                expect(getVisibleOptions()).toHaveLength(FRUITS.length);
            });
        });

        it('should focus the last selected chip when pressing Backspace at the start of an empty input', async () => {
            renderWithState(multiTemplate, { value: [FRUITS[0], FRUITS[2]] }); // Apple, Banana
            const input = getInput();

            await waitFor(() => {
                expect(getChips().length).toBe(2);
            });

            // Focus the empty input (cursor naturally at position 0).
            await userEvent.click(input);
            expect(document.activeElement).toBe(input);

            await userEvent.keyboard('{Backspace}');

            // The last selected chip should receive focus, not the input.
            const chips = getChips();
            const lastChip = chips[chips.length - 1];
            expect(document.activeElement).toBe(lastChip);
        });
    });

    // ─── Empty and option count messages ────────────────────────

    describe('Empty and option count messages', () => {
        const EMPTY_TRANSLATIONS = {
            ...TRANSLATIONS,
            emptyMessage: 'No results found',
        };

        const NB_OPTION_TRANSLATIONS = {
            ...TRANSLATIONS,
            emptyMessage: 'No results found',
            nbOptionMessage: (n: number) => `${n} result(s) available`,
        };

        it('should show empty message when all options are filtered out', async () => {
            renderWithState(defaultTemplate, {
                translations: EMPTY_TRANSLATIONS,
            });
            const input = getInput();

            await userEvent.click(input);
            await waitFor(() => {
                expect(input.getAttribute('aria-expanded')).toBe('true');
            });

            await userEvent.type(input, 'zzz');

            await waitFor(() => {
                expect(getVisibleOptions().length).toBe(0);
            });

            await waitFor(() => {
                const stateElement = document.body.querySelector('.lumx-combobox-state');
                expect(stateElement).toBeTruthy();
                expect(stateElement?.textContent).toContain('No results found');
            });
        });

        it('should show option count message when list has options', async () => {
            renderWithState(defaultTemplate, {
                translations: NB_OPTION_TRANSLATIONS,
            });
            const input = getInput();

            await userEvent.click(input);
            await waitFor(() => {
                expect(input.getAttribute('aria-expanded')).toBe('true');
            });

            await waitFor(() => {
                const stateElement = document.body.querySelector('.lumx-combobox-state');
                expect(stateElement).toBeTruthy();
                expect(stateElement?.textContent).toContain('10 result(s) available');
            });
        });

        it('should update option count when filtering', async () => {
            renderWithState(defaultTemplate, {
                translations: NB_OPTION_TRANSLATIONS,
            });
            const input = getInput();

            await userEvent.click(input);
            await waitFor(() => {
                expect(input.getAttribute('aria-expanded')).toBe('true');
            });

            await userEvent.type(input, 'bl');

            await waitFor(() => {
                expect(getVisibleOptions().length).toBe(1);
            });

            await waitFor(() => {
                const stateElement = document.body.querySelector('.lumx-combobox-state');
                expect(stateElement?.textContent).toContain('1 result(s) available');
            });
        });

        it('should show empty message instead of option count when all filtered out', async () => {
            renderWithState(defaultTemplate, {
                translations: NB_OPTION_TRANSLATIONS,
            });
            const input = getInput();

            await userEvent.click(input);
            await waitFor(() => {
                expect(input.getAttribute('aria-expanded')).toBe('true');
            });

            await userEvent.type(input, 'zzz');

            await waitFor(() => {
                expect(getVisibleOptions().length).toBe(0);
            });

            await waitFor(() => {
                const stateElement = document.body.querySelector('.lumx-combobox-state');
                expect(stateElement?.textContent).toContain('No results found');
                expect(stateElement?.textContent).not.toContain('result(s) available');
            });
        });
    });

    // ─── Loading and error states ────────────────────────────────

    describe('Loading state', () => {
        it('should render skeleton placeholders when status is loading', async () => {
            renderWithState(defaultTemplate, {
                listStatus: 'loading',
                options: [],
                translations: LOADING_TRANSLATIONS,
            });
            const input = getInput();

            await userEvent.click(input);
            await waitFor(() => {
                expect(input.getAttribute('aria-expanded')).toBe('true');
            });

            await waitFor(() => {
                expect(getSkeletons()).toHaveLength(3);
            });
        });

        it('should hide options when status is loading', async () => {
            renderWithState(defaultTemplate, {
                listStatus: 'loading',
                options: FRUITS,
                translations: LOADING_TRANSLATIONS,
            });
            const input = getInput();

            await userEvent.click(input);
            await waitFor(() => {
                expect(input.getAttribute('aria-expanded')).toBe('true');
            });

            await waitFor(() => {
                // Options are replaced by skeletons
                expect(getAllOptions()).toHaveLength(0);
                expect(getSkeletons()).toHaveLength(3);
            });
        });

        it('should render skeletons after options when status is loadingMore', async () => {
            renderWithState(defaultTemplate, {
                listStatus: 'loadingMore',
                options: FRUITS.slice(0, 3),
                translations: LOADING_TRANSLATIONS,
            });
            const input = getInput();

            await userEvent.click(input);
            await waitFor(() => {
                expect(input.getAttribute('aria-expanded')).toBe('true');
            });

            await waitFor(() => {
                // Options remain visible
                expect(getVisibleOptions()).toHaveLength(3);
                // One skeleton appended
                expect(getSkeletons()).toHaveLength(1);
            });
        });

        it('should keep options visible when status is loadingMore', async () => {
            renderWithState(defaultTemplate, {
                listStatus: 'loadingMore',
                options: FRUITS.slice(0, 5),
                translations: LOADING_TRANSLATIONS,
            });
            const input = getInput();

            await userEvent.click(input);
            await waitFor(() => {
                expect(input.getAttribute('aria-expanded')).toBe('true');
            });

            await waitFor(() => {
                const options = getVisibleOptions();
                expect(options).toHaveLength(5);
                expect(options[0].textContent).toBe('Apple');
                expect(options[4].textContent).toBe('Cherry');
            });
        });

        it('should not render skeletons when status is idle', () => {
            renderWithState(defaultTemplate, {
                listStatus: 'idle',
                translations: LOADING_TRANSLATIONS,
            });

            expect(getSkeletons()).toHaveLength(0);
        });

        it('should guard onLoadMore when status is loading', async () => {
            const onLoadMore = vi.fn();
            renderWithState(defaultTemplate, {
                listStatus: 'loading',
                options: [],
                onLoadMore,
                translations: LOADING_TRANSLATIONS,
            });
            const input = getInput();

            await userEvent.click(input);
            await waitFor(() => {
                expect(input.getAttribute('aria-expanded')).toBe('true');
            });

            // Wait a tick to let InfiniteScroll potentially fire
            await waitFor(() => {
                expect(onLoadMore).not.toHaveBeenCalled();
            });
        });

        it('should guard onLoadMore when status is loadingMore', async () => {
            const onLoadMore = vi.fn();
            renderWithState(defaultTemplate, {
                listStatus: 'loadingMore',
                options: FRUITS.slice(0, 3),
                onLoadMore,
                translations: LOADING_TRANSLATIONS,
            });
            const input = getInput();

            await userEvent.click(input);
            await waitFor(() => {
                expect(input.getAttribute('aria-expanded')).toBe('true');
            });

            // Wait a tick to let InfiniteScroll potentially fire
            await waitFor(() => {
                expect(onLoadMore).not.toHaveBeenCalled();
            });
        });

        it('should guard onLoadMore when status is error', async () => {
            const onLoadMore = vi.fn();
            renderWithState(defaultTemplate, {
                listStatus: 'error',
                options: [],
                onLoadMore,
                translations: ERROR_TRANSLATIONS,
            });
            const input = getInput();

            await userEvent.click(input);
            await waitFor(() => {
                expect(input.getAttribute('aria-expanded')).toBe('true');
            });

            // Wait a tick to let InfiniteScroll potentially fire
            await waitFor(() => {
                expect(onLoadMore).not.toHaveBeenCalled();
            });
        });
    });

    describe('Error state', () => {
        it('should render error message when status is error', async () => {
            renderWithState(defaultTemplate, {
                listStatus: 'error',
                options: [],
                translations: ERROR_TRANSLATIONS,
            });
            const input = getInput();

            await userEvent.click(input);
            await waitFor(() => {
                expect(input.getAttribute('aria-expanded')).toBe('true');
            });

            await waitFor(() => {
                const stateElement = document.body.querySelector('.lumx-combobox-state');
                expect(stateElement).toBeTruthy();
                expect(stateElement?.textContent).toContain('Failed to load');
                expect(stateElement?.textContent).toContain('Please try again later');
            });
        });

        it('should not render skeletons when status is error', async () => {
            renderWithState(defaultTemplate, {
                listStatus: 'error',
                options: [],
                translations: ERROR_TRANSLATIONS,
            });
            const input = getInput();

            await userEvent.click(input);
            await waitFor(() => {
                expect(input.getAttribute('aria-expanded')).toBe('true');
            });

            expect(getSkeletons()).toHaveLength(0);
        });
    });
}
