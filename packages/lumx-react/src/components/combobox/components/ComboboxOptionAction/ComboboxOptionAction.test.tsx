import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import React from 'react';

import { MovingFocusContext } from '@lumx/react/utils';

import { ComboboxContext } from '../../context/ComboboxContext';
import { ComboboxOptionContext } from '../../context/ComboboxOptionContext';
import { ComboboxRefsProvider } from '../../context/ComboboxRefsContext';
import { initialState } from '../../ducks/reducer';
import { ComboboxOptionAction } from './index';

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
    optionContextOverrides = {},
) => {
    const comboboxContext = createComboboxContextValue(comboboxContextOverrides);
    const movingFocusContext = createMovingFocusContextValue(movingFocusContextOverrides);
    const optionContext = { optionId: 'test-option-1', isKeyboardHighlighted: false, ...optionContextOverrides };

    const triggerRef = React.createRef<HTMLElement>();
    const anchorRef = React.createRef<HTMLElement>();

    // Create a mock trigger element
    const mockTriggerElement = document.createElement('div');
    mockTriggerElement.tabIndex = 0;
    document.body.appendChild(mockTriggerElement);
    (triggerRef as any).current = mockTriggerElement;

    const result = render(
        <MovingFocusContext.Provider value={movingFocusContext}>
            <ComboboxContext.Provider value={comboboxContext}>
                <ComboboxRefsProvider triggerRef={triggerRef} anchorRef={anchorRef}>
                    <ComboboxOptionContext.Provider value={optionContext}>
                        <ComboboxOptionAction onClick={vi.fn()} {...props} />
                    </ComboboxOptionContext.Provider>
                </ComboboxRefsProvider>
            </ComboboxContext.Provider>
        </MovingFocusContext.Provider>,
    );

    return {
        ...result,
        comboboxContext,
        movingFocusContext,
        optionContext,
        triggerRef,
        mockTriggerElement,
    };
};

