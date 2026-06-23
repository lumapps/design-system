/* eslint-disable no-await-in-loop */
import userEvent from '@testing-library/user-event';
import { fireEvent, screen, waitFor, within } from '@testing-library/dom';
import { mdiDelete, mdiPencil } from '@lumx/icons';
import { queryByClassName, queryAllByClassName } from '../../../testing/queries';
import { CLASSNAME as COMBOBOX_LIST_CLASSNAME } from './ComboboxList';
import { CLASSNAME as COMBOBOX_OPTION_CLASSNAME } from './ComboboxOption';
import { CLASSNAME as COMBOBOX_OPTION_SKELETON_CLASSNAME } from './ComboboxOptionSkeleton';
import { CLASSNAME as COMBOBOX_POPOVER_CLASSNAME } from './ComboboxPopover';
import { CLASSNAME as COMBOBOX_SECTION_CLASSNAME } from './ComboboxSection';
import { CLASSNAME as COMBOBOX_STATE_CLASSNAME } from './ComboboxState';
import { VISUALLY_HIDDEN } from '../../constants';
import { setupCombobox } from './setupCombobox';
import type { ComboboxInputOptions } from './types';

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

export function getActiveOption(): HTMLElement | null {
    return screen.queryAllByRole('option').find((el) => el.hasAttribute('data-focus-visible-added')) ?? null;
}

function getActiveCell(): HTMLElement | null {
    return screen.queryAllByRole('gridcell').find((el) => el.hasAttribute('data-focus-visible-added')) ?? null;
}

