/* eslint-disable no-await-in-loop */
import userEvent from '@testing-library/user-event';
import { fireEvent, waitFor } from '@testing-library/dom';
import { mdiDelete, mdiPencil } from '@lumx/icons';
import { CLASSNAME as COMBOBOX_LIST_CLASSNAME } from './ComboboxList';
import { CLASSNAME as COMBOBOX_OPTION_CLASSNAME } from './ComboboxOption';
import { CLASSNAME as COMBOBOX_OPTION_SKELETON_CLASSNAME } from './ComboboxOptionSkeleton';
import { CLASSNAME as COMBOBOX_POPOVER_CLASSNAME } from './ComboboxPopover';
import { CLASSNAME as COMBOBOX_SECTION_CLASSNAME } from './ComboboxSection';
import { CLASSNAME as COMBOBOX_STATE_CLASSNAME } from './ComboboxState';
import { VISUALLY_HIDDEN } from '../../constants';
import { setupCombobox } from './setupCombobox';

// ─── Fixtures ────────────────────────────────────────────────────

const FRUITS = ['Apple', 'Apricot', 'Banana', 'Blueberry', 'Cherry', 'Grape', 'Lemon', 'Orange', 'Peach', 'Strawberry'];

const FRUITS_WITH_DISABLED = ['Apple', 'Banana', 'Cherry'];

const GRID_FRUITS = ['Apple', 'Banana', 'Cherry'];

// ─── Types ───────────────────────────────────────────────────────

/** Combobox compound component namespace type. */
export interface ComboboxNamespace {
    Provider: any;
    Input: any;
    Button: any;
    List: any;
    Option: any;
    OptionAction: any;
    OptionMoreInfo: any;
    OptionSkeleton: any;
    Popover: any;
    Section: any;
    State: any;
}

type RenderResult = { unmount: () => void; container: HTMLElement };

/**
 * Options to set up the combobox test suite.
 * Injected by the framework-specific test file (React or Vue).
 */
export interface ComboboxTestSetup {
    components: {
        Combobox: ComboboxNamespace;
        IconButton: any;
        Button: any;
    };
    /**
     * Render a template with controlled state management.
     * Mirrors the withValueOnChange Storybook decorator.
     *
     * @param template   JSX render function receiving `{ value, onChange/onSelect, ... }`.
     * @param initialArgs Initial props (value, spies, etc.).
     * @param options     State wiring config (which prop manages state, how to extract value).
     */
    renderWithState: (
        template: (props: any) => any,
        initialArgs?: Record<string, any>,
        options?: { onChangeProp?: string; valueExtract?: (v: any) => any },
    ) => RenderResult;
}

// ─── DOM Helpers ─────────────────────────────────────────────────
// Options are rendered in a portal (document.body), outside the component container.
// All option/listbox queries target document.body.

function getInput(): HTMLInputElement {
    return document.body.querySelector<HTMLInputElement>('input[placeholder="Pick a fruit…"]')!;
}

function getButtonTrigger(): HTMLButtonElement {
    return document.body.querySelector<HTMLButtonElement>('[data-testid="combobox-button"]')!;
}

function getToggleButton(): HTMLButtonElement | null {
    return document.body.querySelector<HTMLButtonElement>('button[aria-controls]');
}

function getStateContainer(): HTMLElement | null {
    return document.body.querySelector<HTMLElement>(`.${COMBOBOX_STATE_CLASSNAME}`);
}

function getActiveOption(): HTMLElement | null {
    return document.body.querySelector('[role="option"][data-focus-visible-added="true"]');
}

function getVisibleOptions(): HTMLElement[] {
    return Array.from(document.body.querySelectorAll<HTMLElement>('[role="option"]:not([data-filtered])'));
}

function getAllOptions(): HTMLElement[] {
    return Array.from(document.body.querySelectorAll<HTMLElement>('[role="option"]'));
}

function getListbox(listboxId: string): HTMLElement | null {
    return document.getElementById(listboxId);
}

function getActiveCell(): HTMLElement | null {
    return document.body.querySelector('[role="gridcell"][data-focus-visible-added="true"]');
}

function getVisibleGridOptions(): HTMLElement[] {
    const rows = Array.from(document.body.querySelectorAll('[role="row"]')) as HTMLElement[];
    return rows
        .map((row) => row.querySelector('[role="gridcell"]') as HTMLElement | null)
        .filter((cell): cell is HTMLElement => cell !== null && !cell.hasAttribute('data-filtered'));
}

// ─── Templates ───────────────────────────────────────────────────

/**
 * Create framework-agnostic JSX templates for combobox test fixtures.
 * Exported so TestStories.tsx can reuse the same templates for browser-only tests.
 */
