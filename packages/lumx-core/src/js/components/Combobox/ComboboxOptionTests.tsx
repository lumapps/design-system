import userEvent from '@testing-library/user-event';
import { screen, waitFor } from '@testing-library/dom';
import { mdiCheckboxBlankOutline, mdiCheckboxMarked, mdiCheckCircle, mdiRadioboxBlank } from '@lumx/icons';
import { CLASSNAME as COMBOBOX_OPTION_CLASSNAME } from '../Listbox/ListboxOption';
import { getByClassName, queryByClassName } from '../../../testing/queries';
import { ComboboxNamespace } from './Tests';

type RenderResult = { unmount: () => void; container: HTMLElement };

/**
 * Options to set up the ListboxOption test suite.
 * Injected by the framework-specific test file (React or Vue).
 */
export interface ListboxOptionTestSetup {
    /** Combobox compound component namespace */
    Combobox: Pick<ComboboxNamespace, 'Provider' | 'Input' | 'List' | 'Option' | 'SelectionIcon'>;
    /**
     * Render a JSX template and return a result with a container.
     * The template is a zero-argument function returning a JSX element.
     */
    render: (template: () => any) => RenderResult;
}

interface SetupOptions {
    listType?: 'list' | 'grid';
    isMultiselectable?: boolean;
    value?: string;
    isSelected?: boolean;
    isDisabled?: boolean;
    description?: string;
    before?: any;
    after?: any;
    tooltipProps?: Record<string, any>;
    actionProps?: Record<string, any>;
    children?: any;
}

/**
 * Shared Combobox.Option test suite — covers DOM shape and ARIA correctness.
 * Runs the same assertions against both React and Vue wrappers.
 */
