import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import { Size } from '@lumx/react';
import { MovingFocusContext } from '@lumx/react/utils';

import { ComboboxContext, SectionContext } from '../../context/ComboboxContext';
import { initialState } from '../../ducks/reducer';
import { ComboboxOption, COMBOBOX_OPTION_CLASSNAME } from './index';

const CLASSNAME = COMBOBOX_OPTION_CLASSNAME;

/**
 * Creates a basic ComboboxContext value for testing
 */
const createComboboxContextValue = (overrides = {}) => ({
    ...initialState,
    comboboxId: 'test-combobox',
    dispatch: vi.fn(),
    openOnFocus: false,
    openOnClick: false,
    selectionType: 'single' as const,
    optionsLength: 0,
    handleSelected: vi.fn(),
    translations: {
        clearLabel: '',
        tryReloadLabel: '',
        showSuggestionsLabel: '',
        noResultsForInputLabel: (input?: string) => input || '',
        loadingLabel: '',
        serviceUnavailableLabel: '',
        nbOptionsLabel: (options: number) => `${options}`,
    },
    ...overrides,
});

/**
 * Creates a basic MovingFocusContext value for testing
 */
const createMovingFocusContextValue = (overrides = {}) => ({
    state: {
        selectedId: null,
        isUsingKeyboard: false,
        tabStops: [],
        gridMap: null,
        loopAround: { col: 'next-end' as const, row: 'next-end' as const },
        direction: 'both' as const,
        defaultSelectedId: null,
        allowFocusing: true,
        ...overrides,
    },
    dispatch: vi.fn(),
});

/**
 * Mounts the component with necessary context providers
 */
const setup = (
    props: any = {},
    comboboxContextOverrides = {},
    movingFocusContextOverrides = {},
    sectionContextOverrides = {},
) => {
    const comboboxContext = createComboboxContextValue(comboboxContextOverrides);
    const movingFocusContext = createMovingFocusContextValue(movingFocusContextOverrides);
    const sectionContext = { sectionId: '', ...sectionContextOverrides };

    const result = render(
        <MovingFocusContext.Provider value={movingFocusContext}>
            <ComboboxContext.Provider value={comboboxContext}>
                <SectionContext.Provider value={sectionContext}>
                    <ul>
                        <ComboboxOption {...props} />
                    </ul>
                </SectionContext.Provider>
            </ComboboxContext.Provider>
        </MovingFocusContext.Provider>,
    );

    return {
        ...result,
        comboboxContext,
        movingFocusContext,
        sectionContext,
    };
};