export function createTemplates(Combobox: ComboboxNamespace, IconButton: any) {
    /** Standard combobox with input trigger and 10 fruit options. */
    const inputTemplate = ({
        value,
        onChange,
        onSelect,
    }: {
        value: string;
        onChange: (v: string) => void;
        onSelect?: (option: { value: string }) => void;
    }) => (
        <Combobox.Provider>
            <Combobox.Input
                value={value}
                onChange={onChange}
                onSelect={onSelect}
                placeholder="Pick a fruit…"
                toggleButtonProps={{ label: 'Fruits' }}
            />
            <Combobox.Popover>
                <Combobox.List aria-label="Fruits">
                    {FRUITS.map((fruit) => (
                        <Combobox.Option key={fruit} value={fruit}>
                            {fruit}
                        </Combobox.Option>
                    ))}
                </Combobox.List>
            </Combobox.Popover>
        </Combobox.Provider>
    );

    /** Select-only combobox with button trigger and 10 fruit options. */
    const buttonTemplate = ({ value, onSelect }: { value: string; onSelect: (option: { value: string }) => void }) => (
        <Combobox.Provider>
            <Combobox.Button label="Select a fruit" value={value} data-testid="combobox-button" onSelect={onSelect} />
            <Combobox.Popover>
                <Combobox.List aria-label="Fruits">
                    {FRUITS.map((fruit) => (
                        <Combobox.Option key={fruit} value={fruit}>
                            {fruit}
                        </Combobox.Option>
                    ))}
                </Combobox.List>
            </Combobox.Popover>
        </Combobox.Provider>
    );

    /** Button trigger with labelDisplayMode="show-label". */
    const showLabelButtonTemplate = ({
        value,
        onSelect,
    }: {
        value: string;
        onSelect: (option: { value: string }) => void;
    }) => (
        <Combobox.Provider>
            <Combobox.Button
                label="Select a fruit"
                value={value}
                labelDisplayMode="show-label"
                data-testid="combobox-button"
                onSelect={onSelect}
            />
            <Combobox.Popover>
                <Combobox.List aria-label="Fruits">
                    {FRUITS.map((fruit) => (
                        <Combobox.Option key={fruit} value={fruit}>
                            {fruit}
                        </Combobox.Option>
                    ))}
                </Combobox.List>
            </Combobox.Popover>
        </Combobox.Provider>
    );

    /** Button trigger with labelDisplayMode="show-tooltip". */
    const showTooltipButtonTemplate = ({
        value,
        onSelect,
    }: {
        value: string;
        onSelect: (option: { value: string }) => void;
    }) => (
        <Combobox.Provider>
            <Combobox.Button
                label="Select a fruit"
                value={value}
                labelDisplayMode="show-tooltip"
                data-testid="combobox-button"
                onSelect={onSelect}
            />
            <Combobox.Popover>
                <Combobox.List aria-label="Fruits">
                    {FRUITS.map((fruit) => (
                        <Combobox.Option key={fruit} value={fruit}>
                            {fruit}
                        </Combobox.Option>
                    ))}
                </Combobox.List>
            </Combobox.Popover>
        </Combobox.Provider>
    );

    /** Button trigger with options that have NO explicit value prop (textContent fallback). */
    const noValueButtonTemplate = ({
        value,
        onSelect,
    }: {
        value: string;
        onSelect: (option: { value: string }) => void;
    }) => (
        <Combobox.Provider>
            <Combobox.Button label="Select a fruit" value={value} data-testid="combobox-button" onSelect={onSelect} />
            <Combobox.Popover>
                <Combobox.List aria-label="Fruits">
                    {FRUITS.map((fruit) => (
                        <Combobox.Option key={fruit}>{fruit}</Combobox.Option>
                    ))}
                </Combobox.List>
            </Combobox.Popover>
        </Combobox.Provider>
    );

    /** Button trigger with isSelected derived from current value. */
    const selectedButtonTemplate = ({
        value,
        onSelect,
    }: {
        value: string;
        onSelect: (option: { value: string }) => void;
    }) => (
        <Combobox.Provider>
            <Combobox.Button label="Select a fruit" value={value} data-testid="combobox-button" onSelect={onSelect} />
            <Combobox.Popover>
                <Combobox.List aria-label="Fruits">
                    {FRUITS.map((fruit) => (
                        <Combobox.Option key={fruit} value={fruit} isSelected={value === fruit}>
                            {fruit}
                        </Combobox.Option>
                    ))}
                </Combobox.List>
            </Combobox.Popover>
        </Combobox.Provider>
    );

    /** Input trigger with a disabled option ("Banana"). */
    const disabledInputTemplate = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
        <Combobox.Provider>
            <Combobox.Input
                value={value}
                onChange={onChange}
                onSelect={({ value: v }: { value: string }) => onChange(v)}
                placeholder="Pick a fruit…"
                toggleButtonProps={{ label: 'Fruits' }}
            />
            <Combobox.Popover>
                <Combobox.List aria-label="Fruits">
                    {FRUITS_WITH_DISABLED.map((fruit) => (
                        <Combobox.Option key={fruit} value={fruit} isDisabled={fruit === 'Banana'}>
                            {fruit}
                        </Combobox.Option>
                    ))}
                </Combobox.List>
            </Combobox.Popover>
        </Combobox.Provider>
    );

    /** Button trigger with a disabled option ("Banana"). */
    const disabledButtonTemplate = ({
        value,
        onSelect,
    }: {
        value: string;
        onSelect: (option: { value: string }) => void;
    }) => (
        <Combobox.Provider>
            <Combobox.Button label="Select a fruit" value={value} data-testid="combobox-button" onSelect={onSelect} />
            <Combobox.Popover>
                <Combobox.List aria-label="Fruits">
                    {FRUITS_WITH_DISABLED.map((fruit) => (
                        <Combobox.Option key={fruit} value={fruit} isDisabled={fruit === 'Banana'}>
                            {fruit}
                        </Combobox.Option>
                    ))}
                </Combobox.List>
            </Combobox.Popover>
        </Combobox.Provider>
    );

    /** Grid combobox with input trigger and two actions per option. */
    const gridInputTemplate = ({
        value,
        onChange,
        onSelect,
        onDelete,
        onEdit,
    }: {
        value: string;
        onChange: (v: string) => void;
        onSelect?: (option: { value: string }) => void;
        onDelete?: (...args: unknown[]) => void;
        onEdit?: (...args: unknown[]) => void;
    }) => (
        <Combobox.Provider>
            <Combobox.Input
                value={value}
                onChange={onChange}
                onSelect={(option: { value: string }) => {
                    onChange(option.value);
                    onSelect?.(option);
                }}
                placeholder="Pick a fruit…"
                toggleButtonProps={{ label: 'Fruits' }}
            />
            <Combobox.Popover>
                <Combobox.List type="grid" aria-label="Fruits">
                    {GRID_FRUITS.map((fruit) => (
                        <Combobox.Option
                            key={fruit}
                            value={fruit}
                            after={
                                <>
                                    <Combobox.OptionAction
                                        as={IconButton}
                                        icon={mdiPencil}
                                        label="Edit"
                                        emphasis="low"
                                        size="s"
                                        hideTooltip
                                        onClick={onEdit}
                                    />
                                    <Combobox.OptionAction
                                        as={IconButton}
                                        icon={mdiDelete}
                                        label="Delete"
                                        emphasis="low"
                                        size="s"
                                        hideTooltip
                                        onClick={onDelete}
                                    />
                                </>
                            }
                        >
                            {fruit}
                        </Combobox.Option>
                    ))}
                </Combobox.List>
            </Combobox.Popover>
        </Combobox.Provider>
    );

    /** Grid combobox with button trigger and one action per option. */
    const gridButtonTemplate = ({
        value,
        onSelect,
        onDelete,
    }: {
        value: string;
        onSelect: (option: { value: string }) => void;
        onDelete?: (...args: unknown[]) => void;
    }) => (
        <Combobox.Provider>
            <Combobox.Button label="Select a fruit" value={value} data-testid="combobox-button" onSelect={onSelect} />
            <Combobox.Popover>
                <Combobox.List type="grid" aria-label="Fruits">
                    {GRID_FRUITS.map((fruit) => (
                        <Combobox.Option
                            key={fruit}
                            value={fruit}
                            after={
                                <Combobox.OptionAction
                                    as={IconButton}
                                    icon={mdiDelete}
                                    label="Delete"
                                    emphasis="low"
                                    size="s"
                                    hideTooltip
                                    onClick={onDelete}
                                />
                            }
                        >
                            {fruit}
                        </Combobox.Option>
                    ))}
                </Combobox.List>
            </Combobox.Popover>
        </Combobox.Provider>
    );

    /** Combobox with empty state — options filtered by input. */
    const emptyStateTemplate = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
        <Combobox.Provider>
            <Combobox.Input
                value={value}
                onChange={onChange}
                placeholder="Pick a fruit…"
                toggleButtonProps={{ label: 'Fruits' }}
            />
            <Combobox.Popover>
                <Combobox.List aria-label="Fruits">
                    {FRUITS.map((fruit) => (
                        <Combobox.Option key={fruit} value={fruit}>
                            {fruit}
                        </Combobox.Option>
                    ))}
                </Combobox.List>
                <Combobox.State
                    emptyMessage={(inputValue: string) =>
                        inputValue ? `No results for "${inputValue}"` : 'No results'
                    }
                />
            </Combobox.Popover>
        </Combobox.Provider>
    );

    /** Combobox with error state — no options, error message displayed. */
    const errorStateTemplate = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
        <Combobox.Provider>
            <Combobox.Input
                value={value}
                onChange={onChange}
                placeholder="Pick a fruit…"
                toggleButtonProps={{ label: 'Fruits' }}
            />
            <Combobox.Popover>
                <Combobox.List aria-label="Fruits">{/* no options — simulating a failed load */}</Combobox.List>
                <Combobox.State errorMessage="Service unavailable" errorTryReloadMessage="Please try again later" />
            </Combobox.Popover>
        </Combobox.Provider>
    );

    /** Combobox with skeleton loading — no options yet, skeletons shown. */
    const loadingTemplate = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
        <Combobox.Provider>
            <Combobox.Input
                value={value}
                onChange={onChange}
                placeholder="Pick a fruit…"
                toggleButtonProps={{ label: 'Fruits' }}
            />
            <Combobox.Popover>
                <Combobox.List aria-label="Fruits">
                    <Combobox.OptionSkeleton count={3} />
                </Combobox.List>
                <Combobox.State loadingMessage="Loading fruits…" emptyMessage="No results" />
            </Combobox.Popover>
        </Combobox.Provider>
    );

    /** Combobox with loading appended after real options (load-more pattern). */
    const loadMoreTemplate = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
        <Combobox.Provider>
            <Combobox.Input
                value={value}
                onChange={onChange}
                placeholder="Pick a fruit…"
                toggleButtonProps={{ label: 'Fruits' }}
            />
            <Combobox.Popover>
                <Combobox.List aria-label="Fruits">
                    {FRUITS.map((fruit) => (
                        <Combobox.Option key={fruit} value={fruit}>
                            {fruit}
                        </Combobox.Option>
                    ))}
                    <Combobox.OptionSkeleton count={3} />
                </Combobox.List>
            </Combobox.Popover>
        </Combobox.Provider>
    );

    /** Combobox with section loading — skeletons within a section. */
    const sectionLoadingTemplate = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
        <Combobox.Provider>
            <Combobox.Input
                value={value}
                onChange={onChange}
                placeholder="Pick a fruit…"
                toggleButtonProps={{ label: 'Fruits' }}
            />
            <Combobox.Popover>
                <Combobox.List aria-label="Fruits">
                    <Combobox.Section label="Available">
                        {FRUITS.slice(0, 3).map((fruit) => (
                            <Combobox.Option key={fruit} value={fruit}>
                                {fruit}
                            </Combobox.Option>
                        ))}
                    </Combobox.Section>
                    <Combobox.Section label="Loading…">
                        <Combobox.OptionSkeleton count={3} />
                    </Combobox.Section>
                </Combobox.List>
            </Combobox.Popover>
        </Combobox.Provider>
    );

    /** Combobox with an option that has a description. */
    const descriptionTemplate = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
        <Combobox.Provider>
            <Combobox.Input
                value={value}
                onChange={onChange}
                placeholder="Pick a fruit…"
                toggleButtonProps={{ label: 'Fruits' }}
            />
            <Combobox.Popover>
                <Combobox.List aria-label="Fruits">
                    <Combobox.Option key="Apple" value="Apple" description="A round red fruit">
                        Apple
                    </Combobox.Option>
                    <Combobox.Option key="Banana" value="Banana">
                        Banana
                    </Combobox.Option>
                </Combobox.List>
            </Combobox.Popover>
        </Combobox.Provider>
    );

    return {
        inputTemplate,
        buttonTemplate,
        showLabelButtonTemplate,
        showTooltipButtonTemplate,
        noValueButtonTemplate,
        selectedButtonTemplate,
        disabledInputTemplate,
        disabledButtonTemplate,
        gridInputTemplate,
        gridButtonTemplate,
        emptyStateTemplate,
        errorStateTemplate,
        loadingTemplate,
        loadMoreTemplate,
        sectionLoadingTemplate,
        descriptionTemplate,
    };
}

// ─── Constants ───────────────────────────────────────────────────

/** State management options for button-trigger tests (onSelect manages value). */
const BUTTON_STATE = { onChangeProp: 'onSelect', valueExtract: (v: any) => v?.value } as const;

// ═══════════════════════════════════════════════════════════════════
// Test Suite
// ═══════════════════════════════════════════════════════════════════