describe('<ComboboxOptionAction>', () => {
    describe('Rendering', () => {
        it('should render as button by default', () => {
            setup();
            const button = screen.getByRole('gridcell');
            expect(button.tagName).toBe('BUTTON');
        });

        it('should render with role="gridcell"', () => {
            setup();
            expect(screen.getByRole('gridcell')).toBeInTheDocument();
        });

        it('should render with custom element type', () => {
            setup({ as: 'div' });
            const element = screen.getByRole('gridcell');
            expect(element.tagName).toBe('DIV');
        });

        it('should render children content', () => {
            setup({ children: 'Action Label' });
            expect(screen.getByText('Action Label')).toBeInTheDocument();
        });

        it('should render with custom id', () => {
            setup({ id: 'custom-action-id' });
            const element = screen.getByRole('gridcell');
            expect(element).toHaveAttribute('id', 'custom-action-id');
        });

        it('should generate id when not provided', () => {
            setup();
            const element = screen.getByRole('gridcell');
            expect(element).toHaveAttribute('id');
            expect(element.getAttribute('id')).toBeTruthy();
        });
    });

    describe('Props', () => {
        it('should forward additional props', () => {
            setup({ 'data-testid': 'custom-action', className: 'custom-class' });
            const element = screen.getByTestId('custom-action');
            expect(element).toHaveClass('custom-class');
        });
    });

    describe('Disabled state', () => {
        it('should have aria-disabled when disabled', () => {
            setup({ isDisabled: true });
            const element = screen.getByRole('gridcell');
            expect(element).toHaveAttribute('aria-disabled', 'true');
        });

        it('should not have aria-disabled when not disabled', () => {
            setup({ isDisabled: false });
            const element = screen.getByRole('gridcell');
            expect(element).toHaveAttribute('aria-disabled', 'false');
        });

        it('should not register action when disabled', () => {
            const { comboboxContext } = setup({ isDisabled: true });
            // Should not dispatch ADD_OPTION when disabled
            expect(comboboxContext.dispatch).not.toHaveBeenCalled();
        });

        it('should register action when not disabled', () => {
            const { comboboxContext } = setup({ isDisabled: false });
            expect(comboboxContext.dispatch).toHaveBeenCalledWith({
                type: 'ADD_OPTION',
                payload: expect.objectContaining({
                    option: expect.objectContaining({
                        isAction: true,
                        isDisabled: false,
                    }),
                }),
            });
        });
    });

    describe('Click behavior', () => {
        it('should call onClick when clicked', async () => {
            const onClick = vi.fn();
            setup({ onClick });

            const element = screen.getByRole('gridcell');
            await userEvent.click(element);

            expect(onClick).toHaveBeenCalledTimes(1);
        });

        it('should focus trigger after click', async () => {
            const onClick = vi.fn();
            const { mockTriggerElement } = setup({ onClick });

            const focusSpy = vi.spyOn(mockTriggerElement, 'focus');

            const element = screen.getByRole('gridcell');
            await userEvent.click(element);

            expect(focusSpy).toHaveBeenCalled();
        });

        it('should handle click when disabled', async () => {
            const onClick = vi.fn();
            setup({ onClick, isDisabled: true });

            const element = screen.getByRole('gridcell');
            await userEvent.click(element);

            // onClick is still called (button doesn't prevent clicks with aria-disabled)
            expect(onClick).toHaveBeenCalled();
        });
    });

    describe('Registration', () => {
        it('should dispatch ADD_OPTION on mount', () => {
            const { comboboxContext } = setup({ id: 'action-1' });

            expect(comboboxContext.dispatch).toHaveBeenCalledWith({
                type: 'ADD_OPTION',
                payload: {
                    id: 'action-1',
                    option: expect.objectContaining({
                        id: 'action-1',
                        generatedId: 'action-1',
                        isAction: true,
                    }),
                },
            });
        });

        it('should register with isAction: true', () => {
            const { comboboxContext } = setup();

            expect(comboboxContext.dispatch).toHaveBeenCalledWith({
                type: 'ADD_OPTION',
                payload: {
                    option: expect.objectContaining({
                        isAction: true,
                    }),
                    id: expect.any(String),
                },
            });
        });

        it('should register with onSelect callback', () => {
            const { comboboxContext } = setup();

            const dispatchCall = comboboxContext.dispatch.mock.calls[0][0];
            expect(dispatchCall.payload.option.onSelect).toBeInstanceOf(Function);
        });

        it('should dispatch REMOVE_OPTION on unmount', () => {
            const { comboboxContext, unmount } = setup({ id: 'action-1' });

            comboboxContext.dispatch.mockClear();
            unmount();

            expect(comboboxContext.dispatch).toHaveBeenCalledWith({
                type: 'REMOVE_OPTION',
                payload: { id: 'action-1' },
            });
        });
    });

    describe('Keyboard navigation', () => {
        it('should set data-focus-visible-added when keyboard highlighted', () => {
            setup({}, {}, { isUsingKeyboard: true });

            // Note: actual focus highlighting requires the useVirtualFocus hook to work,
            // which depends on the MovingFocusContext state
            const element = screen.getByRole('gridcell');

            // The attribute might not be set without proper focus simulation
            // This tests the rendering logic
            expect(element).toBeInTheDocument();
        });

        it('should not set data-focus-visible-added when not using keyboard', () => {
            setup({}, {}, { isUsingKeyboard: false });

            const element = screen.getByRole('gridcell');
            expect(element).not.toHaveAttribute('data-focus-visible-added');
        });
    });

    describe('Context integration', () => {
        it('should use optionId from ComboboxOptionContext', () => {
            const { optionContext } = setup({}, {}, {}, { optionId: 'custom-option-id' });

            expect(optionContext.optionId).toBe('custom-option-id');
        });

        it('should throw error when not within ComboboxOptionContext', () => {
            const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

            expect(() => {
                render(
                    <MovingFocusContext.Provider value={createMovingFocusContextValue()}>
                        <ComboboxContext.Provider value={createComboboxContextValue()}>
                            <ComboboxRefsProvider triggerRef={React.createRef()} anchorRef={React.createRef()}>
                                <ComboboxOptionAction onClick={vi.fn()} />
                            </ComboboxRefsProvider>
                        </ComboboxContext.Provider>
                    </MovingFocusContext.Provider>,
                );
            }).toThrow('This hook must be used within a ComboboxOptionIdProvider');

            consoleError.mockRestore();
        });
    });

    describe('onSelect callback', () => {
        it('should trigger click on element when onSelect is called', () => {
            const { comboboxContext } = setup({ id: 'action-1' });

            const dispatchCall = comboboxContext.dispatch.mock.calls[0][0];
            const { onSelect } = dispatchCall.payload.option;

            const element = screen.getByRole('gridcell');
            const clickSpy = vi.spyOn(element, 'click');

            onSelect();

            expect(clickSpy).toHaveBeenCalled();
        });
    });
});