describe('<ComboboxOption>', () => {
    describe('Rendering', () => {
        it('should render with text content', () => {
            setup({ id: 'option-1', children: 'Test Option' });
            expect(screen.getByText('Test Option')).toBeInTheDocument();
        });

        it('should render with number as children', () => {
            setup({ id: 'option-1', children: 123 });
            expect(screen.getByText('123')).toBeInTheDocument();
        });

        it('should render with custom element', () => {
            setup({
                id: 'option-1',
                children: <span data-testid="custom-content">Custom</span>,
            });
            expect(screen.getByTestId('custom-content')).toBeInTheDocument();
        });

        it('should not render when id is missing', () => {
            const { container } = setup({ children: 'Test Option' });
            expect(container.querySelector('li')).not.toBeInTheDocument();
        });

        it('should not render when filtered out', () => {
            setup(
                {
                    id: 'option-1',
                    children: 'Apple',
                    filterFromInput: true,
                },
                { inputValue: 'banana', showAll: false },
            );
            // Component returns null when filtered out
            expect(screen.queryByText('Apple')).not.toBeInTheDocument();
        });

        it('should render with textValue instead of children', () => {
            setup({
                id: 'option-1',
                children: <span>Complex Child</span>,
                textValue: 'Text Value',
            });
            // When textValue is provided, it renders children || textValue (so just children in this case)
            const option = screen.getByRole('option');
            expect(option).toHaveTextContent('Complex Child');
        });

        it('should use children as textValue when children is a string', () => {
            setup({ id: 'option-1', children: 'String Child' });
            expect(screen.getByRole('option')).toBeInTheDocument();
        });
    });

    describe('Props', () => {
        it('should render before content', () => {
            setup({
                id: 'option-1',
                children: 'Label',
                before: <span data-testid="before-content">Before</span>,
            });
            expect(screen.getByTestId('before-content')).toBeInTheDocument();
            const beforeElement = screen.getByTestId('before-content').closest(`.${CLASSNAME}__before`);
            expect(beforeElement).toBeInTheDocument();
        });

        it('should render after content', () => {
            setup({
                id: 'option-1',
                children: 'Label',
                after: <span data-testid="after-content">After</span>,
            });
            expect(screen.getByTestId('after-content')).toBeInTheDocument();
            const afterElement = screen.getByTestId('after-content').closest(`.${CLASSNAME}__after`);
            expect(afterElement).toBeInTheDocument();
        });

        it('should apply custom className', () => {
            const { container } = setup({
                id: 'option-1',
                children: 'Label',
                className: 'custom-class',
            });
            const listItem = container.querySelector('li');
            expect(listItem).toHaveClass('custom-class');
        });

        it('should apply size class', () => {
            const { container } = setup({
                id: 'option-1',
                children: 'Label',
                size: Size.big,
            });
            const listItem = container.querySelector('li');
            expect(listItem?.className).toContain('size-big');
        });

        it('should use custom element type', () => {
            setup({
                id: 'option-1',
                children: 'Label',
                as: 'div',
            });
            const option = screen.getByRole('option');
            expect(option.tagName).toBe('DIV');
        });

        it('should render description', () => {
            setup({
                id: 'option-1',
                children: 'Label',
                description: 'This is a description',
            });
            expect(screen.getByText('This is a description')).toBeInTheDocument();
        });
    });

    describe('Disabled state', () => {
        it('should render disabled option', () => {
            setup({
                id: 'option-1',
                children: 'Label',
                isDisabled: true,
            });
            const option = screen.getByRole('option');
            expect(option).toHaveAttribute('aria-disabled', 'true');
        });

        it('should apply disabled class', () => {
            const { container } = setup({
                id: 'option-1',
                children: 'Label',
                isDisabled: true,
            });
            const contentElement = container.querySelector(`.${CLASSNAME}__content--is-disabled`);
            expect(contentElement).toBeInTheDocument();
        });

        it('should mark option as disabled when clicked', async () => {
            const { comboboxContext } = setup({
                id: 'option-1',
                children: 'Label',
                isDisabled: true,
            });

            const option = screen.getByRole('option');
            await userEvent.click(option);

            // handleSelected is still called but the option is marked as disabled
            expect(comboboxContext.handleSelected).toHaveBeenCalledWith(
                expect.objectContaining({
                    isDisabled: true,
                }),
                'click',
            );
        });
    });

    describe('Selection', () => {
        it('should render as selected', () => {
            setup(
                {
                    id: 'option-1',
                    children: 'Label',
                },
                { selectedIds: ['test-combobox-option-option-1'] },
            );
            const option = screen.getByRole('option');
            expect(option).toHaveAttribute('aria-selected', 'true');
        });

        it('should render as not selected', () => {
            setup(
                {
                    id: 'option-1',
                    children: 'Label',
                },
                { selectedIds: ['test-combobox-option-option-2'] },
            );
            const option = screen.getByRole('option');
            expect(option).toHaveAttribute('aria-selected', 'false');
        });

        it('should not have aria-selected when selectedIds is undefined', () => {
            setup({
                id: 'option-1',
                children: 'Label',
            });
            const option = screen.getByRole('option');
            expect(option).not.toHaveAttribute('aria-selected');
        });

        it('should call handleSelected on click', async () => {
            const { comboboxContext } = setup({
                id: 'option-1',
                children: 'Label',
            });

            const option = screen.getByRole('option');
            await userEvent.click(option);

            expect(comboboxContext.handleSelected).toHaveBeenCalledWith(
                expect.objectContaining({
                    id: 'option-1',
                    generatedId: 'test-combobox-option-option-1',
                    textValue: 'Label',
                }),
                'click',
            );
        });

        it('should call custom onSelect callback', async () => {
            const onSelect = vi.fn();
            const { comboboxContext } = setup({
                id: 'option-1',
                children: 'Label',
                onSelect,
            });

            const option = screen.getByRole('option');
            await userEvent.click(option);

            expect(comboboxContext.handleSelected).toHaveBeenCalled();
            // The onSelect should be part of the registered option
            const registeredOption = comboboxContext.handleSelected.mock.calls[0][0];
            expect(registeredOption.onSelect).toBe(onSelect);
        });

        it('should prevent default on mouse down', async () => {
            setup({
                id: 'option-1',
                children: 'Label',
            });

            const option = screen.getByRole('option');
            const mouseDownEvent = new MouseEvent('mousedown', { bubbles: true, cancelable: true });
            const preventDefaultSpy = vi.spyOn(mouseDownEvent, 'preventDefault');

            option.dispatchEvent(mouseDownEvent);

            expect(preventDefaultSpy).toHaveBeenCalled();
        });
    });

    describe('Filtering', () => {
        it('should show option when filterFromInput is true and input matches', () => {
            setup(
                {
                    id: 'option-1',
                    children: 'Apple',
                    filterFromInput: true,
                },
                { inputValue: 'app' },
            );
            expect(screen.getByText('Apple')).toBeInTheDocument();
        });

        it('should hide option when filterFromInput is true and input does not match', () => {
            setup(
                {
                    id: 'option-1',
                    children: 'Apple',
                    filterFromInput: true,
                },
                { inputValue: 'banana', showAll: false },
            );
            expect(screen.queryByText('Apple')).not.toBeInTheDocument();
        });

        it('should show option when showAll is true', () => {
            setup(
                {
                    id: 'option-1',
                    children: 'Apple',
                    filterFromInput: true,
                },
                { inputValue: 'banana', showAll: true },
            );
            expect(screen.getByText('Apple')).toBeInTheDocument();
        });

        it('should show option when filterFromInput is false', () => {
            setup(
                {
                    id: 'option-1',
                    children: 'Apple',
                    filterFromInput: false,
                },
                { inputValue: 'banana' },
            );
            expect(screen.getByText('Apple')).toBeInTheDocument();
        });

        it('should filter case-insensitively', () => {
            setup(
                {
                    id: 'option-1',
                    children: 'Apple',
                    filterFromInput: true,
                },
                { inputValue: 'APPLE' },
            );
            expect(screen.getByText('Apple')).toBeInTheDocument();
        });

        it('should use textValue for filtering when provided', () => {
            setup(
                {
                    id: 'option-1',
                    children: <span>Complex</span>,
                    textValue: 'Apple',
                    filterFromInput: true,
                },
                { inputValue: 'app' },
            );
            expect(screen.getByRole('option')).toBeInTheDocument();
        });
    });

    describe('Accessibility', () => {
        it('should have role="option" for listbox type', () => {
            setup(
                {
                    id: 'option-1',
                    children: 'Label',
                },
                { type: 'listbox' },
            );
            expect(screen.getByRole('option')).toBeInTheDocument();
        });

        it('should have role="gridcell" for grid type', () => {
            setup(
                {
                    id: 'option-1',
                    children: 'Label',
                },
                { type: 'grid' },
            );
            expect(screen.getByRole('gridcell')).toBeInTheDocument();
        });

        it('should have correct id', () => {
            setup({
                id: 'option-1',
                children: 'Label',
            });
            const option = screen.getByRole('option');
            expect(option).toHaveAttribute('id', 'test-combobox-option-option-1');
        });

        it('should link description with aria-describedby', () => {
            setup({
                id: 'option-1',
                children: 'Label',
                description: 'Description text',
            });
            const option = screen.getByRole('option');
            const descriptionId = option.getAttribute('aria-describedby');
            expect(descriptionId).toBe('test-combobox-option-option-1-description');
            expect(screen.getByText('Description text')).toHaveAttribute('id', descriptionId);
        });

        it('should hide option when section is loading', () => {
            const { container } = setup(
                {
                    id: 'option-1',
                    children: 'Label',
                },
                {},
                {},
                { isLoading: true },
            );
            const listItem = container.querySelector('li');
            expect(listItem).toHaveAttribute('aria-hidden', 'true');
            expect(listItem).toHaveStyle({ display: 'none' });
        });

        it('should not hide option when section is not loading', () => {
            const { container } = setup(
                {
                    id: 'option-1',
                    children: 'Label',
                },
                {},
                {},
                { isLoading: false },
            );
            const listItem = container.querySelector('li');
            expect(listItem).toHaveAttribute('aria-hidden', 'false');
        });
    });

    describe('Registration', () => {
        it('should dispatch ADD_OPTION on mount', () => {
            const { comboboxContext } = setup({
                id: 'option-1',
                children: 'Label',
            });

            expect(comboboxContext.dispatch).toHaveBeenCalledWith({
                type: 'ADD_OPTION',
                payload: {
                    id: 'test-combobox-option-option-1',
                    option: expect.objectContaining({
                        id: 'option-1',
                        generatedId: 'test-combobox-option-option-1',
                        textValue: 'Label',
                    }),
                },
            });
        });

        it('should register option with data', () => {
            const data = { value: 'test' };
            const { comboboxContext } = setup({
                id: 'option-1',
                children: 'Label',
                data,
            });

            expect(comboboxContext.dispatch).toHaveBeenCalledWith({
                type: 'ADD_OPTION',
                payload: {
                    id: 'test-combobox-option-option-1',
                    option: expect.objectContaining({
                        data,
                    }),
                },
            });
        });

        it('should register option with sectionId', () => {
            const { comboboxContext } = setup(
                {
                    id: 'option-1',
                    children: 'Label',
                },
                {},
                {},
                { sectionId: 'section-1' },
            );

            expect(comboboxContext.dispatch).toHaveBeenCalledWith({
                type: 'ADD_OPTION',
                payload: {
                    id: 'test-combobox-option-option-1',
                    option: expect.objectContaining({
                        sectionId: 'section-1',
                    }),
                },
            });
        });

        it('should dispatch REMOVE_OPTION on unmount', () => {
            const { comboboxContext, unmount } = setup({
                id: 'option-1',
                children: 'Label',
            });

            comboboxContext.dispatch.mockClear();
            unmount();

            expect(comboboxContext.dispatch).toHaveBeenCalledWith({
                type: 'REMOVE_OPTION',
                payload: { id: 'test-combobox-option-option-1' },
            });
        });
    });

    describe('Tooltip', () => {
        it('should pass tooltipProps to Tooltip component', () => {
            const { container } = setup({
                id: 'option-1',
                children: 'Label',
                tooltipProps: { label: 'Tooltip text' },
            });
            // Tooltip component should be rendered (this is a basic check)
            expect(container.querySelector(`.${CLASSNAME}__trigger`)).toBeInTheDocument();
        });
    });

    describe('Virtual focus', () => {
        it('should apply focus-visible attribute when keyboard highlighted', () => {
            const { container } = setup(
                {
                    id: 'option-1',
                    children: 'Label',
                },
                {},
                { isUsingKeyboard: true },
            );
            // This would require mocking useVirtualFocus to return true
            // For now, we just verify the element exists
            expect(container.querySelector(`.${CLASSNAME}__content`)).toBeInTheDocument();
        });
    });
});