export default function comboboxTests({ components: { Combobox, IconButton }, renderWithState }: ComboboxTestSetup) {
    const t = createTemplates(Combobox, IconButton);

    // ───────────────────────────────────────────────────────────────
    // Role, Property, State, and Tabindex Attributes — Textbox
    // ───────────────────────────────────────────────────────────────

    describe('Input trigger - ARIA attributes', () => {
        it('should have correct textbox ARIA attributes', async () => {
            renderWithState(t.inputTemplate);
            const input = getInput();

            expect(input).toHaveAttribute('role', 'combobox');
            expect(input).toHaveAttribute('aria-autocomplete', 'list');
            expect(input).toHaveAttribute('aria-controls');
            const controlsId = input.getAttribute('aria-controls')!;
            expect(controlsId).toBeTruthy();
            expect(input).toHaveAttribute('aria-expanded', 'false');
            expect(input).toHaveAttribute('aria-activedescendant', '');

            await userEvent.click(input);
            await waitFor(() => {
                expect(input).toHaveAttribute('aria-expanded', 'true');
            });

            await waitFor(() => {
                const listbox = getListbox(controlsId);
                expect(listbox).not.toBeNull();
                expect(listbox).toHaveAttribute('role', 'listbox');
            });
        });

        it('should have correct listbox ARIA attributes', async () => {
            renderWithState(t.inputTemplate);
            const input = getInput();
            await userEvent.click(input);

            await waitFor(() => {
                expect(input).toHaveAttribute('aria-expanded', 'true');
            });

            // Verify the scroll wrapper is rendered inside the popover
            const popover = document.body.querySelector(`.${COMBOBOX_POPOVER_CLASSNAME}`);
            expect(popover).not.toBeNull();
            const scrollWrapper = popover!.querySelector(`.${COMBOBOX_POPOVER_CLASSNAME}__scroll`);
            expect(scrollWrapper).not.toBeNull();

            const listboxId = input.getAttribute('aria-controls')!;
            const listbox = getListbox(listboxId)!;

            expect(listbox).toHaveAttribute('role', 'listbox');
            expect(listbox).toHaveAttribute('aria-label', 'Fruits');
            expect(listbox.classList.contains(COMBOBOX_LIST_CLASSNAME)).toBe(true);

            const options = Array.from(listbox.querySelectorAll('[role="option"]'));
            expect(options.length).toBe(FRUITS.length);

            for (const opt of options) {
                expect(opt.id).toBeTruthy();
                // Each option trigger should have the combobox option trigger class
                expect(opt.classList.contains(`${COMBOBOX_OPTION_CLASSNAME}__action`)).toBe(true);
                // The parent list item should have the combobox option class
                const listItem = opt.closest(`.${COMBOBOX_OPTION_CLASSNAME}`);
                expect(listItem).not.toBeNull();
            }
        });

        it('should render option description with correct class', async () => {
            renderWithState(t.descriptionTemplate);
            const input = getInput();
            await userEvent.click(input);

            await waitFor(() => {
                expect(input).toHaveAttribute('aria-expanded', 'true');
            });

            const descriptionEl = document.body.querySelector(`.${COMBOBOX_OPTION_CLASSNAME}__description`);
            expect(descriptionEl).not.toBeNull();
            expect(descriptionEl!.textContent).toBe('A round red fruit');
        });

        it('should have toggle button with correct ARIA attributes', async () => {
            renderWithState(t.inputTemplate);
            const input = getInput();
            const button = getToggleButton()!;
            expect(button).not.toBeNull();

            expect(button).toHaveAttribute('tabindex', '-1');
            expect(button).toHaveAccessibleName();

            const controlsId = input.getAttribute('aria-controls')!;
            expect(button).toHaveAttribute('aria-controls', controlsId);
            expect(button).toHaveAttribute('aria-expanded', 'false');

            await userEvent.click(input);
            await waitFor(() => {
                expect(button).toHaveAttribute('aria-expanded', 'true');
            });
        });
    });

    // ───────────────────────────────────────────────────────────────
    // Keyboard Support — Textbox
    // ───────────────────────────────────────────────────────────────

    describe('Input trigger - Keyboard support', () => {
        it('should open and focus first option on ArrowDown', async () => {
            renderWithState(t.inputTemplate);
            const input = getInput();
            await userEvent.click(input);

            await waitFor(() => {
                expect(input).toHaveAttribute('aria-expanded', 'true');
            });

            await userEvent.keyboard('{ArrowDown}');

            await waitFor(() => {
                const active = getActiveOption();
                expect(active).not.toBeNull();
                expect(active!.textContent).toBe('Apple');
                expect(input).toHaveAttribute('aria-activedescendant', active!.id);
            });

            expect(document.activeElement).toBe(input);
        });

        it('should open without moving focus on Alt+ArrowDown', async () => {
            renderWithState(t.inputTemplate);
            const input = getInput();
            await userEvent.click(input);

            await waitFor(() => {
                expect(input).toHaveAttribute('aria-expanded', 'true');
            });

            await userEvent.keyboard('{Alt>}{ArrowDown}{/Alt}');
            expect(getActiveOption()).toBeNull();
            expect(input).toHaveAttribute('aria-expanded', 'true');
            expect(document.activeElement).toBe(input);
        });

        it('should focus last option on ArrowUp', async () => {
            renderWithState(t.inputTemplate);
            const input = getInput();
            await userEvent.click(input);

            await waitFor(() => {
                expect(input).toHaveAttribute('aria-expanded', 'true');
            });

            await userEvent.keyboard('{ArrowUp}');

            await waitFor(() => {
                const active = getActiveOption();
                expect(active).not.toBeNull();
                expect(active!.textContent).toBe('Strawberry');
                expect(input).toHaveAttribute('aria-activedescendant', active!.id);
            });

            expect(document.activeElement).toBe(input);
        });

        it('should close listbox on Enter', async () => {
            renderWithState(t.inputTemplate);
            const input = getInput();
            await userEvent.click(input);

            await waitFor(() => {
                expect(input).toHaveAttribute('aria-expanded', 'true');
            });

            await userEvent.keyboard('{Enter}');
            await waitFor(() => {
                expect(input).toHaveAttribute('aria-expanded', 'false');
            });
        });

        it('should close listbox on Escape then clear on second Escape', async () => {
            renderWithState(t.inputTemplate);
            const input = getInput();
            await userEvent.click(input);

            await waitFor(() => {
                expect(input).toHaveAttribute('aria-expanded', 'true');
            });

            await userEvent.type(input, 'App');

            await userEvent.keyboard('{Escape}');
            await waitFor(() => {
                expect(input).toHaveAttribute('aria-expanded', 'false');
            });
            expect(input.value).toBe('App');

            await userEvent.keyboard('{Escape}');
            expect(input.value).toBe('');
        });
    });

    // ───────────────────────────────────────────────────────────────
    // Keyboard Support — Listbox
    // ───────────────────────────────────────────────────────────────

    describe('Input trigger - Listbox keyboard', () => {
        it('should select on Enter and close', async () => {
            const onSelect = vi.fn();
            renderWithState(t.inputTemplate, { value: '', onSelect });
            const input = getInput();
            await userEvent.click(input);

            await waitFor(() => {
                expect(input).toHaveAttribute('aria-expanded', 'true');
            });

            for (let i = 0; i < 5; i++) await userEvent.keyboard('{ArrowDown}');
            await waitFor(() => {
                expect(getActiveOption()!.textContent).toBe('Cherry');
            });

            await userEvent.keyboard('{Enter}');
            await waitFor(() => {
                expect(input.value).toBe('Cherry');
                expect(input).toHaveAttribute('aria-expanded', 'false');
                expect(getActiveOption()).toBeNull();
                expect(input).toHaveAttribute('aria-activedescendant', '');
            });

            expect(onSelect).toHaveBeenCalled();
        });

        it('should close on Escape and clear active descendant', async () => {
            renderWithState(t.inputTemplate);
            const input = getInput();
            await userEvent.click(input);

            await waitFor(() => {
                expect(input).toHaveAttribute('aria-expanded', 'true');
            });

            await userEvent.keyboard('{ArrowDown}');
            await waitFor(() => {
                expect(getActiveOption()).not.toBeNull();
            });

            await userEvent.keyboard('{Escape}');
            await waitFor(() => {
                expect(input).toHaveAttribute('aria-expanded', 'false');
                expect(getActiveOption()).toBeNull();
                expect(input).toHaveAttribute('aria-activedescendant', '');
            });
        });

        it('should cycle options with ArrowDown', async () => {
            renderWithState(t.inputTemplate);
            const input = getInput();
            await userEvent.click(input);

            await waitFor(() => {
                expect(input).toHaveAttribute('aria-expanded', 'true');
            });

            await userEvent.keyboard('{ArrowDown}');
            await waitFor(() => {
                expect(getActiveOption()!.textContent).toBe('Apple');
            });

            await userEvent.keyboard('{ArrowDown}');
            expect(getActiveOption()!.textContent).toBe('Apricot');

            for (let i = 0; i < 8; i++) await userEvent.keyboard('{ArrowDown}');
            expect(getActiveOption()!.textContent).toBe('Strawberry');

            await userEvent.keyboard('{ArrowDown}');
            expect(getActiveOption()!.textContent).toBe('Apple');

            expect(document.activeElement).toBe(input);
        });

        it('should cycle options with ArrowUp', async () => {
            renderWithState(t.inputTemplate);
            const input = getInput();
            await userEvent.click(input);

            await waitFor(() => {
                expect(input).toHaveAttribute('aria-expanded', 'true');
            });

            await userEvent.keyboard('{ArrowDown}');
            await waitFor(() => {
                expect(getActiveOption()!.textContent).toBe('Apple');
            });

            await userEvent.keyboard('{ArrowUp}');
            expect(getActiveOption()!.textContent).toBe('Strawberry');

            await userEvent.keyboard('{ArrowUp}');
            expect(getActiveOption()!.textContent).toBe('Peach');

            expect(document.activeElement).toBe(input);
        });

        it('should return focus to input on ArrowRight', async () => {
            renderWithState(t.inputTemplate);
            const input = getInput();
            await userEvent.click(input);
            await userEvent.type(input, 'A');

            await waitFor(() => {
                expect(input).toHaveAttribute('aria-expanded', 'true');
            });

            await userEvent.keyboard('{ArrowDown}');
            await waitFor(() => {
                expect(getActiveOption()).not.toBeNull();
            });

            await userEvent.keyboard('{ArrowRight}');
            expect(getActiveOption()).toBeNull();
            expect(input).toHaveAttribute('aria-activedescendant', '');
        });

        it('should return focus to input on ArrowLeft', async () => {
            renderWithState(t.inputTemplate);
            const input = getInput();
            await userEvent.click(input);
            await userEvent.type(input, 'A');

            await waitFor(() => {
                expect(input).toHaveAttribute('aria-expanded', 'true');
            });

            await userEvent.keyboard('{ArrowDown}');
            await waitFor(() => {
                expect(getActiveOption()).not.toBeNull();
            });

            await userEvent.keyboard('{ArrowLeft}');
            expect(getActiveOption()).toBeNull();
            expect(input).toHaveAttribute('aria-activedescendant', '');
        });

        it('should return focus to input on Home', async () => {
            renderWithState(t.inputTemplate);
            const input = getInput();
            await userEvent.click(input);
            await userEvent.type(input, 'App');

            await waitFor(() => {
                expect(input).toHaveAttribute('aria-expanded', 'true');
            });

            await userEvent.keyboard('{ArrowDown}');
            await waitFor(() => {
                expect(getActiveOption()).not.toBeNull();
            });

            await userEvent.keyboard('{Home}');
            expect(getActiveOption()).toBeNull();
            expect(input).toHaveAttribute('aria-activedescendant', '');
            expect(input.selectionStart).toBe(0);
        });

        it('should return focus to input on End', async () => {
            renderWithState(t.inputTemplate);
            const input = getInput();
            await userEvent.click(input);
            await userEvent.type(input, 'App');

            await waitFor(() => {
                expect(input).toHaveAttribute('aria-expanded', 'true');
            });

            await userEvent.keyboard('{ArrowDown}');
            await waitFor(() => {
                expect(getActiveOption()).not.toBeNull();
            });

            await userEvent.keyboard('{End}');
            expect(getActiveOption()).toBeNull();
            expect(input).toHaveAttribute('aria-activedescendant', '');
            expect(input.selectionStart).toBe(3);
        });

        it('should return focus to input and filter on typing', async () => {
            renderWithState(t.inputTemplate);
            const input = getInput();
            await userEvent.click(input);

            await waitFor(() => {
                expect(input).toHaveAttribute('aria-expanded', 'true');
            });

            await userEvent.keyboard('{ArrowDown}');
            await waitFor(() => {
                expect(getActiveOption()!.textContent).toBe('Apple');
            });

            await userEvent.type(input, 'B');
            expect(getActiveOption()).toBeNull();

            await waitFor(() => {
                // Banana, Blueberry, Strawberry (includes match)
                expect(getVisibleOptions().length).toBe(3);
            });
        });
    });

    // ───────────────────────────────────────────────────────────────
    // DOM Focus
    // ───────────────────────────────────────────────────────────────

    describe('Input trigger - DOM focus', () => {
        it('should keep DOM focus on textbox during navigation', async () => {
            renderWithState(t.inputTemplate);
            const input = getInput();
            await userEvent.click(input);

            await waitFor(() => {
                expect(input).toHaveAttribute('aria-expanded', 'true');
            });

            expect(document.activeElement).toBe(input);

            await userEvent.keyboard('{ArrowDown}');
            expect(document.activeElement).toBe(input);

            await userEvent.keyboard('{ArrowDown}');
            expect(document.activeElement).toBe(input);

            await userEvent.keyboard('{ArrowUp}');
            expect(document.activeElement).toBe(input);

            await userEvent.keyboard('{Enter}');
            expect(document.activeElement).toBe(input);
        });

        it('should remove toggle button from tab sequence', () => {
            renderWithState(t.inputTemplate);
            const button = getToggleButton()!;
            expect(button).toHaveAttribute('tabindex', '-1');
        });
    });

    // ───────────────────────────────────────────────────────────────
    // Mouse / Click Interactions (jsdom-safe subset)
    // ───────────────────────────────────────────────────────────────

    describe('Input trigger - Click interactions', () => {
        it('should select option on click', async () => {
            const onSelect = vi.fn();
            renderWithState(t.inputTemplate, { value: '', onSelect });
            const input = getInput();
            await userEvent.click(input);

            await waitFor(() => {
                expect(input).toHaveAttribute('aria-expanded', 'true');
            });

            const orangeOption = getVisibleOptions().find((o) => o.textContent === 'Orange')!;
            await userEvent.click(orangeOption);

            expect(input.value).toBe('Orange');
            expect(getActiveOption()).toBeNull();
            expect(onSelect).toHaveBeenCalled();
        });

        it('should filter options by typing', async () => {
            renderWithState(t.inputTemplate);
            const input = getInput();
            await userEvent.click(input);

            await waitFor(() => {
                expect(input).toHaveAttribute('aria-expanded', 'true');
            });

            await userEvent.type(input, 'bl');

            await waitFor(() => {
                expect(getVisibleOptions().length).toBe(1);
                expect(getVisibleOptions()[0].textContent).toBe('Blueberry');
            });
        });

        it('should select after filtering', async () => {
            renderWithState(t.inputTemplate);
            const input = getInput();
            await userEvent.click(input);

            await waitFor(() => {
                expect(input).toHaveAttribute('aria-expanded', 'true');
            });

            await userEvent.type(input, 'lem');

            await waitFor(() => {
                expect(getVisibleOptions().length).toBe(1);
            });

            await userEvent.keyboard('{ArrowDown}');
            await waitFor(() => {
                expect(getActiveOption()!.textContent).toBe('Lemon');
            });

            await userEvent.keyboard('{Enter}');
            await waitFor(() => {
                expect(input.value).toBe('Lemon');
                expect(input).toHaveAttribute('aria-expanded', 'false');
            });
        });

        it('should open and focus input on toggle button click', async () => {
            renderWithState(t.inputTemplate);
            const input = getInput();
            const button = getToggleButton()!;

            expect(input).toHaveAttribute('aria-expanded', 'false');

            await userEvent.click(button);
            await waitFor(() => {
                expect(input).toHaveAttribute('aria-expanded', 'true');
            });
            expect(document.activeElement).toBe(input);

            await userEvent.keyboard('{Escape}');
            await waitFor(() => {
                expect(input).toHaveAttribute('aria-expanded', 'false');
            });

            await userEvent.click(button);
            await waitFor(() => {
                expect(input).toHaveAttribute('aria-expanded', 'true');
            });
            expect(document.activeElement).toBe(input);
        });

        it('should select option on click and fire onSelect', async () => {
            const onSelect = vi.fn();
            renderWithState(t.inputTemplate, { value: '', onSelect });
            const input = getInput();
            await userEvent.click(input);

            await waitFor(() => {
                expect(input).toHaveAttribute('aria-expanded', 'true');
            });

            const grapeOption = getVisibleOptions().find((o) => o.textContent === 'Grape')!;
            await userEvent.click(grapeOption);

            expect(input.value).toBe('Grape');
            expect(getActiveOption()).toBeNull();
            expect(input).toHaveAttribute('aria-activedescendant', '');
            expect(onSelect).toHaveBeenCalled();
        });

        it('should keep focus on input after clicking option', async () => {
            renderWithState(t.inputTemplate);
            const input = getInput();
            await userEvent.click(input);

            await waitFor(() => {
                expect(input).toHaveAttribute('aria-expanded', 'true');
            });

            const orangeOption = getVisibleOptions().find((o) => o.textContent === 'Orange')!;
            await userEvent.click(orangeOption);

            expect(document.activeElement).toBe(input);
        });

        it('should reopen listbox when typing after Escape', async () => {
            renderWithState(t.inputTemplate);
            const input = getInput();
            await userEvent.click(input);

            await waitFor(() => {
                expect(input).toHaveAttribute('aria-expanded', 'true');
            });

            await userEvent.type(input, 'ap');
            await waitFor(() => {
                // Apple, Apricot, Grape (includes match)
                expect(getVisibleOptions().length).toBe(3);
            });

            await userEvent.keyboard('{Escape}');
            await waitFor(() => {
                expect(input).toHaveAttribute('aria-expanded', 'false');
            });
            expect(input.value).toBe('ap');

            await userEvent.type(input, 'p');
            await waitFor(() => {
                expect(input).toHaveAttribute('aria-expanded', 'true');
                expect(input.value).toBe('app');
                expect(getVisibleOptions().length).toBe(1);
                expect(getVisibleOptions()[0].textContent).toBe('Apple');
            });
        });
    });

    // ───────────────────────────────────────────────────────────────
    // Combobox.Button Tests (Select-only with button trigger)
    // ───────────────────────────────────────────────────────────────

    describe('Button trigger - ARIA attributes', () => {
        it('should have correct button ARIA attributes', async () => {
            renderWithState(t.buttonTemplate, { value: '' }, BUTTON_STATE);
            const button = getButtonTrigger();

            expect(button).toHaveAttribute('role', 'combobox');
            expect(button).toHaveAttribute('aria-haspopup', 'listbox');
            expect(button).toHaveAttribute('aria-controls');
            expect(button).toHaveAttribute('aria-activedescendant', '');
            expect(button).toHaveAttribute('aria-expanded', 'false');

            await userEvent.click(button);
            await waitFor(() => {
                expect(button).toHaveAttribute('aria-expanded', 'true');
            });

            const listbox = document.body.querySelector('[role="listbox"]')!;
            expect(listbox).toHaveAttribute('role', 'listbox');

            const options = getAllOptions();
            for (const opt of options) {
                expect(opt.id).toBeTruthy();
            }
        });
    });

    describe('Button trigger - Open/close', () => {
        it('should open on Enter', async () => {
            renderWithState(t.buttonTemplate, { value: '' }, BUTTON_STATE);
            const button = getButtonTrigger();
            button.focus();

            await waitFor(() => {
                expect(button).toHaveAttribute('aria-expanded', 'false');
            });

            await userEvent.keyboard('{Enter}');
            await waitFor(() => {
                expect(button).toHaveAttribute('aria-expanded', 'true');
            });
            expect(button).toHaveAttribute('aria-activedescendant', '');
        });

        it('should open on Space', async () => {
            renderWithState(t.buttonTemplate, { value: '' }, BUTTON_STATE);
            const button = getButtonTrigger();
            button.focus();

            await waitFor(() => {
                expect(button).toHaveAttribute('aria-expanded', 'false');
            });

            await userEvent.keyboard(' ');
            await waitFor(() => {
                expect(button).toHaveAttribute('aria-expanded', 'true');
            });
        });

        it('should close on Escape without selecting', async () => {
            renderWithState(t.buttonTemplate, { value: '' }, BUTTON_STATE);
            const button = getButtonTrigger();
            button.focus();

            await userEvent.keyboard('{End}');
            await waitFor(() => {
                expect(button).toHaveAttribute('aria-expanded', 'true');
            });

            await userEvent.keyboard('{Escape}');
            await waitFor(() => {
                expect(button).toHaveAttribute('aria-expanded', 'false');
                expect(button).toHaveAttribute('aria-activedescendant', '');
            });

            expect(button.textContent).toBe('Select a fruit');
        });

        it('should toggle on click', async () => {
            renderWithState(t.buttonTemplate, { value: '' }, BUTTON_STATE);
            const button = getButtonTrigger();

            await userEvent.click(button);
            await waitFor(() => {
                expect(button).toHaveAttribute('aria-expanded', 'true');
            });

            await userEvent.click(button);
            await waitFor(() => {
                expect(button).toHaveAttribute('aria-expanded', 'false');
            });
        });
    });

    describe('Button trigger - Navigation', () => {
        it('should navigate with ArrowDown', async () => {
            renderWithState(t.buttonTemplate, { value: '' }, BUTTON_STATE);
            const button = getButtonTrigger();
            button.focus();

            await userEvent.keyboard('{ArrowDown}');
            const firstOption = getAllOptions()[0]!;
            await waitFor(() => {
                expect(button).toHaveAttribute('aria-expanded', 'true');
                expect(button).toHaveAttribute('aria-activedescendant', firstOption.id);
            });

            await userEvent.keyboard('{ArrowDown}');
            const options = getAllOptions();
            await waitFor(() => {
                expect(button).toHaveAttribute('aria-activedescendant', options[1].id);
            });
        });

        it('should not wrap on ArrowDown at last option', async () => {
            renderWithState(t.buttonTemplate, { value: '' }, BUTTON_STATE);
            const button = getButtonTrigger();
            button.focus();

            await userEvent.keyboard('{Enter}');
            await waitFor(() => {
                expect(button).toHaveAttribute('aria-expanded', 'true');
                expect(getAllOptions().length).toBeGreaterThan(0);
            });

            await userEvent.keyboard('{End}');
            const options = getAllOptions();
            const lastOption = options[options.length - 1];
            await waitFor(() => {
                expect(button).toHaveAttribute('aria-activedescendant', lastOption.id);
            });

            await userEvent.keyboard('{ArrowDown}');
            await waitFor(() => {
                expect(button).toHaveAttribute('aria-activedescendant', lastOption.id);
            });
        });

        it('should not wrap on ArrowUp at first option', async () => {
            renderWithState(t.buttonTemplate, { value: '' }, BUTTON_STATE);
            const button = getButtonTrigger();
            button.focus();

            await userEvent.keyboard('{Enter}');
            await waitFor(() => {
                expect(button).toHaveAttribute('aria-expanded', 'true');
                expect(getAllOptions().length).toBeGreaterThan(0);
            });

            await userEvent.keyboard('{ArrowDown}');
            const firstOption = getAllOptions()[0]!;
            await waitFor(() => {
                expect(button).toHaveAttribute('aria-activedescendant', firstOption.id);
            });

            await userEvent.keyboard('{ArrowUp}');
            await waitFor(() => {
                expect(button).toHaveAttribute('aria-activedescendant', firstOption.id);
            });
        });

        it('should navigate with Home and End', async () => {
            renderWithState(t.buttonTemplate, { value: '' }, BUTTON_STATE);
            const button = getButtonTrigger();
            button.focus();

            await userEvent.keyboard('{Enter}');
            await waitFor(() => {
                expect(button).toHaveAttribute('aria-expanded', 'true');
                expect(getAllOptions().length).toBeGreaterThan(0);
            });

            const options = getAllOptions();
            const first = options[0];
            const last = options[options.length - 1];

            await userEvent.keyboard('{End}');
            await waitFor(() => {
                expect(button).toHaveAttribute('aria-activedescendant', last.id);
            });

            await userEvent.keyboard('{Home}');
            await waitFor(() => {
                expect(button).toHaveAttribute('aria-activedescendant', first.id);
            });
        });

        it('should jump to last option on PageDown', async () => {
            renderWithState(t.buttonTemplate, { value: '' }, BUTTON_STATE);
            const button = getButtonTrigger();
            button.focus();

            await userEvent.keyboard('{Enter}');
            await waitFor(() => {
                expect(button).toHaveAttribute('aria-expanded', 'true');
                expect(getAllOptions().length).toBeGreaterThan(0);
            });

            const options = getAllOptions();
            await userEvent.keyboard('{Home}');
            await waitFor(() => {
                expect(button).toHaveAttribute('aria-activedescendant', options[0].id);
            });

            await userEvent.keyboard('{PageDown}');
            await waitFor(() => {
                expect(button).toHaveAttribute('aria-activedescendant', options[options.length - 1].id);
            });
        });

        it('should jump to first option on PageUp', async () => {
            renderWithState(t.buttonTemplate, { value: '' }, BUTTON_STATE);
            const button = getButtonTrigger();
            button.focus();

            await userEvent.keyboard('{Enter}');
            await waitFor(() => {
                expect(button).toHaveAttribute('aria-expanded', 'true');
                expect(getAllOptions().length).toBeGreaterThan(0);
            });

            const options = getAllOptions();
            await userEvent.keyboard('{End}');
            await waitFor(() => {
                expect(button).toHaveAttribute('aria-activedescendant', options[options.length - 1].id);
            });

            await userEvent.keyboard('{PageUp}');
            await waitFor(() => {
                expect(button).toHaveAttribute('aria-activedescendant', options[0].id);
            });
        });

        it('should toggle data-focus-visible-added on navigation', async () => {
            renderWithState(t.buttonTemplate, { value: '' }, BUTTON_STATE);
            const button = getButtonTrigger();
            button.focus();

            await userEvent.keyboard('{ArrowDown}');
            await userEvent.keyboard('{ArrowDown}');

            const activeOption = getActiveOption();
            expect(activeOption).not.toBeNull();
            expect(activeOption).toHaveAttribute('data-focus-visible-added', 'true');

            await userEvent.keyboard('{ArrowDown}');
            expect(activeOption).not.toHaveAttribute('data-focus-visible-added');

            const newActive = getActiveOption();
            expect(newActive).not.toBeNull();
            expect(newActive).toHaveAttribute('data-focus-visible-added', 'true');
        });
    });

    describe('Button trigger - Selection', () => {
        it('should select on Enter', async () => {
            const onSelect = vi.fn();
            renderWithState(t.buttonTemplate, { value: '', onSelect }, BUTTON_STATE);
            const button = getButtonTrigger();
            button.focus();

            await userEvent.keyboard('{ArrowDown}');
            await userEvent.keyboard('{ArrowDown}');
            await userEvent.keyboard('{ArrowDown}');

            const options = getAllOptions();
            await waitFor(() => {
                expect(button).toHaveAttribute('aria-activedescendant', options[2].id);
            });

            await userEvent.keyboard('{Enter}');
            await waitFor(() => {
                expect(button).toHaveAttribute('aria-expanded', 'false');
                expect(button.textContent).toBe('Banana');
            });

            expect(onSelect).toHaveBeenCalled();
        });

        it('should select on Space', async () => {
            renderWithState(t.buttonTemplate, { value: '' }, BUTTON_STATE);
            const button = getButtonTrigger();
            button.focus();

            await userEvent.keyboard('{Enter}');
            await waitFor(() => {
                expect(button).toHaveAttribute('aria-expanded', 'true');
                expect(getAllOptions().length).toBeGreaterThan(0);
            });

            const options = getAllOptions();
            const last = options[options.length - 1];
            await userEvent.keyboard('{End}');
            await waitFor(() => {
                expect(button).toHaveAttribute('aria-activedescendant', last.id);
            });

            await userEvent.keyboard(' ');
            await waitFor(() => {
                expect(button).toHaveAttribute('aria-expanded', 'false');
                expect(button.textContent).toBe(last.textContent);
            });
        });

        it('should select on Tab', async () => {
            renderWithState(t.buttonTemplate, { value: '' }, BUTTON_STATE);
            const button = getButtonTrigger();
            button.focus();

            await userEvent.keyboard('{ArrowDown}');
            for (let i = 0; i < 4; i++) {
                await userEvent.keyboard('{ArrowDown}');
            }

            const options = getAllOptions();
            await waitFor(() => {
                expect(button).toHaveAttribute('aria-activedescendant', options[4].id);
            });

            await userEvent.tab();
            await waitFor(() => {
                expect(button.textContent).toBe('Cherry');
            });
        });

        it('should select option on click', async () => {
            const onSelect = vi.fn();
            renderWithState(t.buttonTemplate, { value: '', onSelect }, BUTTON_STATE);
            const button = getButtonTrigger();

            await userEvent.click(button);
            await waitFor(() => {
                expect(button).toHaveAttribute('aria-expanded', 'true');
            });

            const options = getAllOptions();
            const grape = options.find((o) => o.textContent === 'Grape')!;
            await userEvent.click(grape);
            await waitFor(() => {
                expect(button).toHaveAttribute('aria-expanded', 'false');
                expect(button.textContent).toBe('Grape');
            });

            expect(onSelect).toHaveBeenCalled();
        });

        it('should select on Alt+ArrowUp', async () => {
            renderWithState(t.buttonTemplate, { value: '' }, BUTTON_STATE);
            const button = getButtonTrigger();
            button.focus();

            await userEvent.keyboard('{ArrowDown}');
            await userEvent.keyboard('o');

            const options = getAllOptions();
            const orange = options.find((o) => o.textContent === 'Orange')!;
            await waitFor(() => {
                expect(button).toHaveAttribute('aria-activedescendant', orange.id);
            });

            await userEvent.keyboard('{Alt>}{ArrowUp}{/Alt}');
            await waitFor(() => {
                expect(button).toHaveAttribute('aria-expanded', 'false');
                expect(button.textContent).toBe('Orange');
            });
        });
    });

    describe('Button trigger - Typeahead', () => {
        it('should navigate to matching option on single char', async () => {
            renderWithState(t.buttonTemplate, { value: '' }, BUTTON_STATE);
            const button = getButtonTrigger();
            button.focus();

            await userEvent.keyboard('{Enter}');
            await waitFor(() => {
                expect(button).toHaveAttribute('aria-expanded', 'true');
                expect(getAllOptions().length).toBeGreaterThan(0);
            });

            const options = getAllOptions();
            const banana = options.find((o) => o.textContent === 'Banana')!;
            await userEvent.keyboard('b');
            await waitFor(() => {
                expect(button).toHaveAttribute('aria-activedescendant', banana.id);
            });
        });

        it('should navigate to matching option on multi char', async () => {
            renderWithState(t.buttonTemplate, { value: '' }, BUTTON_STATE);
            const button = getButtonTrigger();
            button.focus();

            await userEvent.keyboard('bl');
            const options = getAllOptions();
            const blueberry = options.find((o) => o.textContent === 'Blueberry')!;
            await waitFor(() => {
                expect(button).toHaveAttribute('aria-activedescendant', blueberry.id);
            });
        });

        it('should cycle through matches on repeated single char', async () => {
            renderWithState(t.buttonTemplate, { value: '' }, BUTTON_STATE);
            const button = getButtonTrigger();
            button.focus();

            await userEvent.keyboard('{Enter}');
            await waitFor(() => {
                expect(button).toHaveAttribute('aria-expanded', 'true');
                expect(getAllOptions().length).toBeGreaterThan(0);
            });

            const options = getAllOptions();
            const apple = options.find((o) => o.textContent === 'Apple')!;
            const apricot = options.find((o) => o.textContent === 'Apricot')!;

            await userEvent.keyboard('a');
            await waitFor(() => {
                expect(button).toHaveAttribute('aria-activedescendant', apple.id);
            });

            await userEvent.keyboard('a');
            await waitFor(() => {
                expect(button).toHaveAttribute('aria-activedescendant', apricot.id);
            });
        });
    });

    describe('Button trigger - Label display', () => {
        it('should display selected value', async () => {
            renderWithState(t.buttonTemplate, { value: 'Apple' }, BUTTON_STATE);
            const button = getButtonTrigger();

            expect(button.textContent).toBe('Apple');

            await userEvent.click(button);
            await waitFor(() => {
                expect(button).toHaveAttribute('aria-expanded', 'true');
            });

            const options = getAllOptions();
            const banana = options.find((o) => o.textContent === 'Banana')!;
            await userEvent.click(banana);

            await waitFor(() => {
                expect(button.textContent).toBe('Banana');
            });
        });

        it('should always show label when labelDisplayMode="show-label"', async () => {
            renderWithState(t.showLabelButtonTemplate, { value: 'Apple' }, BUTTON_STATE);
            const button = getButtonTrigger();

            expect(button.textContent).toBe('Select a fruit');

            await userEvent.click(button);
            await waitFor(() => {
                expect(button).toHaveAttribute('aria-expanded', 'true');
            });

            const options = getAllOptions();
            const banana = options.find((o) => o.textContent === 'Banana')!;
            await userEvent.click(banana);

            await waitFor(() => {
                expect(button).toHaveAttribute('aria-expanded', 'false');
            });
            expect(button.textContent).toBe('Select a fruit');
        });

        it('should show empty text when labelDisplayMode="show-tooltip"', () => {
            renderWithState(t.showTooltipButtonTemplate, { value: 'Apple' }, BUTTON_STATE);
            const button = getButtonTrigger();

            expect(button.textContent).toBe('');
            expect(button).toHaveAttribute('role', 'combobox');
            expect(button).toHaveAttribute('aria-haspopup', 'listbox');
        });
    });

    // ───────────────────────────────────────────────────────────────
    // Edge Cases & Regression Guards
    // ───────────────────────────────────────────────────────────────

    describe('Edge cases', () => {
        it('should fall back to textContent when option has no value prop', async () => {
            renderWithState(t.noValueButtonTemplate, { value: '' }, BUTTON_STATE);
            const button = getButtonTrigger();

            await userEvent.click(button);
            await waitFor(() => {
                expect(button).toHaveAttribute('aria-expanded', 'true');
            });

            const grape = getAllOptions().find((o) => o.textContent === 'Grape')!;
            expect(grape).not.toHaveAttribute('data-value');
            await userEvent.click(grape);

            await waitFor(() => {
                expect(button.textContent).toBe('Grape');
            });
        });

        it('should jump to selected option on ArrowDown', async () => {
            renderWithState(t.selectedButtonTemplate, { value: 'Cherry' }, BUTTON_STATE);
            const button = getButtonTrigger();
            button.focus();

            await userEvent.keyboard('{ArrowDown}');
            await waitFor(() => {
                expect(button).toHaveAttribute('aria-expanded', 'true');
            });

            const cherry = getAllOptions().find((o) => o.textContent === 'Cherry')!;
            await waitFor(() => {
                expect(button).toHaveAttribute('aria-activedescendant', cherry.id);
            });
        });

        it('should not change open state on blur then re-focus', async () => {
            renderWithState(t.inputTemplate);
            const input = getInput();

            await userEvent.click(input);
            await waitFor(() => {
                expect(input).toHaveAttribute('aria-expanded', 'true');
            });

            fireEvent.blur(input);
            fireEvent.focus(input);
            expect(input).toHaveAttribute('aria-expanded', 'true');
        });
    });

    // ───────────────────────────────────────────────────────────────
    // Disabled Options
    // ───────────────────────────────────────────────────────────────

    describe('Disabled options', () => {
        it('should navigate to disabled option but not select it (input trigger)', async () => {
            renderWithState(t.disabledInputTemplate);
            const input = getInput();
            await userEvent.click(input);
            await waitFor(() => {
                expect(input).toHaveAttribute('aria-expanded', 'true');
            });

            await userEvent.keyboard('{ArrowDown}');
            await waitFor(() => {
                expect(getActiveOption()!.textContent).toBe('Apple');
            });

            await userEvent.keyboard('{ArrowDown}');
            await waitFor(() => {
                const active = getActiveOption();
                expect(active).not.toBeNull();
                expect(active!.textContent).toBe('Banana');
                expect(active!).toHaveAttribute('aria-disabled', 'true');
                expect(input).toHaveAttribute('aria-activedescendant', active!.id);
            });

            await userEvent.keyboard('{Enter}');
            expect(input.value).toBe('');
            await waitFor(() => {
                expect(input).toHaveAttribute('aria-expanded', 'false');
            });

            await userEvent.click(input);
            await waitFor(() => {
                expect(input).toHaveAttribute('aria-expanded', 'true');
            });

            const bananaOption = getVisibleOptions().find((o) => o.textContent === 'Banana')!;
            await userEvent.click(bananaOption);

            expect(input.value).toBe('');
            expect(input).toHaveAttribute('aria-expanded', 'true');

            const cherryOption = getVisibleOptions().find((o) => o.textContent === 'Cherry')!;
            await userEvent.click(cherryOption);
            await waitFor(() => {
                expect(input.value).toBe('Cherry');
                expect(input).toHaveAttribute('aria-expanded', 'false');
            });
        });

        it('should navigate to disabled option but not select it (button trigger)', async () => {
            renderWithState(t.disabledButtonTemplate, { value: '' }, BUTTON_STATE);
            const button = getButtonTrigger();
            button.focus();

            await userEvent.keyboard('{ArrowDown}');
            await waitFor(() => {
                expect(button).toHaveAttribute('aria-expanded', 'true');
                expect(getActiveOption()!.textContent).toBe('Apple');
            });

            await userEvent.keyboard('{ArrowDown}');
            await waitFor(() => {
                const active = getActiveOption();
                expect(active).not.toBeNull();
                expect(active!.textContent).toBe('Banana');
                expect(active!).toHaveAttribute('aria-disabled', 'true');
            });

            await userEvent.keyboard('{Enter}');
            expect(button.textContent).toBe('Select a fruit');
            await waitFor(() => {
                expect(button).toHaveAttribute('aria-expanded', 'false');
            });

            await userEvent.click(button);
            await waitFor(() => {
                expect(button).toHaveAttribute('aria-expanded', 'true');
            });

            const bananaOption = getAllOptions().find((o) => o.textContent === 'Banana')!;
            await userEvent.click(bananaOption);

            expect(button.textContent).toBe('Select a fruit');
            expect(button).toHaveAttribute('aria-expanded', 'true');

            const cherryOption = getAllOptions().find((o) => o.textContent === 'Cherry')!;
            await userEvent.click(cherryOption);
            await waitFor(() => {
                expect(button.textContent).toBe('Cherry');
                expect(button).toHaveAttribute('aria-expanded', 'false');
            });
        });
    });

    // ───────────────────────────────────────────────────────────────
    // Grid Combobox Tests
    // ───────────────────────────────────────────────────────────────

    describe('Grid combobox - ARIA attributes', () => {
        it('should have correct grid ARIA attributes (input trigger)', async () => {
            renderWithState(t.gridInputTemplate);
            const input = getInput();
            await userEvent.click(input);

            await waitFor(() => {
                expect(input).toHaveAttribute('aria-expanded', 'true');
            });

            expect(input).toHaveAttribute('aria-haspopup', 'grid');

            const controlsId = input.getAttribute('aria-controls')!;
            const grid = document.getElementById(controlsId)!;
            expect(grid).toHaveAttribute('role', 'grid');
            expect(grid.classList.contains(COMBOBOX_LIST_CLASSNAME)).toBe(true);

            const rows = Array.from(grid.querySelectorAll('[role="row"]'));
            expect(rows.length).toBe(GRID_FRUITS.length);

            for (const row of rows) {
                const cells = row.querySelectorAll('[role="gridcell"]');
                expect(cells.length).toBe(3);

                const firstCell = cells[0] as HTMLElement;
                expect(firstCell).toHaveAttribute('data-value');
                expect(firstCell).toHaveAttribute('aria-selected');
                // First cell (option trigger) should have the option trigger class
                expect(firstCell.classList.contains(`${COMBOBOX_OPTION_CLASSNAME}__action`)).toBe(true);

                for (const cell of Array.from(cells)) {
                    expect((cell as HTMLElement).id).toBeTruthy();
                }

                // Row should have the combobox option class
                expect(row.classList.contains(COMBOBOX_OPTION_CLASSNAME)).toBe(true);
            }
        });

        it('should have correct grid ARIA attributes (button trigger)', async () => {
            renderWithState(t.gridButtonTemplate, { value: '' }, BUTTON_STATE);
            const button = getButtonTrigger();
            await userEvent.click(button);

            await waitFor(() => {
                expect(button).toHaveAttribute('aria-expanded', 'true');
            });

            expect(button).toHaveAttribute('aria-haspopup', 'grid');

            const grid = document.body.querySelector('[role="grid"]')!;
            expect(grid).not.toBeNull();

            const rows = Array.from(grid.querySelectorAll('[role="row"]'));
            expect(rows.length).toBe(GRID_FRUITS.length);
            for (const row of rows) {
                const cells = row.querySelectorAll('[role="gridcell"]');
                expect(cells.length).toBe(2);
            }
        });
    });

    describe('Grid combobox - Input trigger keyboard', () => {
        it('should navigate rows with ArrowDown/Up', async () => {
            renderWithState(t.gridInputTemplate);
            const input = getInput();
            await userEvent.click(input);

            await waitFor(() => {
                expect(input).toHaveAttribute('aria-expanded', 'true');
            });

            await userEvent.keyboard('{ArrowDown}');
            await waitFor(() => {
                const active = getActiveCell();
                expect(active).not.toBeNull();
                expect(active!.textContent).toBe('Apple');
            });

            await userEvent.keyboard('{ArrowDown}');
            expect(getActiveCell()!.textContent).toBe('Banana');

            await userEvent.keyboard('{ArrowDown}');
            expect(getActiveCell()!.textContent).toBe('Cherry');

            await userEvent.keyboard('{ArrowDown}');
            expect(getActiveCell()!.textContent).toBe('Apple');

            await userEvent.keyboard('{ArrowUp}');
            expect(getActiveCell()!.textContent).toBe('Cherry');

            await userEvent.keyboard('{ArrowUp}');
            expect(getActiveCell()!.textContent).toBe('Banana');

            expect(document.activeElement).toBe(input);
        });

        it('should navigate cells with ArrowLeft/Right', async () => {
            renderWithState(t.gridInputTemplate);
            const input = getInput();
            await userEvent.click(input);

            await waitFor(() => {
                expect(input).toHaveAttribute('aria-expanded', 'true');
            });

            await userEvent.keyboard('{ArrowDown}');
            await waitFor(() => {
                expect(getActiveCell()!.textContent).toBe('Apple');
            });

            await userEvent.keyboard('{ArrowRight}');
            let active = getActiveCell()!;
            expect(active).toHaveAttribute('role', 'gridcell');
            expect(active.textContent).not.toBe('Apple');

            await userEvent.keyboard('{ArrowRight}');

            await userEvent.keyboard('{ArrowRight}');
            expect(getActiveCell()!.textContent).toBe('Banana');

            await userEvent.keyboard('{ArrowLeft}');
            active = getActiveCell()!;
            const row = active.closest('[role="row"]')!;
            const firstCell = row.querySelector('[role="gridcell"]') as HTMLElement;
            expect(firstCell.textContent).toBe('Apple');

            expect(document.activeElement).toBe(input);
        });

        it('should select option on Enter', async () => {
            const onSelect = vi.fn();
            renderWithState(t.gridInputTemplate, { value: '', onSelect });
            const input = getInput();
            await userEvent.click(input);

            await waitFor(() => {
                expect(input).toHaveAttribute('aria-expanded', 'true');
            });

            await userEvent.keyboard('{ArrowDown}');
            await userEvent.keyboard('{ArrowDown}');
            await waitFor(() => {
                expect(getActiveCell()!.textContent).toBe('Banana');
            });

            await userEvent.keyboard('{Enter}');
            await waitFor(() => {
                expect(input.value).toBe('Banana');
                expect(input).toHaveAttribute('aria-expanded', 'false');
            });

            expect(onSelect).toHaveBeenCalled();
        });

        it('should fire action on Enter on action cell', async () => {
            const onEdit = vi.fn();
            const onDelete = vi.fn();
            renderWithState(t.gridInputTemplate, { value: '', onEdit, onDelete });
            const input = getInput();
            await userEvent.click(input);

            await waitFor(() => {
                expect(input).toHaveAttribute('aria-expanded', 'true');
            });

            await userEvent.keyboard('{ArrowDown}');
            await waitFor(() => {
                expect(getActiveCell()!.textContent).toBe('Apple');
            });

            await userEvent.keyboard('{ArrowRight}');
            await userEvent.keyboard('{ArrowRight}');

            const active = getActiveCell()!;
            const row = active.closest('[role="row"]')!;
            const firstCell = row.querySelector('[role="gridcell"]');
            expect(active).not.toBe(firstCell);

            await userEvent.keyboard('{Enter}');

            expect(input.value).toBe('');

            await waitFor(() => {
                expect(input).toHaveAttribute('aria-expanded', 'false');
            });

            expect(onDelete).toHaveBeenCalled();
        });

        it('should remember column position across rows', async () => {
            renderWithState(t.gridInputTemplate);
            const input = getInput();
            await userEvent.click(input);

            await waitFor(() => {
                expect(input).toHaveAttribute('aria-expanded', 'true');
            });

            await userEvent.keyboard('{ArrowDown}');
            await waitFor(() => {
                expect(getActiveCell()!.textContent).toBe('Apple');
            });

            await userEvent.keyboard('{ArrowRight}');
            const editCellApple = getActiveCell()!;
            const appleRow = editCellApple.closest('[role="row"]')!;
            const appleCells = Array.from(appleRow.querySelectorAll('[role="gridcell"]'));
            expect(appleCells.indexOf(editCellApple)).toBe(1);

            await userEvent.keyboard('{ArrowDown}');
            const editCellBanana = getActiveCell()!;
            const bananaRow = editCellBanana.closest('[role="row"]')!;
            const bananaCells = Array.from(bananaRow.querySelectorAll('[role="gridcell"]'));
            expect(bananaCells.indexOf(editCellBanana)).toBe(1);
            const bananaFirstCell = bananaCells[0] as HTMLElement;
            expect(bananaFirstCell.textContent).toBe('Banana');

            await userEvent.keyboard('{ArrowDown}');
            const editCellCherry = getActiveCell()!;
            const cherryRow = editCellCherry.closest('[role="row"]')!;
            const cherryCells = Array.from(cherryRow.querySelectorAll('[role="gridcell"]'));
            expect(cherryCells.indexOf(editCellCherry)).toBe(1);
            const cherryFirstCell = cherryCells[0] as HTMLElement;
            expect(cherryFirstCell.textContent).toBe('Cherry');
        });

        it('should filter grid options by typing', async () => {
            renderWithState(t.gridInputTemplate);
            const input = getInput();
            await userEvent.click(input);

            await waitFor(() => {
                expect(input).toHaveAttribute('aria-expanded', 'true');
            });

            await waitFor(() => {
                expect(getVisibleGridOptions().length).toBe(3);
            });

            await userEvent.type(input, 'b');
            await waitFor(() => {
                expect(getVisibleGridOptions().length).toBe(1);
                expect(getVisibleGridOptions()[0].textContent).toBe('Banana');
            });

            await userEvent.keyboard('{ArrowDown}');
            await waitFor(() => {
                expect(getActiveCell()!.textContent).toBe('Banana');
            });

            await userEvent.keyboard('{Enter}');
            await waitFor(() => {
                expect(input.value).toBe('Banana');
            });
        });
    });

    describe('Grid combobox - Input trigger mouse', () => {
        it('should select grid option on click', async () => {
            const onSelect = vi.fn();
            renderWithState(t.gridInputTemplate, { value: '', onSelect });
            const input = getInput();
            await userEvent.click(input);

            await waitFor(() => {
                expect(input).toHaveAttribute('aria-expanded', 'true');
            });

            const options = getVisibleGridOptions();
            const cherry = options.find((o) => o.textContent === 'Cherry')!;
            await userEvent.click(cherry);

            expect(input.value).toBe('Cherry');
            expect(onSelect).toHaveBeenCalled();
        });

        it('should fire action on grid action cell click', async () => {
            const onEdit = vi.fn();
            const onDelete = vi.fn();
            renderWithState(t.gridInputTemplate, { value: '', onEdit, onDelete });
            const input = getInput();
            await userEvent.click(input);

            await waitFor(() => {
                expect(input).toHaveAttribute('aria-expanded', 'true');
            });

            const grid = document.body.querySelector('[role="grid"]')!;
            const rows = Array.from(grid.querySelectorAll('[role="row"]'));
            const appleRow = rows[0];
            const cells = Array.from(appleRow.querySelectorAll('[role="gridcell"]'));
            const deleteCell = cells[cells.length - 1] as HTMLElement;

            await userEvent.click(deleteCell);

            expect(input.value).toBe('');
            expect(input).toHaveAttribute('aria-expanded', 'true');
            expect(onDelete).toHaveBeenCalled();
        });
    });

    describe('Grid combobox - Button trigger keyboard', () => {
        it('should navigate rows with ArrowDown/Up', async () => {
            renderWithState(t.gridButtonTemplate, { value: '' }, BUTTON_STATE);
            const button = getButtonTrigger();
            button.focus();

            await userEvent.keyboard('{ArrowDown}');
            await waitFor(() => {
                expect(button).toHaveAttribute('aria-expanded', 'true');
                expect(getActiveCell()!.textContent).toBe('Apple');
            });

            await userEvent.keyboard('{ArrowDown}');
            expect(getActiveCell()!.textContent).toBe('Banana');

            await userEvent.keyboard('{ArrowDown}');
            expect(getActiveCell()!.textContent).toBe('Cherry');

            await userEvent.keyboard('{ArrowDown}');
            expect(getActiveCell()!.textContent).toBe('Apple');

            await userEvent.keyboard('{ArrowUp}');
            expect(getActiveCell()!.textContent).toBe('Cherry');

            expect(document.activeElement).toBe(button);
        });

        it('should navigate cells with ArrowLeft/Right', async () => {
            renderWithState(t.gridButtonTemplate, { value: '' }, BUTTON_STATE);
            const button = getButtonTrigger();
            button.focus();

            await userEvent.keyboard('{ArrowDown}');
            await waitFor(() => {
                expect(button).toHaveAttribute('aria-expanded', 'true');
                expect(getActiveCell()!.textContent).toBe('Apple');
            });

            await userEvent.keyboard('{ArrowRight}');
            const active = getActiveCell()!;
            const row = active.closest('[role="row"]')!;
            const firstCell = row.querySelector('[role="gridcell"]') as HTMLElement;
            expect(active).not.toBe(firstCell);

            await userEvent.keyboard('{ArrowRight}');
            expect(getActiveCell()!.textContent).toBe('Banana');

            await userEvent.keyboard('{ArrowLeft}');
            const backActive = getActiveCell()!;
            const backRow = backActive.closest('[role="row"]')!;
            const backFirstCell = backRow.querySelector('[role="gridcell"]') as HTMLElement;
            expect(backFirstCell.textContent).toBe('Apple');
        });

        it('should select option on Enter', async () => {
            const onSelect = vi.fn();
            renderWithState(t.gridButtonTemplate, { value: '', onSelect }, BUTTON_STATE);
            const button = getButtonTrigger();
            button.focus();

            await userEvent.keyboard('{ArrowDown}');
            await userEvent.keyboard('{ArrowDown}');
            await userEvent.keyboard('{ArrowDown}');
            await waitFor(() => {
                expect(getActiveCell()!.textContent).toBe('Cherry');
            });

            await userEvent.keyboard('{Enter}');
            await waitFor(() => {
                expect(button).toHaveAttribute('aria-expanded', 'false');
                expect(button.textContent).toBe('Cherry');
            });

            expect(onSelect).toHaveBeenCalled();
        });

        it('should fire action on Space on action cell', async () => {
            const onDelete = vi.fn();
            renderWithState(t.gridButtonTemplate, { value: '', onDelete }, BUTTON_STATE);
            const button = getButtonTrigger();
            button.focus();

            await userEvent.keyboard('{ArrowDown}');
            await waitFor(() => {
                expect(getActiveCell()!.textContent).toBe('Apple');
            });

            await userEvent.keyboard('{ArrowRight}');
            const active = getActiveCell()!;
            const row = active.closest('[role="row"]')!;
            const firstCell = row.querySelector('[role="gridcell"]') as HTMLElement;
            expect(active).not.toBe(firstCell);

            await userEvent.keyboard(' ');

            expect(button.textContent).not.toBe('Apple');
            expect(onDelete).toHaveBeenCalled();
        });
    });

    // ───────────────────────────────────────────────────────────────
    // Combobox.State (Empty & Error States)
    // ───────────────────────────────────────────────────────────────

    describe('Combobox.State - Live region', () => {
        it('should always render a live region element', () => {
            renderWithState(t.emptyStateTemplate);
            const stateEl = getStateContainer();
            expect(stateEl).toBeInTheDocument();
            expect(stateEl).toHaveAttribute('role', 'status');
            expect(stateEl).toHaveAttribute('aria-live', 'polite');
            expect(stateEl).toHaveAttribute('aria-atomic', 'true');
        });
    });

    describe('Combobox.State - Empty state', () => {
        it('should be visually hidden when list has options', async () => {
            renderWithState(t.emptyStateTemplate);
            const input = getInput();
            await userEvent.click(input);

            await waitFor(() => {
                expect(input).toHaveAttribute('aria-expanded', 'true');
            });

            // Options are visible — state container should be visually hidden
            const stateEl = getStateContainer();
            expect(stateEl).toBeInTheDocument();
            expect(stateEl!.className).toContain(VISUALLY_HIDDEN);
        });

        it('should show empty message when all options are filtered out', async () => {
            renderWithState(t.emptyStateTemplate);
            const input = getInput();
            await userEvent.click(input);

            await waitFor(() => {
                expect(input).toHaveAttribute('aria-expanded', 'true');
            });

            // Type a single character that matches no fruit
            await userEvent.type(input, 'z');

            await waitFor(() => {
                expect(getVisibleOptions().length).toBe(0);
            });

            await waitFor(() => {
                const stateEl = getStateContainer();
                expect(stateEl).toBeInTheDocument();
                expect(stateEl!.className).not.toContain(VISUALLY_HIDDEN);
                expect(stateEl).toHaveTextContent('No results for "z"');
            });
        });

        it('should hide empty message when options reappear', async () => {
            renderWithState(t.emptyStateTemplate);
            const input = getInput();
            await userEvent.click(input);

            await waitFor(() => {
                expect(input).toHaveAttribute('aria-expanded', 'true');
            });

            // Filter to empty
            await userEvent.type(input, 'z');
            await waitFor(() => {
                expect(getVisibleOptions().length).toBe(0);
                expect(getStateContainer()!.className).not.toContain(VISUALLY_HIDDEN);
            });

            // Clear input — options reappear
            await userEvent.clear(input);
            await waitFor(() => {
                expect(getVisibleOptions().length).toBeGreaterThan(0);
                expect(getStateContainer()!.className).toContain(VISUALLY_HIDDEN);
            });
        });

        it('should pass input value to emptyMessage callback', async () => {
            renderWithState(t.emptyStateTemplate);
            const input = getInput();
            await userEvent.click(input);

            await waitFor(() => {
                expect(input).toHaveAttribute('aria-expanded', 'true');
            });

            await userEvent.type(input, 'z');
            await waitFor(() => {
                expect(getVisibleOptions().length).toBe(0);
            });

            await waitFor(() => {
                expect(getStateContainer()).toHaveTextContent('No results for "z"');
            });
        });

        it('should update input value in emptyMessage when typing while empty', async () => {
            renderWithState(t.emptyStateTemplate);
            const input = getInput();
            await userEvent.click(input);

            await waitFor(() => {
                expect(input).toHaveAttribute('aria-expanded', 'true');
            });

            // Type "z" — list becomes empty
            await userEvent.type(input, 'z');
            await waitFor(() => {
                expect(getStateContainer()).toHaveTextContent('No results for "z"');
            });

            // Keep typing "zz" — list stays empty, message should update
            await userEvent.type(input, 'z');
            await waitFor(() => {
                expect(getStateContainer()).toHaveTextContent('No results for "zz"');
            });
        });
    });

    describe('Combobox.State - Error state', () => {
        it('should show error message', async () => {
            renderWithState(t.errorStateTemplate);
            const input = getInput();
            await userEvent.click(input);

            await waitFor(() => {
                expect(input).toHaveAttribute('aria-expanded', 'true');
            });

            // Content is deferred after open to allow the aria-live region
            // to become visible in the accessibility tree first.
            await waitFor(() => {
                const stateEl = getStateContainer();
                expect(stateEl).toBeInTheDocument();
                expect(stateEl!.className).not.toContain(VISUALLY_HIDDEN);
                expect(stateEl).toHaveTextContent('Service unavailable');
            });
        });

        it('should show secondary error message', async () => {
            renderWithState(t.errorStateTemplate);
            const input = getInput();
            await userEvent.click(input);

            await waitFor(() => {
                expect(input).toHaveAttribute('aria-expanded', 'true');
            });

            await waitFor(() => {
                expect(getStateContainer()).toHaveTextContent('Please try again later');
            });
        });

        it('should have role=status on the state container', () => {
            renderWithState(t.errorStateTemplate);
            expect(getStateContainer()).toHaveAttribute('role', 'status');
            expect(getStateContainer()).toHaveAttribute('aria-live', 'polite');
        });
    });

    // ───────────────────────────────────────────────────────────────
    // Combobox.OptionSkeleton & Loading State
    // ───────────────────────────────────────────────────────────────

    describe('Combobox.OptionSkeleton - Rendering', () => {
        it('should render skeleton items with role="none"', () => {
            renderWithState(t.loadingTemplate);
            const skeletons = document.body.querySelectorAll(`.${COMBOBOX_OPTION_SKELETON_CLASSNAME}`);
            expect(skeletons.length).toBe(3);

            for (const skeleton of Array.from(skeletons)) {
                expect(skeleton).toHaveAttribute('role', 'none');
            }
        });

        it('should not render any role="option" elements', () => {
            renderWithState(t.loadingTemplate);
            const options = getAllOptions();
            expect(options.length).toBe(0);
        });

        it('should set aria-busy on the listbox when skeletons are mounted', async () => {
            renderWithState(t.loadingTemplate);
            await waitFor(() => {
                const listbox = document.body.querySelector('[role="listbox"]');
                expect(listbox).toHaveAttribute('aria-busy', 'true');
            });
        });
    });

    describe('Combobox.OptionSkeleton - Load more pattern', () => {
        it('should render skeletons appended after real options', () => {
            renderWithState(t.loadMoreTemplate);
            const options = getAllOptions();
            const skeletons = document.body.querySelectorAll(`.${COMBOBOX_OPTION_SKELETON_CLASSNAME}`);

            expect(options.length).toBe(FRUITS.length);
            expect(skeletons.length).toBe(3);
        });

        it('should set aria-busy on the listbox when skeletons are appended', async () => {
            renderWithState(t.loadMoreTemplate);
            await waitFor(() => {
                const listbox = document.body.querySelector('[role="listbox"]');
                expect(listbox).toHaveAttribute('aria-busy', 'true');
            });
        });
    });

    describe('Combobox.OptionSkeleton - Section loading', () => {
        it('should render skeletons inside a section', () => {
            renderWithState(t.sectionLoadingTemplate);
            const skeletons = document.body.querySelectorAll(`.${COMBOBOX_OPTION_SKELETON_CLASSNAME}`);
            expect(skeletons.length).toBe(3);

            // Real options should still be present in the other section
            const options = getAllOptions();
            expect(options.length).toBe(3);
        });

        it('should aria-hide a skeleton-only section', async () => {
            renderWithState(t.sectionLoadingTemplate);

            await waitFor(() => {
                // Re-query to get fresh elements after state updates
                const secs = document.body.querySelectorAll(`.${COMBOBOX_SECTION_CLASSNAME}`);
                expect(secs.length).toBeGreaterThanOrEqual(1);

                // The section with real options should NOT be aria-hidden
                const optionSection = Array.from(secs).find((s) => s.querySelector('[role="option"]'));
                if (optionSection) {
                    expect(optionSection).not.toHaveAttribute('aria-hidden');
                }

                // The skeleton-only section should be aria-hidden
                const skeletonSection = Array.from(secs).find(
                    (s) =>
                        s.querySelector(`.${COMBOBOX_OPTION_SKELETON_CLASSNAME}`) &&
                        !s.querySelector('[role="option"]'),
                );
                expect(skeletonSection).toBeTruthy();
                expect(skeletonSection).toHaveAttribute('aria-hidden', 'true');
            });
        });
    });

    describe('Combobox.State - Loading state', () => {
        it('should suppress empty message while skeletons are mounted', () => {
            renderWithState(t.loadingTemplate);
            const stateEl = getStateContainer();
            expect(stateEl).toBeInTheDocument();
            // Should not show "No results" since we have skeletons (loading)
            expect(stateEl).not.toHaveTextContent('No results');
        });

        it('should announce loading after debounce via handle events (only when open)', () => {
            // Test the handle's debounce behavior directly (framework-agnostic)
            vi.useFakeTimers();
            try {
                const callbacks = { onSelect: vi.fn() };
                const handle = setupCombobox(callbacks);

                const loadingChanges: boolean[] = [];
                const announcements: boolean[] = [];
                handle.subscribe('loadingChange', (v) => loadingChanges.push(v));
                handle.subscribe('loadingAnnouncement', (v) => announcements.push(v));

                // Register 3 skeletons while closed
                const cleanup1 = handle.registerSkeleton();
                const cleanup2 = handle.registerSkeleton();
                const cleanup3 = handle.registerSkeleton();

                // loadingChange fires immediately
                expect(loadingChanges).toEqual([true]);
                // No announcement while closed
                expect(announcements).toEqual([]);

                // After 500ms — still no announcement because combobox is closed
                vi.advanceTimersByTime(500);
                expect(announcements).toEqual([]);

                // Open the combobox — timer starts now
                handle.setIsOpen(true);

                // After 499ms — still no announcement
                vi.advanceTimersByTime(499);
                expect(announcements).toEqual([]);

                // After 500ms — announcement fires
                vi.advanceTimersByTime(1);
                expect(announcements).toEqual([true]);

                // Unregister all — loading ends
                cleanup1();
                cleanup2();
                cleanup3();
                expect(loadingChanges).toEqual([true, false]);
                expect(announcements).toEqual([true, false]);

                handle.destroy();
            } finally {
                vi.useRealTimers();
            }
        });

        it('should retrigger loading announcement when reopening', () => {
            vi.useFakeTimers();
            try {
                const callbacks = { onSelect: vi.fn() };
                const handle = setupCombobox(callbacks);

                const announcements: boolean[] = [];
                handle.subscribe('loadingAnnouncement', (v) => announcements.push(v));

                // Register skeletons and open
                const cleanup1 = handle.registerSkeleton();
                handle.setIsOpen(true);

                // Wait for announcement
                vi.advanceTimersByTime(500);
                expect(announcements).toEqual([true]);

                // Close the combobox — announcement resets
                handle.setIsOpen(false);
                expect(announcements).toEqual([true, false]);

                // Reopen while still loading — announcement retriggers after delay
                handle.setIsOpen(true);
                expect(announcements).toEqual([true, false]);

                vi.advanceTimersByTime(500);
                expect(announcements).toEqual([true, false, true]);

                // Cleanup
                cleanup1();
                expect(announcements).toEqual([true, false, true, false]);

                handle.destroy();
            } finally {
                vi.useRealTimers();
            }
        });

        it('should not announce loading if skeletons register and unregister while closed', () => {
            vi.useFakeTimers();
            try {
                const callbacks = { onSelect: vi.fn() };
                const handle = setupCombobox(callbacks);

                const announcements: boolean[] = [];
                handle.subscribe('loadingAnnouncement', (v) => announcements.push(v));

                // Register and unregister skeletons while closed
                const cleanup = handle.registerSkeleton();
                vi.advanceTimersByTime(500);
                cleanup();

                // No announcements should have fired
                expect(announcements).toEqual([]);

                handle.destroy();
            } finally {
                vi.useRealTimers();
            }
        });
    });
}