export default function listboxOptionTests({ Combobox, render }: ListboxOptionTestSetup) {
    /**
     * Render a single Combobox.Option inside the minimal required context.
     * Returns the root <li> element, the action element (role="option" / role="gridcell"),
     * and the render result.
     */
    const setup = async ({
        listType,
        isMultiselectable,
        value = 'apple',
        isSelected,
        isDisabled,
        description,
        before,
        after,
        tooltipProps,
        actionProps,
        children = 'Apple',
    }: SetupOptions = {}) => {
        const result = render(() => (
            <Combobox.Provider>
                <Combobox.Input
                    placeholder="Pick a fruit…"
                    onChange={() => {}}
                    toggleButtonProps={{ label: 'Fruits' }}
                />
                <Combobox.List
                    aria-label="Fruits"
                    type={listType}
                    aria-multiselectable={isMultiselectable || undefined}
                >
                    <Combobox.Option
                        value={value}
                        isSelected={isSelected}
                        isDisabled={isDisabled}
                        description={description}
                        before={before}
                        after={after}
                        tooltipProps={tooltipProps}
                        actionProps={actionProps}
                    >
                        {children}
                    </Combobox.Option>
                </Combobox.List>
            </Combobox.Provider>
        ));
        // Open the combobox
        await userEvent.click(screen.getByRole('combobox'));
        const action = await (listType === 'grid' ? screen.findByRole('gridcell') : screen.findByRole('option'));
        return { ...result, action };
    };

    describe('Combobox.Option', () => {
        // ── ARIA attributes ──────────────────────────────────────────────

        describe('ARIA attributes', () => {
            it('should render the action element with role="option"', async () => {
                await setup();
                expect(screen.queryByRole('option')).toBeInTheDocument();
            });

            it('should set aria-selected="false" by default', async () => {
                const { action } = await setup();
                expect(action).toHaveAttribute('aria-selected', 'false');
            });

            it('should set aria-selected="true" when isSelected is true', async () => {
                const { action } = await setup({ isSelected: true });
                expect(action).toHaveAttribute('aria-selected', 'true');
            });

            it('should set aria-disabled="true" when isDisabled is true', async () => {
                const { action } = await setup({ isDisabled: true });
                expect(action).toHaveAttribute('aria-disabled', 'true');
            });

            it('should not set aria-disabled when isDisabled is false', async () => {
                const { action } = await setup({ isDisabled: false });
                expect(action).not.toHaveAttribute('aria-disabled');
            });

            it('should expose data-value matching the value prop on the action element', async () => {
                const { action } = await setup({ value: 'banana' });
                expect(action).toHaveAttribute('data-value', 'banana');
            });
        });

        // ── Description ──────────────────────────────────────────────────

        describe('Description', () => {
            it('should render a description block with the correct class and text', async () => {
                await setup({ description: 'A round red fruit' });
                const descEl = getByClassName(document.body, `${COMBOBOX_OPTION_CLASSNAME}__description`);
                expect(descEl).toBeInTheDocument();
                expect(descEl).toHaveTextContent('A round red fruit');
            });

            it('should link the action element to the description via aria-describedby', async () => {
                const { action } = await setup({ description: 'A round red fruit' });
                const descEl = getByClassName(document.body, `${COMBOBOX_OPTION_CLASSNAME}__description`);
                const describedBy = action.getAttribute('aria-describedby');
                expect(describedBy).toBeTruthy();
                expect(describedBy).toContain(descEl.id);
            });

            it('should expose the description as the action accessible description', async () => {
                const { action } = await setup({ description: 'A round red fruit' });
                expect(action).toHaveAccessibleDescription('A round red fruit');
            });

            it('should not render a description block when description is not set', async () => {
                await setup();
                expect(
                    queryByClassName(document.body, `${COMBOBOX_OPTION_CLASSNAME}__description`),
                ).not.toBeInTheDocument();
            });
        });

        // ── Slots — before / after ───────────────────────────────────────

        describe('Slots — before / after', () => {
            it('should render before content', async () => {
                await setup({ before: <span data-testid="before-content">icon</span> });
                expect(screen.getByTestId('before-content')).toBeInTheDocument();
            });

            it('should render after content', async () => {
                await setup({ after: <span data-testid="after-content">badge</span> });
                expect(screen.getByTestId('after-content')).toBeInTheDocument();
            });
        });

        // ── Selection icon ───────────────────────────────────────────────

        describe('SelectionIcon', () => {
            const getIconPath = () =>
                document.querySelector('.lumx-combobox-option__selection-icon path')?.getAttribute('d');

            it('should render a check circle icon when selected in a single selection list', async () => {
                await setup({ isSelected: true, after: <Combobox.SelectionIcon /> });
                expect(getIconPath()).toBe(mdiCheckCircle);
            });

            it('should render a radio icon when not selected in a single selection list', async () => {
                await setup({ isSelected: false, after: <Combobox.SelectionIcon /> });
                expect(getIconPath()).toBe(mdiRadioboxBlank);
            });

            it('should render a marked checkbox icon when selected in a multiple selection list', async () => {
                await setup({ isSelected: true, isMultiselectable: true, after: <Combobox.SelectionIcon /> });
                expect(getIconPath()).toBe(mdiCheckboxMarked);
            });

            it('should render a blank checkbox icon when not selected in a multiple selection list', async () => {
                await setup({ isSelected: false, isMultiselectable: true, after: <Combobox.SelectionIcon /> });
                expect(getIconPath()).toBe(mdiCheckboxBlankOutline);
            });
        });

        // ── Tooltip wrapping ─────────────────────────────────────────────

        describe('Tooltip wrapping', () => {
            it('should not render a tooltip when tooltipProps is omitted', async () => {
                await setup();
                // The tooltip popup is mounted with role="tooltip" (via Portal).
                expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
            });

            it('should render a tooltip when tooltipProps is provided (forceOpen)', async () => {
                await setup({ tooltipProps: { label: 'Extra info', forceOpen: true } });
                expect(screen.getByRole('tooltip')).toBeInTheDocument();
            });
        });

        // ── Tooltip on active descendant ─────────────────────────────────

        describe('Tooltip on active descendant', () => {
            const setupWithTooltips = async () => {
                render(() => (
                    <Combobox.Provider>
                        <Combobox.Input
                            placeholder="Pick a fruit…"
                            onChange={() => {}}
                            toggleButtonProps={{ label: 'Fruits' }}
                        />
                        <Combobox.List aria-label="Fruits">
                            {['Apple', 'Banana'].map((fruit) => (
                                <Combobox.Option key={fruit} value={fruit} tooltipProps={{ label: `${fruit} info` }}>
                                    {fruit}
                                </Combobox.Option>
                            ))}
                        </Combobox.List>
                    </Combobox.Provider>
                ));
                await userEvent.click(screen.getByRole('combobox'));
                await screen.findAllByRole('option');
            };

            it('should not show any tooltip when no option is active', async () => {
                await setupWithTooltips();
                expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
            });

            it('should show the tooltip of the option highlighted with the keyboard', async () => {
                await setupWithTooltips();
                await userEvent.keyboard('{ArrowDown}');

                expect(await screen.findByRole('tooltip', { name: 'Apple info' })).toBeInTheDocument();
                expect(screen.queryByRole('tooltip', { name: 'Banana info' })).not.toBeInTheDocument();
            });

            it('should move the tooltip to the next highlighted option', async () => {
                await setupWithTooltips();
                await userEvent.keyboard('{ArrowDown}');
                await screen.findByRole('tooltip', { name: 'Apple info' });
                await userEvent.keyboard('{ArrowDown}');

                expect(await screen.findByRole('tooltip', { name: 'Banana info' })).toBeInTheDocument();
                await waitFor(() =>
                    expect(screen.queryByRole('tooltip', { name: 'Apple info' })).not.toBeInTheDocument(),
                );
            });
        });

        // ── Grid mode ────────────────────────────────────────────────────

        describe('Grid mode', () => {
            it('should render the action element with role="gridcell" within a role="row" inside a grid list', async () => {
                const { action } = await setup({ listType: 'grid' });
                expect(action).toHaveAttribute('role', 'gridcell');
                expect(action.closest('li')).toHaveAttribute('role', 'row');
            });
        });
    });
}
