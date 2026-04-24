/* eslint-disable no-await-in-loop */
import userEvent from '@testing-library/user-event';
import { waitFor, screen } from '@testing-library/dom';

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
    loadingMessage: 'Loading…',
    emptyMessage: 'No options',
    errorMessage: 'Failed to load',
    errorTryReloadMessage: 'Please try again later',
};

// ─── Types ───────────────────────────────────────────────────────

type RenderResult = { unmount: () => void; container: HTMLElement };

/**
 * Options to set up the SelectButton test suite.
 * Injected by the framework-specific test file (React or Vue).
 */
export interface SelectButtonTestSetup {
    components: {
        SelectButton: any;
        Combobox: any;
    };
    /**
     * Render a SelectButton template with controlled state management.
     *
     * @param template    JSX render function receiving `{ value, onChange, ... }`.
     * @param initialArgs Initial props (value, spies, etc.).
     */
    renderWithState: (template: (props: any) => any, initialArgs?: Record<string, any>) => RenderResult;
}

// ─── Template factory ─────────────────────────────────────────────

export function createTemplates(SelectButton: any) {
    /** Default single-select button template */
    const defaultTemplate = (props: any) => (
        <SelectButton label="Select a fruit" options={FRUITS} getOptionId="id" getOptionName="name" {...props} />
    );

    return { defaultTemplate };
}

// ═══════════════════════════════════════════════════════════════════
// Main test suite
// ═══════════════════════════════════════════════════════════════════

