import { CLASSNAME as COMBOBOX_OPTION_CLASSNAME } from './ComboboxOption';
import { ComboboxNamespace } from './Tests';

type RenderResult = { unmount: () => void; container: HTMLElement };

/**
 * Options to set up the ComboboxOption test suite.
 * Injected by the framework-specific test file (React or Vue).
 */
export interface ComboboxOptionTestSetup {
    /** Combobox compound component namespace */
    Combobox: Pick<ComboboxNamespace, 'Provider' | 'List' | 'Option'>;
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
    const setup = ({
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
        // In standard list mode the action element carries role="option";
        // in grid mode it carries role="gridcell".
        const action = document.body.querySelector<HTMLElement>('[role="option"], [role="gridcell"]')!;
        // The root <li> is the closest list item ancestor of the action.
        const item = action?.closest('li') as HTMLElement;
        return { ...result, action, item };
    };

    describe('Combobox.Option', () => {
        // ── ARIA attributes ──────────────────────────────────────────────

        describe('ARIA attributes', () => {
            it('should render the action element with role="option"', () => {
                setup();
                expect(document.body.querySelector('[role="option"]')).toBeInTheDocument();
            });

            it('should set aria-selected="false" by default', () => {
                const { action } = setup();
                expect(action).toHaveAttribute('aria-selected', 'false');
            });

            it('should set aria-selected="true" when isSelected is true', () => {
                const { action } = setup({ isSelected: true });
                expect(action).toHaveAttribute('aria-selected', 'true');
            });

            it('should set aria-disabled="true" when isDisabled is true', () => {
                const { action } = setup({ isDisabled: true });
                expect(action).toHaveAttribute('aria-disabled', 'true');
            });

            it('should not set aria-disabled when isDisabled is false', () => {
                const { action } = setup({ isDisabled: false });
                expect(action).not.toHaveAttribute('aria-disabled');
            });

            it('should expose data-value matching the value prop on the action element', () => {
                const { action } = setup({ value: 'banana' });
                expect(action).toHaveAttribute('data-value', 'banana');
            });
        });

        // ── Description ──────────────────────────────────────────────────

        describe('Description', () => {
            it('should render a description block with the correct class and text', () => {
                setup({ description: 'A round red fruit' });
                const descEl = document.body.querySelector(`.${COMBOBOX_OPTION_CLASSNAME}__description`);
                expect(descEl).toBeInTheDocument();
                expect(descEl).toHaveTextContent('A round red fruit');
            });

            it('should link the action element to the description via aria-describedby', () => {
                const { action } = setup({ description: 'A round red fruit' });
                const descEl = document.body.querySelector(`.${COMBOBOX_OPTION_CLASSNAME}__description`);
                const describedBy = action.getAttribute('aria-describedby');
                expect(describedBy).toBeTruthy();
                expect(describedBy).toContain(descEl!.id);
            });

            it('should not render a description block when description is not set', () => {
                setup();
                expect(
                    document.body.querySelector(`.${COMBOBOX_OPTION_CLASSNAME}__description`),
                ).not.toBeInTheDocument();
            });
        });

        // ── Slots — before / after ───────────────────────────────────────

        describe('Slots — before / after', () => {
            it('should render before content', () => {
                setup({ before: <span data-testid="before-content">icon</span> });
                expect(document.body.querySelector('[data-testid="before-content"]')).toBeInTheDocument();
            });

            it('should render after content', () => {
                setup({ after: <span data-testid="after-content">badge</span> });
                expect(document.body.querySelector('[data-testid="after-content"]')).toBeInTheDocument();
            });
        });

        // ── Tooltip wrapping ─────────────────────────────────────────────

        describe('Tooltip wrapping', () => {
            it('should not render a tooltip when tooltipProps is omitted', () => {
                setup();
                // The tooltip popup is mounted with role="tooltip" (via Portal).
                expect(document.body.querySelector('[role="tooltip"]')).not.toBeInTheDocument();
            });

            it('should render a tooltip when tooltipProps is provided (forceOpen)', () => {
                setup({ tooltipProps: { label: 'Extra info', forceOpen: true } });
                expect(document.body.querySelector('[role="tooltip"]')).toBeInTheDocument();
            });
        });

        // ── Grid mode ────────────────────────────────────────────────────

        describe('Grid mode', () => {
            it('should render the action element with role="gridcell" inside a grid list', () => {
                const { action } = setup({ listType: 'grid' });
                expect(action).toHaveAttribute('role', 'gridcell');
            });

            it('should render the list item with role="row" inside a grid list', () => {
                const { item } = setup({ listType: 'grid' });
                expect(item).toHaveAttribute('role', 'row');
            });
        });
    });
}
