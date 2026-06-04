import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/dom';
import { CLASSNAME as COMBOBOX_OPTION_CLASSNAME } from './ComboboxOption';
import { getByClassName, queryByClassName } from '../../../testing/queries';
import { ComboboxNamespace } from './Tests';

type RenderResult = { unmount: () => void; container: HTMLElement };

/**
 * Options to set up the ComboboxOption test suite.
 * Injected by the framework-specific test file (React or Vue).
 */
export interface ComboboxOptionTestSetup {
    /** Combobox compound component namespace */
    Combobox: Pick<ComboboxNamespace, 'Provider' | 'Input' | 'List' | 'Option'>;
    /**
     * Render a JSX template and return a result with a container.
     * The template is a zero-argument function returning a JSX element.
     */
    render: (template: () => any) => RenderResult;
}

interface SetupOptions {
    listType?: 'list' | 'grid';
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
export default function comboboxOptionTests({ Combobox, render }: ComboboxOptionTestSetup) {
    /**
     * Render a single Combobox.Option inside the minimal required context.
     * Returns the root <li> element, the action element (role="option" / role="gridcell"),
     * and the render result.
     */
    const setup = async ({
        listType,
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
                <Combobox.List aria-label="Fruits" type={listType}>
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