export default function selectButtonTests({ components, renderWithState }: SelectButtonTestSetup) {
    const { SelectButton, Combobox } = components;
    const { defaultTemplate } = createTemplates(SelectButton);

    // ─── Static rendering ────────────────────────────────────────

    describe('Static rendering', () => {
        it('should render the button with label', () => {
            renderWithState(defaultTemplate);
            const button = screen.getByRole('combobox');
            expect(button).toBeTruthy();
            // Button label text should appear in button content
            expect(button.textContent).toContain('Select a fruit');
        });

        it('should display selected value in button when pre-selected', () => {
            renderWithState(defaultTemplate, { value: FRUITS[2] });
            const button = screen.getByRole('combobox');
            expect(button.textContent).toContain('Banana');
        });

        it('should render options in the listbox', () => {
            renderWithState(defaultTemplate);
            const options = screen.getAllByRole('option');
            expect(options).toHaveLength(FRUITS.length);
            expect(options[0].textContent).toBe('Apple');
        });

        it('should mark selected option with aria-selected', () => {
            renderWithState(defaultTemplate, { value: FRUITS[1] });
            const options = screen.getAllByRole('option');
            expect(options[0].getAttribute('aria-selected')).toBe('false');
            expect(options[1].getAttribute('aria-selected')).toBe('true');
            expect(options[2].getAttribute('aria-selected')).toBe('false');
        });

        it('should render option descriptions when getOptionDescription is provided', () => {
            renderWithState(defaultTemplate, { getOptionDescription: 'description' });
            const options = screen.getAllByRole('option');
            const describedBy = options[0].getAttribute('aria-describedby');
            expect(describedBy).toBeTruthy();
            const descriptionId = describedBy!.split(' ')[0];
            const description = document.getElementById(descriptionId);
            expect(description?.textContent).toBe('A sweet red fruit');
        });
    });

    // ─── Open and select ─────────────────────────────────────────

    describe('Open and select', () => {
        it('should open on click and close after selecting an option', async () => {
            renderWithState(defaultTemplate);
            const button = screen.getByRole('combobox');

            expect(button.getAttribute('aria-expanded')).toBe('false');
            expect(button.textContent).toContain('Select a fruit');

            await userEvent.click(button);
            await waitFor(() => {
                expect(button.getAttribute('aria-expanded')).toBe('true');
            });

            expect(screen.getByRole('listbox')).toBeTruthy();

            const options = screen.getAllByRole('option').filter((o) => !o.hasAttribute('data-filtered'));
            await userEvent.click(options[2]); // Banana

            await waitFor(() => {
                expect(button.getAttribute('aria-expanded')).toBe('false');
                expect(button.textContent).toContain('Banana');
            });
        });

        it('should show selected value when pre-selected', () => {
            renderWithState(defaultTemplate, { value: FRUITS[3] });
            const button = screen.getByRole('combobox');
            expect(button.textContent).toContain('Blueberry');
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
            const button = screen.getByRole('combobox');
            await userEvent.click(button);

            await waitFor(() => {
                expect(screen.getByRole('listbox')).toBeTruthy();
            });

            const options = screen.getAllByRole('option').filter((o) => !o.hasAttribute('data-filtered'));
            const firstOption = options[0];
            expect(firstOption.textContent).toContain('Apple');

            const describedBy = firstOption.getAttribute('aria-describedby') as string;
            const descriptionId = describedBy.split(' ')[0];
            const description = document.getElementById(descriptionId);
            expect(description?.textContent).toBe('A sweet red fruit');
        });
    });

    // ─── Sections ────────────────────────────────────────────────

    describe('Sections', () => {
        it('should render sections as ARIA groups and allow selecting options', async () => {
            renderWithState(defaultTemplate, {
                getSectionId: 'category',
            });
            const button = screen.getByRole('combobox');

            await userEvent.click(button);
            await waitFor(() => {
                expect(button.getAttribute('aria-expanded')).toBe('true');
            });

            const groups = screen.getAllByRole('group');
            expect(groups.length).toBeGreaterThan(0);

            const options = screen.getAllByRole('option').filter((o) => !o.hasAttribute('data-filtered'));
            expect(options).toHaveLength(FRUITS.length);

            const blueberry = Array.from(options).find((o) => o.textContent === 'Blueberry')!;
            await userEvent.click(blueberry);

            await waitFor(() => {
                expect(button.getAttribute('aria-expanded')).toBe('false');
                expect(button.textContent).toContain('Blueberry');
            });
        });
    });

    // ─── Keyboard navigation ─────────────────────────────────────

    describe('Keyboard navigation', () => {
        it('should open dropdown when pressing Enter', async () => {
            renderWithState(defaultTemplate);
            const button = screen.getByRole('combobox');
            button.focus();

            expect(button.getAttribute('aria-expanded')).toBe('false');

            await userEvent.keyboard('{Enter}');
            await waitFor(() => {
                expect(button.getAttribute('aria-expanded')).toBe('true');
            });
        });

        it('should navigate with ArrowDown and select with Enter', async () => {
            renderWithState(defaultTemplate);
            const button = screen.getByRole('combobox');
            button.focus();

            await userEvent.keyboard('{Enter}');
            await waitFor(() => {
                expect(button.getAttribute('aria-expanded')).toBe('true');
            });

            await userEvent.keyboard('{ArrowDown}');
            const firstOption = screen.getAllByRole('option')[0];
            await waitFor(() => {
                expect(button.getAttribute('aria-activedescendant')).toBe(firstOption?.id ?? '');
            });

            await userEvent.keyboard('{Enter}');
            await waitFor(() => {
                expect(button.getAttribute('aria-expanded')).toBe('false');
                expect(button.textContent).toContain('Apple');
            });
        });

        it('should focus selected option when pressing ArrowDown with a pre-selected value', async () => {
            renderWithState(defaultTemplate, { value: FRUITS[5] }); // Grape (index 5)
            const button = screen.getByRole('combobox');
            button.focus();

            expect(button.textContent).toContain('Grape');
            expect(button.getAttribute('aria-expanded')).toBe('false');

            await userEvent.keyboard('{ArrowDown}');
            await waitFor(() => {
                expect(button.getAttribute('aria-expanded')).toBe('true');
            });

            await waitFor(() => {
                const options = screen.getAllByRole('option');
                const grapeOption = options?.[5]; // Grape is at index 5
                expect(grapeOption?.getAttribute('data-focus-visible-added')).toBe('true');
                expect(button.getAttribute('aria-activedescendant')).toBe(grapeOption?.id ?? '');
            });
        });

        it('should focus selected option when pressing ArrowUp with a pre-selected value', async () => {
            renderWithState(defaultTemplate, { value: FRUITS[2] }); // Banana (index 2)
            const button = screen.getByRole('combobox');
            button.focus();

            expect(button.textContent).toContain('Banana');
            expect(button.getAttribute('aria-expanded')).toBe('false');

            await userEvent.keyboard('{ArrowUp}');
            await waitFor(() => {
                expect(button.getAttribute('aria-expanded')).toBe('true');
            });

            await waitFor(() => {
                const options = screen.getAllByRole('option');
                const bananaOption = options?.[2]; // Banana is at index 2
                expect(bananaOption?.getAttribute('data-focus-visible-added')).toBe('true');
                expect(button.getAttribute('aria-activedescendant')).toBe(bananaOption?.id ?? '');
            });
        });

        it('should focus last option when pressing ArrowUp with no selection', async () => {
            renderWithState(defaultTemplate);
            const button = screen.getByRole('combobox');
            button.focus();

            expect(button.textContent).toContain('Select a fruit');
            expect(button.getAttribute('aria-expanded')).toBe('false');

            await userEvent.keyboard('{ArrowUp}');
            await waitFor(() => {
                expect(button.getAttribute('aria-expanded')).toBe('true');
            });

            await waitFor(() => {
                const options = screen.getAllByRole('option');
                const lastOption = options?.[options.length - 1]; // Strawberry is last
                expect(lastOption?.getAttribute('data-focus-visible-added')).toBe('true');
                expect(button.getAttribute('aria-activedescendant')).toBe(lastOption?.id ?? '');
            });
        });
    });

    // ─── labelDisplayMode ────────────────────────────────────────

    describe('labelDisplayMode', () => {
        describe('show-selection (default)', () => {
            it('should display the label when no value is selected', () => {
                renderWithState(defaultTemplate);
                const button = screen.getByRole('combobox', { name: 'Select a fruit' });
                expect(button.textContent).toContain('Select a fruit');
            });

            it('should display the selected value and keep the label as accessible name', () => {
                renderWithState(defaultTemplate, { value: FRUITS[2] });
                const button = screen.getByRole('combobox', { name: 'Select a fruit' });
                expect(button.textContent).toContain('Banana');
                expect(button.textContent).not.toContain('Select a fruit');
            });
        });

        describe('show-label', () => {
            it('should always display the label, even when a value is selected', () => {
                renderWithState(defaultTemplate, { labelDisplayMode: 'show-label', value: FRUITS[2] });
                const button = screen.getByRole('combobox', { name: 'Select a fruit' });
                expect(button.textContent).toContain('Select a fruit');
                expect(button.textContent).not.toContain('Banana');
            });

            it('should display the label when no value is selected', () => {
                renderWithState(defaultTemplate, { labelDisplayMode: 'show-label' });
                const button = screen.getByRole('combobox', { name: 'Select a fruit' });
                expect(button.textContent).toContain('Select a fruit');
            });
        });

        describe('show-tooltip', () => {
            it('should not render any text in the button but keep the accessible name', () => {
                renderWithState(defaultTemplate, { labelDisplayMode: 'show-tooltip' });
                const button = screen.getByRole('combobox', { name: 'Select a fruit' });
                expect(button.textContent).not.toContain('Select a fruit');
            });

            it('should not render any text in the button when a value is selected but keep the accessible name', () => {
                renderWithState(defaultTemplate, { labelDisplayMode: 'show-tooltip', value: FRUITS[2] });
                const button = screen.getByRole('combobox', { name: 'Select a fruit' });
                expect(button.textContent).not.toContain('Banana');
                expect(button.textContent).not.toContain('Select a fruit');
            });
        });
    });

    // ─── List status (loading / loadingMore / error) ────────────

    describe('List status', () => {
        it('should render skeleton placeholders when listStatus="loading"', async () => {
            renderWithState(defaultTemplate, { listStatus: 'loading', options: [] });
            const button = screen.getByRole('combobox');

            await userEvent.click(button);
            await waitFor(() => {
                expect(button.getAttribute('aria-expanded')).toBe('true');
            });

            // Skeleton placeholders use a known class in the Combobox component.
            const skeletons = document.body.querySelectorAll('.lumx-combobox-option-skeleton');
            expect(skeletons.length).toBeGreaterThan(0);
            // Real options should not be rendered.
            expect(screen.queryAllByRole('option')).toHaveLength(0);
        });

        it('should append a skeleton when listStatus="loadingMore"', async () => {
            renderWithState(defaultTemplate, {
                listStatus: 'loadingMore',
                options: FRUITS.slice(0, 3),
            });
            const button = screen.getByRole('combobox');

            await userEvent.click(button);
            await waitFor(() => {
                expect(button.getAttribute('aria-expanded')).toBe('true');
            });

            // Real options remain.
            expect(screen.getAllByRole('option')).toHaveLength(3);
            // A skeleton is appended after the options.
            const skeletons = document.body.querySelectorAll('.lumx-combobox-option-skeleton');
            expect(skeletons.length).toBeGreaterThan(0);
        });

        it('should render the error message when listStatus="error"', async () => {
            renderWithState(defaultTemplate, {
                listStatus: 'error',
                options: [],
                translations: { errorMessage: 'Failed to load', errorTryReloadMessage: 'Try again later' },
            });
            const button = screen.getByRole('combobox');

            await userEvent.click(button);
            await waitFor(() => {
                expect(button.getAttribute('aria-expanded')).toBe('true');
            });

            await waitFor(() => {
                const stateElement = document.body.querySelector('.lumx-combobox-state');
                expect(stateElement).toBeTruthy();
                expect(stateElement?.textContent).toContain('Failed to load');
                expect(stateElement?.textContent).toContain('Try again later');
            });
        });
    });
}