function getVisibleGridOptions(): HTMLElement[] {
    const rows = screen.queryAllByRole('row');
    return rows
        .map((row) => within(row).queryAllByRole('gridcell')[0])
        .filter((cell): cell is HTMLElement => cell !== undefined);
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
        selectionMode,
    }: {
        value: string;
        onChange: (v: string) => void;
        onSelect?: (option: { value: string }) => void;
        selectionMode?: ComboboxInputOptions['selectionMode'];
    }) => (
        <Combobox.Provider>
            <Combobox.Input
                value={value}
                onChange={onChange}
                onSelect={onSelect}
                selectionMode={selectionMode}
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

    /** Combobox with filter="manual" — no auto-filtering, consumer handles it. */
    const manualFilterTemplate = ({
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
                filter="manual"
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

    /** Combobox with filter="off" — read-only input, opens on focus. */
    const filterOffTemplate = ({
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
                filter="off"
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

    /** Combobox with explicit openOnFocus={true}. */
    const openOnFocusTemplate = ({
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
                openOnFocus
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

    /** Combobox with explicit openOnFocus={false} (default behavior). */
    const noOpenOnFocusTemplate = ({
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
                openOnFocus={false}
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

    /** Combobox with nbOptionMessage — shows option count when list is not empty. */
    const nbOptionMessageTemplate = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
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
                <Combobox.State emptyMessage="No results" nbOptionMessage={(n: number) => `${n} result(s) available`} />
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
        manualFilterTemplate,
        filterOffTemplate,
        openOnFocusTemplate,
        noOpenOnFocusTemplate,
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
        nbOptionMessageTemplate,
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
            const input = screen.getByRole<HTMLInputElement>('combobox');

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
                const listbox = screen.getByRole('listbox');
                expect(controlsId).toBe(listbox.id);
            });
        });

        it('should have correct listbox ARIA attributes', async () => {
            renderWithState(t.inputTemplate);
            const input = screen.getByRole<HTMLInputElement>('combobox');
            await userEvent.click(input);

            await waitFor(() => {
                expect(input).toHaveAttribute('aria-expanded', 'true');
            });

            // Verify the scroll wrapper is rendered inside the popover
            const popover = queryByClassName(document.body, COMBOBOX_POPOVER_CLASSNAME);
            expect(popover).not.toBeNull();
            const scrollWrapper = queryByClassName(popover!, `${COMBOBOX_POPOVER_CLASSNAME}__scroll`);
            expect(scrollWrapper).not.toBeNull();

            const listbox = screen.getByRole('listbox');

            expect(listbox).toHaveAttribute('role', 'listbox');
            expect(listbox).toHaveAttribute('aria-label', 'Fruits');
            expect(listbox.classList.contains(COMBOBOX_LIST_CLASSNAME)).toBe(true);

            const options = within(listbox).queryAllByRole('option');
            expect(options.length).toBe(FRUITS.length);

            for (const opt of options) {
                expect(opt.id).toBeTruthy();
                expect(opt.classList.contains(`${COMBOBOX_OPTION_CLASSNAME}__action`)).toBe(true);
                const listItem = opt.closest(`.${COMBOBOX_OPTION_CLASSNAME}`);
                expect(listItem).not.toBeNull();
            }
        });

        it('should render option description with correct class', async () => {
            renderWithState(t.descriptionTemplate);
            const input = screen.getByRole<HTMLInputElement>('combobox');
            await userEvent.click(input);

            await waitFor(() => {
                expect(input).toHaveAttribute('aria-expanded', 'true');
            });

            const descriptionEl = queryByClassName(document.body, `${COMBOBOX_OPTION_CLASSNAME}__description`);
            expect(descriptionEl).not.toBeNull();
            expect(descriptionEl!.textContent).toBe('A round red fruit');
        });

        it('should have toggle button with correct ARIA attributes', async () => {
            renderWithState(t.inputTemplate);
            const input = screen.getByRole<HTMLInputElement>('combobox');
            const button = screen.queryByRole('button', { name: 'Fruits' })!;
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
            const input = screen.getByRole<HTMLInputElement>('combobox');
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
            const input = screen.getByRole<HTMLInputElement>('combobox');
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
            const input = screen.getByRole<HTMLInputElement>('combobox');
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
            const input = screen.getByRole<HTMLInputElement>('combobox');
            await userEvent.click(input);

            await waitFor(() => {
                expect(input).toHaveAttribute('aria-expanded', 'true');
            });

            await userEvent.keyboard('{Enter}');
            await waitFor(() => {
                expect(input).toHaveAttribute('aria-expanded', 'false');
            });
        });

        it('should NOT open listbox on Enter when closed (lets form submit)', async () => {
            renderWithState(t.inputTemplate);
            const input = screen.getByRole<HTMLInputElement>('combobox');
            // Focus input without clicking (click would open the popup).
            input.focus();
            expect(input).toHaveAttribute('aria-expanded', 'false');

            // fireEvent.keyDown returns `false` if the listener called preventDefault.
            const notPrevented = fireEvent.keyDown(input, { key: 'Enter' });

            // Popup must remain closed.
            expect(input).toHaveAttribute('aria-expanded', 'false');
            // Default must NOT be prevented — required for the surrounding form to submit on Enter.
            expect(notPrevented).toBe(true);
        });

        it('should close listbox on Enter when open with no active descendant (without preventing default)', async () => {
            renderWithState(t.inputTemplate);
            const input = screen.getByRole<HTMLInputElement>('combobox');
            await userEvent.click(input);

            await waitFor(() => {
                expect(input).toHaveAttribute('aria-expanded', 'true');
            });
            // Sanity: no option is virtually focused.
            expect(input).toHaveAttribute('aria-activedescendant', '');

            const notPrevented = fireEvent.keyDown(input, { key: 'Enter' });

            await waitFor(() => {
                expect(input).toHaveAttribute('aria-expanded', 'false');
            });
            // Default must NOT be prevented — required for the surrounding form to submit on Enter.
            expect(notPrevented).toBe(true);
        });

        it('should close listbox on Escape then clear on second Escape', async () => {
            renderWithState(t.inputTemplate);
            const input = screen.getByRole<HTMLInputElement>('combobox');
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
            const input = screen.getByRole<HTMLInputElement>('combobox');
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
            const input = screen.getByRole<HTMLInputElement>('combobox');
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
            const input = screen.getByRole<HTMLInputElement>('combobox');
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
            const input = screen.getByRole<HTMLInputElement>('combobox');
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
            const input = screen.getByRole<HTMLInputElement>('combobox');
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
            const input = screen.getByRole<HTMLInputElement>('combobox');
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
            const input = screen.getByRole<HTMLInputElement>('combobox');
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
            const input = screen.getByRole<HTMLInputElement>('combobox');
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
            const input = screen.getByRole<HTMLInputElement>('combobox');
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
                expect(screen.queryAllByRole('option').length).toBe(3);
            });
        });
    });

    // ───────────────────────────────────────────────────────────────
    // DOM Focus
    // ───────────────────────────────────────────────────────────────

    describe('Input trigger - DOM focus', () => {
        it('should keep DOM focus on textbox during navigation', async () => {
            renderWithState(t.inputTemplate);
            const input = screen.getByRole<HTMLInputElement>('combobox');
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
            const button = screen.queryByRole('button', { name: 'Fruits' })!;
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
            const input = screen.getByRole<HTMLInputElement>('combobox');
            await userEvent.click(input);

            await waitFor(() => {
                expect(input).toHaveAttribute('aria-expanded', 'true');
            });

            const orangeOption = screen.queryAllByRole('option').find((o) => o.textContent === 'Orange')!;
            await userEvent.click(orangeOption);

            expect(input.value).toBe('Orange');
            expect(getActiveOption()).toBeNull();
            expect(onSelect).toHaveBeenCalled();
        });

        it('should filter options by typing', async () => {
            renderWithState(t.inputTemplate);
            const input = screen.getByRole<HTMLInputElement>('combobox');
            await userEvent.click(input);

            await waitFor(() => {
                expect(input).toHaveAttribute('aria-expanded', 'true');
            });

            await userEvent.type(input, 'bl');

            await waitFor(() => {
                expect(screen.queryAllByRole('option').length).toBe(1);
                expect(screen.queryAllByRole('option')[0].textContent).toBe('Blueberry');
            });
        });

        it('should select after filtering', async () => {
            renderWithState(t.inputTemplate);
            const input = screen.getByRole<HTMLInputElement>('combobox');
            await userEvent.click(input);

            await waitFor(() => {
                expect(input).toHaveAttribute('aria-expanded', 'true');
            });

            await userEvent.type(input, 'lem');

            await waitFor(() => {
                expect(screen.queryAllByRole('option').length).toBe(1);
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
            const input = screen.getByRole<HTMLInputElement>('combobox');
            const button = screen.queryByRole('button', { name: 'Fruits' })!;

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
            const input = screen.getByRole<HTMLInputElement>('combobox');
            await userEvent.click(input);

            await waitFor(() => {
                expect(input).toHaveAttribute('aria-expanded', 'true');
            });

            const grapeOption = screen.queryAllByRole('option').find((o) => o.textContent === 'Grape')!;
            await userEvent.click(grapeOption);

            expect(input.value).toBe('Grape');
            expect(getActiveOption()).toBeNull();
            expect(input).toHaveAttribute('aria-activedescendant', '');
            expect(onSelect).toHaveBeenCalled();
        });

        it('should clear input value when selectionMode is clear', async () => {
            const onSelect = vi.fn();
            renderWithState(t.inputTemplate, { value: 'Grape', onSelect, selectionMode: 'clear' });
            const input = screen.getByRole<HTMLInputElement>('combobox');
            await userEvent.click(input);

            await waitFor(() => {
                expect(input).toHaveAttribute('aria-expanded', 'true');
            });

            const appleOption = screen.queryAllByRole('option').find((o) => o.textContent === 'Apple')!;
            await userEvent.click(appleOption);

            // onChange called with empty string — input gets cleared
            await waitFor(() => {
                expect(input.value).toBe('');
            });
            // onSelect still fired
            expect(onSelect).toHaveBeenCalled();

            // Combobox closes regardless of selectionMode
            await waitFor(() => {
                expect(input).toHaveAttribute('aria-expanded', 'false');
            });
        });

        it('should not update input value when selectionMode is keep', async () => {
            const onSelect = vi.fn();
            renderWithState(t.inputTemplate, { value: '', onSelect, selectionMode: 'keep' });
            const input = screen.getByRole<HTMLInputElement>('combobox');
            await userEvent.click(input);

            await waitFor(() => {
                expect(input).toHaveAttribute('aria-expanded', 'true');
            });

            const grapeOption = screen.queryAllByRole('option').find((o) => o.textContent === 'Grape')!;
            await userEvent.click(grapeOption);

            // onChange must NOT have been called — input stays empty
            expect(input.value).toBe('');
            // onSelect still fired
            expect(onSelect).toHaveBeenCalled();

            // Combobox closes regardless of selectionMode
            await waitFor(() => {
                expect(input).toHaveAttribute('aria-expanded', 'false');
            });
        });

        it('should keep focus on input after clicking option', async () => {
            renderWithState(t.inputTemplate);
            const input = screen.getByRole<HTMLInputElement>('combobox');
            await userEvent.click(input);

            await waitFor(() => {
                expect(input).toHaveAttribute('aria-expanded', 'true');
            });

            const orangeOption = screen.queryAllByRole('option').find((o) => o.textContent === 'Orange')!;
            await userEvent.click(orangeOption);

            expect(document.activeElement).toBe(input);
        });

        it('should reopen listbox when typing after Escape', async () => {
            renderWithState(t.inputTemplate);
            const input = screen.getByRole<HTMLInputElement>('combobox');
            await userEvent.click(input);

            await waitFor(() => {
                expect(input).toHaveAttribute('aria-expanded', 'true');
            });

            await userEvent.type(input, 'ap');
            await waitFor(() => {
                // Apple, Apricot, Grape (includes match)
                expect(screen.queryAllByRole('option').length).toBe(3);
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
                expect(screen.queryAllByRole('option').length).toBe(1);
                expect(screen.queryAllByRole('option')[0].textContent).toBe('Apple');
            });
        });
    });

    // ───────────────────────────────────────────────────────────────
    // Children unmounted while closed
    // ───────────────────────────────────────────────────────────────
    //
    // NOTE: keyboard-open *navigation* (ArrowDown/Up/Home/End/typeahead landing on
    // an option when opening from closed) is deferred until the option children
    // commit. That timing only reproduces reliably in a real browser, so those
    // assertions live in the browser test stories (TestStories.tsx), not here.

    describe('Children unmounted while closed', () => {
        it('should not render option children while closed', () => {
            renderWithState(t.inputTemplate);
            const input = screen.getByRole<HTMLInputElement>('combobox');
            expect(input).toHaveAttribute('aria-expanded', 'false');
            // Children are gated on isOpen — nothing mounted while closed.
            expect(screen.queryAllByRole('option').length).toBe(0);
        });

        it('should render option children once opened', async () => {
            renderWithState(t.inputTemplate);
            await userEvent.click(screen.getByRole('combobox'));
            await waitFor(() => {
                expect(screen.queryAllByRole('option').length).toBe(FRUITS.length);
            });
        });

        it('should not navigate after quickly closing then reopening (intent cleared)', async () => {
            renderWithState(t.inputTemplate);
            const input = screen.getByRole<HTMLInputElement>('combobox');
            input.focus();

            // Open with ArrowDown (stores a navigation intent)…
            await userEvent.keyboard('{ArrowDown}');
            // …then immediately close before/at the same tick (Escape clears the intent).
            await userEvent.keyboard('{Escape}');
            await waitFor(() => {
                expect(input).toHaveAttribute('aria-expanded', 'false');
            });

            // Reopen via click — no stored intent, so no option should be virtually focused.
            await userEvent.click(screen.getByRole('combobox'));
            expect(getActiveOption()).toBeNull();
            expect(input).toHaveAttribute('aria-activedescendant', '');
        });
    });

    // ───────────────────────────────────────────────────────────────
    // Combobox.Button Tests (Select-only with button trigger)
    // ───────────────────────────────────────────────────────────────

    describe('Button trigger - ARIA attributes', () => {
        it('should have correct button ARIA attributes', async () => {
            renderWithState(t.buttonTemplate, { value: '' }, BUTTON_STATE);
            const button = screen.getByTestId('combobox-button');

            expect(button).toHaveAttribute('role', 'combobox');
            expect(button).toHaveAttribute('aria-haspopup', 'listbox');
            expect(button).toHaveAttribute('aria-controls');
            expect(button).toHaveAttribute('aria-activedescendant', '');
            expect(button).toHaveAttribute('aria-expanded', 'false');

            await userEvent.click(button);
            await waitFor(() => {
                expect(button).toHaveAttribute('aria-expanded', 'true');
            });

            const listbox = screen.getByRole('listbox');
            expect(listbox).toHaveAttribute('role', 'listbox');

            const options = screen.queryAllByRole('option');
            for (const opt of options) {
                expect(opt.id).toBeTruthy();
            }
        });
    });

    describe('Button trigger - Open/close', () => {
        it('should open on Enter', async () => {
            renderWithState(t.buttonTemplate, { value: '' }, BUTTON_STATE);
            const button = screen.getByTestId('combobox-button');
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
            const button = screen.getByTestId('combobox-button');
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
            const button = screen.getByTestId('combobox-button');
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
            const button = screen.getByTestId('combobox-button');

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
            const button = screen.getByTestId('combobox-button');
            button.focus();

            await userEvent.keyboard('{ArrowDown}');
            const firstOption = screen.queryAllByRole('option')[0]!;
            await waitFor(() => {
                expect(button).toHaveAttribute('aria-expanded', 'true');
                expect(button).toHaveAttribute('aria-activedescendant', firstOption.id);
            });

            await userEvent.keyboard('{ArrowDown}');
            const options = screen.queryAllByRole('option');
            await waitFor(() => {
                expect(button).toHaveAttribute('aria-activedescendant', options[1].id);
            });
        });

        it('should not wrap on ArrowDown at last option', async () => {
            renderWithState(t.buttonTemplate, { value: '' }, BUTTON_STATE);
            const button = screen.getByTestId('combobox-button');
            button.focus();

            await userEvent.keyboard('{Enter}');
            await waitFor(() => {
                expect(button).toHaveAttribute('aria-expanded', 'true');
                expect(screen.queryAllByRole('option').length).toBeGreaterThan(0);
            });

            await userEvent.keyboard('{End}');
            const options = screen.queryAllByRole('option');
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
            const button = screen.getByTestId('combobox-button');
            button.focus();

            await userEvent.keyboard('{Enter}');
            await waitFor(() => {
                expect(button).toHaveAttribute('aria-expanded', 'true');
                expect(screen.queryAllByRole('option').length).toBeGreaterThan(0);
            });

            await userEvent.keyboard('{ArrowDown}');
            const firstOption = screen.queryAllByRole('option')[0]!;
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
            const button = screen.getByTestId('combobox-button');
            button.focus();

            await userEvent.keyboard('{Enter}');
            await waitFor(() => {
                expect(button).toHaveAttribute('aria-expanded', 'true');
                expect(screen.queryAllByRole('option').length).toBeGreaterThan(0);
            });

            const options = screen.queryAllByRole('option');
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

        // NOTE: Home/End *from closed* (open + jump in one key press) is deferred until
        // the option children commit and is covered by the browser test stories.

        it('should jump to last option on PageDown', async () => {
            renderWithState(t.buttonTemplate, { value: '' }, BUTTON_STATE);
            const button = screen.getByTestId('combobox-button');
            button.focus();

            await userEvent.keyboard('{Enter}');
            await waitFor(() => {
                expect(button).toHaveAttribute('aria-expanded', 'true');
                expect(screen.queryAllByRole('option').length).toBeGreaterThan(0);
            });

            const options = screen.queryAllByRole('option');
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
            const button = screen.getByTestId('combobox-button');
            button.focus();

            await userEvent.keyboard('{Enter}');
            await waitFor(() => {
                expect(button).toHaveAttribute('aria-expanded', 'true');
                expect(screen.queryAllByRole('option').length).toBeGreaterThan(0);
            });

            const options = screen.queryAllByRole('option');
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
            const button = screen.getByTestId('combobox-button');
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
            const button = screen.getByTestId('combobox-button');
            button.focus();

            await userEvent.keyboard('{ArrowDown}');
            await userEvent.keyboard('{ArrowDown}');
            await userEvent.keyboard('{ArrowDown}');

            const options = screen.queryAllByRole('option');
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
            const button = screen.getByTestId('combobox-button');
            button.focus();

            await userEvent.keyboard('{Enter}');
            await waitFor(() => {
                expect(button).toHaveAttribute('aria-expanded', 'true');
                expect(screen.queryAllByRole('option').length).toBeGreaterThan(0);
            });

            const options = screen.queryAllByRole('option');
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
            const button = screen.getByTestId('combobox-button');
            button.focus();

            await userEvent.keyboard('{ArrowDown}');
            for (let i = 0; i < 4; i++) {
                await userEvent.keyboard('{ArrowDown}');
            }

            const options = screen.queryAllByRole('option');
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
            const button = screen.getByTestId('combobox-button');

            await userEvent.click(button);
            await waitFor(() => {
                expect(button).toHaveAttribute('aria-expanded', 'true');
            });

            const options = screen.queryAllByRole('option');
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
            const button = screen.getByTestId('combobox-button');
            button.focus();

            // Open first so the typeahead below runs against committed options (the
            // open-from-closed deferral is covered by the browser test stories).
            await userEvent.keyboard('{Enter}');
            await waitFor(() => {
                expect(button).toHaveAttribute('aria-expanded', 'true');
                expect(screen.queryAllByRole('option').length).toBeGreaterThan(0);
            });

            await userEvent.keyboard('o');

            const options = screen.queryAllByRole('option');
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
        // NOTE: typeahead *from closed* (open + jump to match in one key press) is
        // deferred until the option children commit and is covered by the browser
        // test stories (TestStories.tsx). The tests below open first, then typeahead.

        it('should navigate to matching option on single char', async () => {
            renderWithState(t.buttonTemplate, { value: '' }, BUTTON_STATE);
            const button = screen.getByTestId('combobox-button');
            button.focus();

            await userEvent.keyboard('{Enter}');
            await waitFor(() => {
                expect(button).toHaveAttribute('aria-expanded', 'true');
                expect(screen.queryAllByRole('option').length).toBeGreaterThan(0);
            });

            const options = screen.queryAllByRole('option');
            const banana = options.find((o) => o.textContent === 'Banana')!;
            await userEvent.keyboard('b');
            await waitFor(() => {
                expect(button).toHaveAttribute('aria-activedescendant', banana.id);
            });
        });

        it('should navigate to matching option on multi char', async () => {
            renderWithState(t.buttonTemplate, { value: '' }, BUTTON_STATE);
            const button = screen.getByTestId('combobox-button');
            button.focus();

            // Open first so this jsdom test exercises multi-char matching only, not the
            // deferred open-from-closed path (covered by the browser test stories).
            await userEvent.keyboard('{Enter}');
            await waitFor(() => {
                expect(button).toHaveAttribute('aria-expanded', 'true');
                expect(screen.queryAllByRole('option').length).toBeGreaterThan(0);
            });

            await userEvent.keyboard('bl');
            const options = screen.queryAllByRole('option');
            const blueberry = options.find((o) => o.textContent === 'Blueberry')!;
            await waitFor(() => {
                expect(button).toHaveAttribute('aria-activedescendant', blueberry.id);
            });
        });

        it('should cycle through matches on repeated single char', async () => {
            renderWithState(t.buttonTemplate, { value: '' }, BUTTON_STATE);
            const button = screen.getByTestId('combobox-button');
            button.focus();

            await userEvent.keyboard('{Enter}');
            await waitFor(() => {
                expect(button).toHaveAttribute('aria-expanded', 'true');
                expect(screen.queryAllByRole('option').length).toBeGreaterThan(0);
            });

            const options = screen.queryAllByRole('option');
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
            const button = screen.getByTestId('combobox-button');

            expect(button.textContent).toBe('Apple');

            await userEvent.click(button);
            await waitFor(() => {
                expect(button).toHaveAttribute('aria-expanded', 'true');
            });

            const options = screen.queryAllByRole('option');
            const banana = options.find((o) => o.textContent === 'Banana')!;
            await userEvent.click(banana);

            await waitFor(() => {
                expect(button.textContent).toBe('Banana');
            });
        });

        it('should always show label when labelDisplayMode="show-label"', async () => {
            renderWithState(t.showLabelButtonTemplate, { value: 'Apple' }, BUTTON_STATE);
            const button = screen.getByTestId('combobox-button');

            expect(button.textContent).toBe('Select a fruit');

            await userEvent.click(button);
            await waitFor(() => {
                expect(button).toHaveAttribute('aria-expanded', 'true');
            });

            const options = screen.queryAllByRole('option');
            const banana = options.find((o) => o.textContent === 'Banana')!;
            await userEvent.click(banana);

            await waitFor(() => {
                expect(button).toHaveAttribute('aria-expanded', 'false');
            });
            expect(button.textContent).toBe('Select a fruit');
        });

        it('should show empty text when labelDisplayMode="show-tooltip"', () => {
            renderWithState(t.showTooltipButtonTemplate, { value: 'Apple' }, BUTTON_STATE);
            const button = screen.getByTestId('combobox-button');

            expect(button.textContent).toBe('');
            expect(button).toHaveAttribute('role', 'combobox');
            expect(button).toHaveAttribute('aria-haspopup', 'listbox');
        });
    });

    // ───────────────────────────────────────────────────────────────
    // Filter Prop
    // ───────────────────────────────────────────────────────────────

    describe('filter="manual"', () => {
        it('should not auto-filter options when typing', async () => {
            renderWithState(t.manualFilterTemplate);
            const input = screen.getByRole<HTMLInputElement>('combobox');
            await userEvent.click(input);

            await waitFor(() => {
                expect(input).toHaveAttribute('aria-expanded', 'true');
            });

            expect(screen.queryAllByRole('option').length).toBe(FRUITS.length);

            await userEvent.type(input, 'bl');

            // All options should remain visible — no auto-filter
            await waitFor(() => {
                expect(screen.queryAllByRole('option').length).toBe(FRUITS.length);
            });
        });

        it('should still allow selecting options', async () => {
            const onSelect = vi.fn();
            renderWithState(t.manualFilterTemplate, { value: '', onSelect });
            const input = screen.getByRole<HTMLInputElement>('combobox');
            await userEvent.click(input);

            await waitFor(() => {
                expect(input).toHaveAttribute('aria-expanded', 'true');
            });

            await userEvent.keyboard('{ArrowDown}');
            await waitFor(() => {
                expect(getActiveOption()!.textContent).toBe('Apple');
            });

            await userEvent.keyboard('{Enter}');
            await waitFor(() => {
                expect(input.value).toBe('Apple');
            });

            expect(onSelect).toHaveBeenCalled();
        });

        it('should not have readOnly on the input', async () => {
            renderWithState(t.manualFilterTemplate);
            const input = screen.getByRole<HTMLInputElement>('combobox');
            expect(input.readOnly).toBe(false);
        });
    });

    describe('filter="off"', () => {
        it('should set input to readOnly', async () => {
            renderWithState(t.filterOffTemplate);
            const input = screen.getByRole<HTMLInputElement>('combobox');

            await waitFor(() => {
                expect(input.readOnly).toBe(true);
            });
        });

        it('should open on focus (openOnFocus defaults to true)', async () => {
            renderWithState(t.filterOffTemplate);
            const input = screen.getByRole<HTMLInputElement>('combobox');

            expect(input).toHaveAttribute('aria-expanded', 'false');

            fireEvent.focus(input);

            await waitFor(() => {
                expect(input).toHaveAttribute('aria-expanded', 'true');
            });
        });

        it('should still allow selecting options', async () => {
            const onSelect = vi.fn();
            renderWithState(t.filterOffTemplate, { value: '', onSelect });
            const input = screen.getByRole<HTMLInputElement>('combobox');
            await userEvent.click(input);

            await waitFor(() => {
                expect(input).toHaveAttribute('aria-expanded', 'true');
            });

            await userEvent.keyboard('{ArrowDown}');
            await waitFor(() => {
                expect(getActiveOption()!.textContent).toBe('Apple');
            });

            await userEvent.keyboard('{Enter}');
            await waitFor(() => {
                expect(input.value).toBe('Apple');
            });

            expect(onSelect).toHaveBeenCalled();
        });

        it('should show all options (no filtering)', async () => {
            renderWithState(t.filterOffTemplate);
            const input = screen.getByRole<HTMLInputElement>('combobox');
            await userEvent.click(input);

            await waitFor(() => {
                expect(input).toHaveAttribute('aria-expanded', 'true');
            });

            expect(screen.queryAllByRole('option').length).toBe(FRUITS.length);
        });
    });

    describe('openOnFocus', () => {
        it('should open on focus when openOnFocus is true', async () => {
            renderWithState(t.openOnFocusTemplate);
            const input = screen.getByRole<HTMLInputElement>('combobox');

            expect(input).toHaveAttribute('aria-expanded', 'false');

            fireEvent.focus(input);

            await waitFor(() => {
                expect(input).toHaveAttribute('aria-expanded', 'true');
            });
        });

        it('should not open on focus when openOnFocus is false', async () => {
            renderWithState(t.noOpenOnFocusTemplate);
            const input = screen.getByRole<HTMLInputElement>('combobox');

            expect(input).toHaveAttribute('aria-expanded', 'false');

            fireEvent.focus(input);

            // Should remain closed — only opens on click or typing
            expect(input).toHaveAttribute('aria-expanded', 'false');
        });

        it('should open on click even when openOnFocus is false', async () => {
            renderWithState(t.noOpenOnFocusTemplate);
            const input = screen.getByRole<HTMLInputElement>('combobox');

            expect(input).toHaveAttribute('aria-expanded', 'false');

            await userEvent.click(input);

            await waitFor(() => {
                expect(input).toHaveAttribute('aria-expanded', 'true');
            });
        });

        it('should default to not opening on focus (filter="auto")', async () => {
            renderWithState(t.inputTemplate);
            const input = screen.getByRole<HTMLInputElement>('combobox');

            expect(input).toHaveAttribute('aria-expanded', 'false');

            fireEvent.focus(input);

            // Default filter="auto" should not open on focus
            expect(input).toHaveAttribute('aria-expanded', 'false');
        });
    });

    // ───────────────────────────────────────────────────────────────
    // Edge Cases & Regression Guards
    // ───────────────────────────────────────────────────────────────

    describe('Edge cases', () => {
        it('should fall back to textContent when option has no value prop', async () => {
            renderWithState(t.noValueButtonTemplate, { value: '' }, BUTTON_STATE);
            const button = screen.getByTestId('combobox-button');

            await userEvent.click(button);
            await waitFor(() => {
                expect(button).toHaveAttribute('aria-expanded', 'true');
            });

            const grape = screen.queryAllByRole('option').find((o) => o.textContent === 'Grape')!;
            expect(grape).not.toHaveAttribute('data-value');
            await userEvent.click(grape);

            await waitFor(() => {
                expect(button.textContent).toBe('Grape');
            });
        });

        it('should jump to selected option on ArrowDown', async () => {
            renderWithState(t.selectedButtonTemplate, { value: 'Cherry' }, BUTTON_STATE);
            const button = screen.getByTestId('combobox-button');
            button.focus();

            await userEvent.keyboard('{ArrowDown}');
            await waitFor(() => {
                expect(button).toHaveAttribute('aria-expanded', 'true');
            });

            const cherry = screen.queryAllByRole('option').find((o) => o.textContent === 'Cherry')!;
            await waitFor(() => {
                expect(button).toHaveAttribute('aria-activedescendant', cherry.id);
            });
        });

        it('should not change open state on blur then re-focus', async () => {
            renderWithState(t.inputTemplate);
            const input = screen.getByRole<HTMLInputElement>('combobox');

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
            const input = screen.getByRole<HTMLInputElement>('combobox');
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
                expect(input).toHaveAttribute('aria-expanded', 'true');
            });

            const bananaOption = screen.queryAllByRole('option').find((o) => o.textContent === 'Banana')!;
            await userEvent.click(bananaOption);

            expect(input.value).toBe('');
            expect(input).toHaveAttribute('aria-expanded', 'true');

            const cherryOption = screen.queryAllByRole('option').find((o) => o.textContent === 'Cherry')!;
            await userEvent.click(cherryOption);
            await waitFor(() => {
                expect(input.value).toBe('Cherry');
                expect(input).toHaveAttribute('aria-expanded', 'false');
            });
        });

        it('should navigate to disabled option but not select it (button trigger)', async () => {
            renderWithState(t.disabledButtonTemplate, { value: '' }, BUTTON_STATE);
            const button = screen.getByTestId('combobox-button');
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
                expect(button).toHaveAttribute('aria-expanded', 'true');
            });

            const bananaOption = screen.queryAllByRole('option').find((o) => o.textContent === 'Banana')!;
            await userEvent.click(bananaOption);

            expect(button.textContent).toBe('Select a fruit');
            expect(button).toHaveAttribute('aria-expanded', 'true');

            const cherryOption = screen.queryAllByRole('option').find((o) => o.textContent === 'Cherry')!;
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
            const input = screen.getByRole<HTMLInputElement>('combobox');
            await userEvent.click(input);

            await waitFor(() => {
                expect(input).toHaveAttribute('aria-expanded', 'true');
            });

            expect(input).toHaveAttribute('aria-haspopup', 'grid');

            const controlsId = input.getAttribute('aria-controls')!;
            const grid = screen.getByRole('grid');
            expect(controlsId).toBe(grid.id);
            expect(grid).toHaveAttribute('role', 'grid');
            expect(grid.classList.contains(COMBOBOX_LIST_CLASSNAME)).toBe(true);

            const rows = within(grid).queryAllByRole('row');
            expect(rows.length).toBe(GRID_FRUITS.length);

            for (const row of rows) {
                const cells = within(row).queryAllByRole('gridcell');
                expect(cells.length).toBe(3);

                const firstCell = cells[0];
                expect(firstCell).toHaveAttribute('data-value');
                expect(firstCell).toHaveAttribute('aria-selected');
                expect(firstCell.classList.contains(`${COMBOBOX_OPTION_CLASSNAME}__action`)).toBe(true);

                for (const cell of cells) {
                    expect(cell.id).toBeTruthy();
                }

                expect(row.classList.contains(COMBOBOX_OPTION_CLASSNAME)).toBe(true);
            }
        });

        it('should have correct grid ARIA attributes (button trigger)', async () => {
            renderWithState(t.gridButtonTemplate, { value: '' }, BUTTON_STATE);
            const button = screen.getByTestId('combobox-button');
            await userEvent.click(button);

            await waitFor(() => {
                expect(button).toHaveAttribute('aria-expanded', 'true');
            });

            expect(button).toHaveAttribute('aria-haspopup', 'grid');

            const grid = screen.getByRole('grid');
            expect(grid).not.toBeNull();

            const rows = within(grid).queryAllByRole('row');
            expect(rows.length).toBe(GRID_FRUITS.length);
            for (const row of rows) {
                const cells = within(row).queryAllByRole('gridcell');
                expect(cells.length).toBe(2);
            }
        });
    });

    describe('Grid combobox - Input trigger keyboard', () => {
        it('should navigate rows with ArrowDown/Up', async () => {
            renderWithState(t.gridInputTemplate);
            const input = screen.getByRole<HTMLInputElement>('combobox');
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
            const input = screen.getByRole<HTMLInputElement>('combobox');
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
            const row = active.closest<HTMLElement>('[role="row"]')!;
            const firstCell = within(row).queryAllByRole('gridcell')[0]!;
            expect(firstCell.textContent).toBe('Apple');

            expect(document.activeElement).toBe(input);
        });

        it('should select option on Enter', async () => {
            const onSelect = vi.fn();
            renderWithState(t.gridInputTemplate, { value: '', onSelect });
            const input = screen.getByRole<HTMLInputElement>('combobox');
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
            const input = screen.getByRole<HTMLInputElement>('combobox');
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
            const row = active.closest<HTMLElement>('[role="row"]')!;
            const firstCell = within(row).queryAllByRole('gridcell')[0];
            expect(active).not.toBe(firstCell);

            await userEvent.keyboard('{Enter}');

            expect(input.value).toBe('');
            expect(onDelete).toHaveBeenCalled();

            // Popover stays open after activating an action cell (matches mouse click behavior).
            expect(input).toHaveAttribute('aria-expanded', 'true');
        });

        it('should remember column position across rows', async () => {
            renderWithState(t.gridInputTemplate);
            const input = screen.getByRole<HTMLInputElement>('combobox');
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
            const appleRow = editCellApple.closest<HTMLElement>('[role="row"]')!;
            const appleCells = within(appleRow).queryAllByRole('gridcell');
            expect(appleCells.indexOf(editCellApple)).toBe(1);

            await userEvent.keyboard('{ArrowDown}');
            const editCellBanana = getActiveCell()!;
            const bananaRow = editCellBanana.closest<HTMLElement>('[role="row"]')!;
            const bananaCells = within(bananaRow).queryAllByRole('gridcell');
            expect(bananaCells.indexOf(editCellBanana)).toBe(1);
            const bananaFirstCell = bananaCells[0];
            expect(bananaFirstCell.textContent).toBe('Banana');

            await userEvent.keyboard('{ArrowDown}');
            const editCellCherry = getActiveCell()!;
            const cherryRow = editCellCherry.closest<HTMLElement>('[role="row"]')!;
            const cherryCells = within(cherryRow).queryAllByRole('gridcell');
            expect(cherryCells.indexOf(editCellCherry)).toBe(1);
            const cherryFirstCell = cherryCells[0];
            expect(cherryFirstCell.textContent).toBe('Cherry');
        });

        it('should filter grid options by typing', async () => {
            renderWithState(t.gridInputTemplate);
            const input = screen.getByRole<HTMLInputElement>('combobox');
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
            const input = screen.getByRole<HTMLInputElement>('combobox');
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
            const input = screen.getByRole<HTMLInputElement>('combobox');
            await userEvent.click(input);

            await waitFor(() => {
                expect(input).toHaveAttribute('aria-expanded', 'true');
            });

            const grid = screen.getByRole('grid');
            const rows = within(grid).queryAllByRole('row');
            const appleRow = rows[0];
            const cells = within(appleRow).queryAllByRole('gridcell');
            const deleteCell = cells[cells.length - 1];

            await userEvent.click(deleteCell);

            expect(input.value).toBe('');
            expect(input).toHaveAttribute('aria-expanded', 'true');
            expect(onDelete).toHaveBeenCalled();
        });
    });

    describe('Grid combobox - Button trigger keyboard', () => {
        it('should navigate rows with ArrowDown/Up', async () => {
            renderWithState(t.gridButtonTemplate, { value: '' }, BUTTON_STATE);
            const button = screen.getByTestId('combobox-button');
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
            const button = screen.getByTestId('combobox-button');
            button.focus();

            await userEvent.keyboard('{ArrowDown}');
            await waitFor(() => {
                expect(button).toHaveAttribute('aria-expanded', 'true');
                expect(getActiveCell()!.textContent).toBe('Apple');
            });

            await userEvent.keyboard('{ArrowRight}');
            const active = getActiveCell()!;
            const row = active.closest<HTMLElement>('[role="row"]')!;
            const firstCell = within(row).queryAllByRole('gridcell')[0]!;
            expect(active).not.toBe(firstCell);

            await userEvent.keyboard('{ArrowRight}');
            expect(getActiveCell()!.textContent).toBe('Banana');

            await userEvent.keyboard('{ArrowLeft}');
            const backActive = getActiveCell()!;
            const backRow = backActive.closest<HTMLElement>('[role="row"]')!;
            const backFirstCell = within(backRow).queryAllByRole('gridcell')[0]!;
            expect(backFirstCell.textContent).toBe('Apple');
        });

        it('should select option on Enter', async () => {
            const onSelect = vi.fn();
            renderWithState(t.gridButtonTemplate, { value: '', onSelect }, BUTTON_STATE);
            const button = screen.getByTestId('combobox-button');
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
            const button = screen.getByTestId('combobox-button');
            button.focus();

            await userEvent.keyboard('{ArrowDown}');
            await waitFor(() => {
                expect(getActiveCell()!.textContent).toBe('Apple');
            });

            await userEvent.keyboard('{ArrowRight}');
            const active = getActiveCell()!;
            const row = active.closest<HTMLElement>('[role="row"]')!;
            const firstCell = within(row).queryAllByRole('gridcell')[0]!;
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
            const stateEl = queryByClassName(document.body, COMBOBOX_STATE_CLASSNAME);
            expect(stateEl).toBeInTheDocument();
            expect(stateEl).toHaveAttribute('role', 'status');
            expect(stateEl).toHaveAttribute('aria-live', 'polite');
            expect(stateEl).toHaveAttribute('aria-atomic', 'true');
        });
    });

    describe('Combobox.State - Empty state', () => {
        it('should be visually hidden when list has options', async () => {
            renderWithState(t.emptyStateTemplate);
            const input = screen.getByRole<HTMLInputElement>('combobox');
            await userEvent.click(input);

            await waitFor(() => {
                expect(input).toHaveAttribute('aria-expanded', 'true');
            });

            // Options are visible — state container should be visually hidden
            const stateEl = queryByClassName(document.body, COMBOBOX_STATE_CLASSNAME);
            expect(stateEl).toBeInTheDocument();
            expect(stateEl!.className).toContain(VISUALLY_HIDDEN);
        });

        it('should show empty message when all options are filtered out', async () => {
            renderWithState(t.emptyStateTemplate);
            const input = screen.getByRole<HTMLInputElement>('combobox');
            await userEvent.click(input);

            await waitFor(() => {
                expect(input).toHaveAttribute('aria-expanded', 'true');
            });

            // Type a single character that matches no fruit
            await userEvent.type(input, 'z');

            await waitFor(() => {
                expect(screen.queryAllByRole('option').length).toBe(0);
            });

            await waitFor(() => {
                const stateEl = queryByClassName(document.body, COMBOBOX_STATE_CLASSNAME);
                expect(stateEl).toBeInTheDocument();
                expect(stateEl!.className).not.toContain(VISUALLY_HIDDEN);
                expect(stateEl).toHaveTextContent('No results for "z"');
            });
        });

        it('should hide empty message when options reappear', async () => {
            renderWithState(t.emptyStateTemplate);
            const input = screen.getByRole<HTMLInputElement>('combobox');
            await userEvent.click(input);

            await waitFor(() => {
                expect(input).toHaveAttribute('aria-expanded', 'true');
            });

            // Filter to empty
            await userEvent.type(input, 'z');
            await waitFor(() => {
                expect(screen.queryAllByRole('option').length).toBe(0);
                expect(queryByClassName(document.body, COMBOBOX_STATE_CLASSNAME)!.className).not.toContain(
                    VISUALLY_HIDDEN,
                );
            });

            // Clear input — options reappear
            await userEvent.clear(input);
            await waitFor(() => {
                expect(screen.queryAllByRole('option').length).toBeGreaterThan(0);
                expect(queryByClassName(document.body, COMBOBOX_STATE_CLASSNAME)!.className).toContain(VISUALLY_HIDDEN);
            });
        });

        it('should pass input value to emptyMessage callback', async () => {
            renderWithState(t.emptyStateTemplate);
            const input = screen.getByRole<HTMLInputElement>('combobox');
            await userEvent.click(input);

            await waitFor(() => {
                expect(input).toHaveAttribute('aria-expanded', 'true');
            });

            await userEvent.type(input, 'z');
            await waitFor(() => {
                expect(screen.queryAllByRole('option').length).toBe(0);
            });

            await waitFor(() => {
                expect(queryByClassName(document.body, COMBOBOX_STATE_CLASSNAME)).toHaveTextContent(
                    'No results for "z"',
                );
            });
        });

        it('should update input value in emptyMessage when typing while empty', async () => {
            renderWithState(t.emptyStateTemplate);
            const input = screen.getByRole<HTMLInputElement>('combobox');
            await userEvent.click(input);

            await waitFor(() => {
                expect(input).toHaveAttribute('aria-expanded', 'true');
            });

            // Type "z" — list becomes empty
            await userEvent.type(input, 'z');
            await waitFor(() => {
                expect(queryByClassName(document.body, COMBOBOX_STATE_CLASSNAME)).toHaveTextContent(
                    'No results for "z"',
                );
            });

            // Keep typing "zz" — list stays empty, message should update
            await userEvent.type(input, 'z');
            await waitFor(() => {
                expect(queryByClassName(document.body, COMBOBOX_STATE_CLASSNAME)).toHaveTextContent(
                    'No results for "zz"',
                );
            });
        });
    });

    describe('Combobox.State - Option count message', () => {
        it('should show option count message when list has options', async () => {
            renderWithState(t.nbOptionMessageTemplate);
            const input = screen.getByRole<HTMLInputElement>('combobox');
            await userEvent.click(input);

            await waitFor(() => {
                expect(input).toHaveAttribute('aria-expanded', 'true');
            });

            await waitFor(() => {
                const stateEl = queryByClassName(document.body, COMBOBOX_STATE_CLASSNAME);
                expect(stateEl).toBeInTheDocument();
                expect(stateEl).toHaveTextContent('10 result(s) available');
            });
        });

        it('should update option count when filtering reduces visible options', async () => {
            renderWithState(t.nbOptionMessageTemplate);
            const input = screen.getByRole<HTMLInputElement>('combobox');
            await userEvent.click(input);

            await waitFor(() => {
                expect(input).toHaveAttribute('aria-expanded', 'true');
            });

            await userEvent.type(input, 'bl');

            await waitFor(() => {
                expect(screen.queryAllByRole('option').length).toBe(1);
            });

            await waitFor(() => {
                const stateEl = queryByClassName(document.body, COMBOBOX_STATE_CLASSNAME);
                expect(stateEl).toHaveTextContent('1 result(s) available');
            });
        });

        it('should show empty message instead of option count when all options are filtered out', async () => {
            renderWithState(t.nbOptionMessageTemplate);
            const input = screen.getByRole<HTMLInputElement>('combobox');
            await userEvent.click(input);

            await waitFor(() => {
                expect(input).toHaveAttribute('aria-expanded', 'true');
            });

            await userEvent.type(input, 'z');

            await waitFor(() => {
                expect(screen.queryAllByRole('option').length).toBe(0);
            });

            await waitFor(() => {
                const stateEl = queryByClassName(document.body, COMBOBOX_STATE_CLASSNAME);
                expect(stateEl).toHaveTextContent('No results');
                expect(stateEl).not.toHaveTextContent('result(s) available');
            });
        });
    });

    describe('Combobox.State - Error state', () => {
        it('should show error message', async () => {
            renderWithState(t.errorStateTemplate);
            const input = screen.getByRole<HTMLInputElement>('combobox');
            await userEvent.click(input);

            await waitFor(() => {
                expect(input).toHaveAttribute('aria-expanded', 'false');
            });

            // Content is deferred after open to allow the aria-live region
            // to become visible in the accessibility tree first.
            await waitFor(() => {
                const stateEl = queryByClassName(document.body, COMBOBOX_STATE_CLASSNAME);
                expect(stateEl).toBeInTheDocument();
                expect(stateEl!.className).not.toContain(VISUALLY_HIDDEN);
                expect(stateEl).toHaveTextContent('Service unavailable');
            });
        });

        it('should show secondary error message', async () => {
            renderWithState(t.errorStateTemplate);
            const input = screen.getByRole<HTMLInputElement>('combobox');
            await userEvent.click(input);

            await waitFor(() => {
                expect(input).toHaveAttribute('aria-expanded', 'false');
            });

            await waitFor(() => {
                expect(queryByClassName(document.body, COMBOBOX_STATE_CLASSNAME)).toHaveTextContent(
                    'Please try again later',
                );
            });
        });

        it('should have role=status on the state container', () => {
            renderWithState(t.errorStateTemplate);
            expect(queryByClassName(document.body, COMBOBOX_STATE_CLASSNAME)).toHaveAttribute('role', 'status');
            expect(queryByClassName(document.body, COMBOBOX_STATE_CLASSNAME)).toHaveAttribute('aria-live', 'polite');
        });
    });

    // ───────────────────────────────────────────────────────────────
    // Combobox.OptionSkeleton & Loading State
    // ───────────────────────────────────────────────────────────────

    describe('Combobox.OptionSkeleton - Rendering', () => {
        it('should render skeleton items with role="none"', async () => {
            renderWithState(t.loadingTemplate);
            await userEvent.click(screen.getByRole('combobox'));
            const skeletons = queryAllByClassName(document.body, COMBOBOX_OPTION_SKELETON_CLASSNAME);
            expect(skeletons.length).toBe(3);

            for (const skeleton of skeletons) {
                expect(skeleton).toHaveAttribute('role', 'none');
            }
        });

        it('should not render any role="option" elements', async () => {
            renderWithState(t.loadingTemplate);
            await userEvent.click(screen.getByRole('combobox'));
            const options = screen.queryAllByRole('option');
            expect(options.length).toBe(0);
        });

        it('should not render skeleton children while closed', () => {
            renderWithState(t.loadingTemplate);
            const skeletons = queryAllByClassName(document.body, COMBOBOX_OPTION_SKELETON_CLASSNAME);
            expect(skeletons.length).toBe(0);
        });

        it('should set aria-busy on the listbox when skeletons are mounted', async () => {
            renderWithState(t.loadingTemplate);
            await userEvent.click(screen.getByRole('combobox'));
            await waitFor(() => {
                expect(screen.queryByRole('listbox')).toHaveAttribute('aria-busy', 'true');
            });
        });
    });

    describe('Combobox.OptionSkeleton - Load more pattern', () => {
        it('should render skeletons appended after real options', async () => {
            renderWithState(t.loadMoreTemplate);
            await userEvent.click(screen.getByRole('combobox'));
            const options = screen.queryAllByRole('option');
            const skeletons = queryAllByClassName(document.body, COMBOBOX_OPTION_SKELETON_CLASSNAME);

            expect(options.length).toBe(FRUITS.length);
            expect(skeletons.length).toBe(3);
        });

        it('should set aria-busy on the listbox when skeletons are appended', async () => {
            renderWithState(t.loadMoreTemplate);
            await userEvent.click(screen.getByRole('combobox'));
            await waitFor(() => {
                expect(screen.queryByRole('listbox')).toHaveAttribute('aria-busy', 'true');
            });
        });
    });

    describe('Combobox.OptionSkeleton - Section loading', () => {
        it('should render skeletons inside a section', async () => {
            renderWithState(t.sectionLoadingTemplate);
            await userEvent.click(screen.getByRole('combobox'));
            const skeletons = queryAllByClassName(document.body, COMBOBOX_OPTION_SKELETON_CLASSNAME);
            expect(skeletons.length).toBe(3);

            // Real options should still be present in the other section
            const options = screen.queryAllByRole('option');
            expect(options.length).toBe(3);
        });

        it('should aria-hide a skeleton-only section', async () => {
            renderWithState(t.sectionLoadingTemplate);
            await userEvent.click(screen.getByRole('combobox'));

            await waitFor(() => {
                // Re-query to get fresh elements after state updates
                const secs = queryAllByClassName(document.body, COMBOBOX_SECTION_CLASSNAME);
                expect(secs.length).toBeGreaterThanOrEqual(1);

                // The section with real options should NOT be aria-hidden
                const optionSection = secs.find((s) => within(s).queryAllByRole('option').length > 0);
                if (optionSection) {
                    expect(optionSection).not.toHaveAttribute('aria-hidden');
                }

                const skeletonSection = secs.find(
                    (s) =>
                        queryAllByClassName(s, COMBOBOX_OPTION_SKELETON_CLASSNAME).length > 0 &&
                        within(s).queryAllByRole('option').length === 0,
                );
                expect(skeletonSection).toBeTruthy();
                expect(skeletonSection).toHaveAttribute('aria-hidden', 'true');
            });
        });
    });

    describe('Combobox.State - Loading state', () => {
        it('should suppress empty message while skeletons are mounted', async () => {
            renderWithState(t.loadingTemplate);
            await userEvent.click(screen.getByRole('combobox'));
            const stateEl = queryByClassName(document.body, COMBOBOX_STATE_CLASSNAME);
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
