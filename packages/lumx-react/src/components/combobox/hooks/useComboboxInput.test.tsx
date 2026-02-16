import { render, act } from '@testing-library/react';
import { vi } from 'vitest';
import { useComboboxInput } from './useComboboxInput';
import { useComboboxTrigger } from './useComboboxTrigger';

vi.mock('./useComboboxTrigger');

describe('useComboboxInput', () => {
    const mockUseComboboxTrigger = vi.mocked(useComboboxTrigger);

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should call onClick when openOnFocus is true', () => {
        const onClick = vi.fn();
        const onKeyDown = vi.fn();
        const handleInputChange = vi.fn();

        mockUseComboboxTrigger.mockReturnValue({
            onClick,
            onKeyDown,
            'aria-expanded': false,
            id: 'combobox-1',
            role: 'combobox',
            'aria-activedescendant': '',
            'aria-controls': 'listbox-1',
            'aria-owns': 'listbox-1',
            onFocus: vi.fn(),
            onBlur: vi.fn(),
        });

        let result: any;
        const TestComponent = () => {
            result = useComboboxInput({
                context: {
                    openOnFocus: true,
                    openOnClick: false,
                    handleInputChange,
                } as any,
                refs: {} as any,
            });
            return null;
        };

        render(<TestComponent />);

        act(() => {
            result.onClick();
        });

        expect(onClick).toHaveBeenCalled();
    });

    it('should call onClick when openOnClick is true', () => {
        const onClick = vi.fn();
        const onKeyDown = vi.fn();
        const handleInputChange = vi.fn();

        mockUseComboboxTrigger.mockReturnValue({
            onClick,
            onKeyDown,
            'aria-expanded': false,
            id: 'combobox-1',
            role: 'combobox',
            'aria-activedescendant': '',
            'aria-controls': 'listbox-1',
            'aria-owns': 'listbox-1',
            onFocus: vi.fn(),
            onBlur: vi.fn(),
        });

        let result: any;
        const TestComponent = () => {
            result = useComboboxInput({
                context: {
                    openOnFocus: false,
                    openOnClick: true,
                    handleInputChange,
                } as any,
                refs: {} as any,
            });
            return null;
        };

        render(<TestComponent />);

        act(() => {
            result.onClick();
        });

        expect(onClick).toHaveBeenCalled();
    });

    it('should not call onClick when both openOnFocus and openOnClick are false', () => {
        const onClick = vi.fn();
        const onKeyDown = vi.fn();
        const handleInputChange = vi.fn();

        mockUseComboboxTrigger.mockReturnValue({
            onClick,
            onKeyDown,
            'aria-expanded': false,
            id: 'combobox-1',
            role: 'combobox',
            'aria-activedescendant': '',
            'aria-controls': 'listbox-1',
            'aria-owns': 'listbox-1',
            onFocus: vi.fn(),
            onBlur: vi.fn(),
        });

        let result: any;
        const TestComponent = () => {
            result = useComboboxInput({
                context: {
                    openOnFocus: false,
                    openOnClick: false,
                    handleInputChange,
                } as any,
                refs: {} as any,
            });
            return null;
        };

        render(<TestComponent />);

        act(() => {
            result.onClick();
        });

        expect(onClick).not.toHaveBeenCalled();
    });

    it('should reset field on Escape when closed', () => {
        const onClick = vi.fn();
        const onKeyDown = vi.fn();
        const handleInputChange = vi.fn();

        mockUseComboboxTrigger.mockReturnValue({
            onClick,
            onKeyDown,
            'aria-expanded': false,
            id: 'combobox-1',
            role: 'combobox',
            'aria-activedescendant': '',
            'aria-controls': 'listbox-1',
            'aria-owns': 'listbox-1',
            onFocus: vi.fn(),
            onBlur: vi.fn(),
        });

        let result: any;
        const TestComponent = () => {
            result = useComboboxInput({
                context: {
                    openOnFocus: true,
                    openOnClick: false,
                    handleInputChange,
                } as any,
                refs: {} as any,
            });
            return null;
        };

        render(<TestComponent />);

        const event = { key: 'Escape' } as React.KeyboardEvent;
        act(() => {
            result.onKeyDown(event);
        });

        expect(handleInputChange).toHaveBeenCalledWith('');
        expect(onKeyDown).not.toHaveBeenCalled();
    });

    it('should not reset field on Escape when open', () => {
        const onClick = vi.fn();
        const onKeyDown = vi.fn();
        const handleInputChange = vi.fn();

        mockUseComboboxTrigger.mockReturnValue({
            onClick,
            onKeyDown,
            'aria-expanded': true,
            id: 'combobox-1',
            role: 'combobox',
            'aria-activedescendant': '',
            'aria-controls': 'listbox-1',
            'aria-owns': 'listbox-1',
            onFocus: vi.fn(),
            onBlur: vi.fn(),
        });

        let result: any;
        const TestComponent = () => {
            result = useComboboxInput({
                context: {
                    openOnFocus: true,
                    openOnClick: false,
                    handleInputChange,
                } as any,
                refs: {} as any,
            });
            return null;
        };

        render(<TestComponent />);

        const event = { key: 'Escape' } as React.KeyboardEvent;
        act(() => {
            result.onKeyDown(event);
        });

        expect(handleInputChange).not.toHaveBeenCalled();
        expect(onKeyDown).not.toHaveBeenCalled();
    });

    it('should forward non-Escape key events', () => {
        const onClick = vi.fn();
        const onKeyDown = vi.fn();
        const handleInputChange = vi.fn();

        mockUseComboboxTrigger.mockReturnValue({
            onClick,
            onKeyDown,
            'aria-expanded': false,
            id: 'combobox-1',
            role: 'combobox',
            'aria-activedescendant': '',
            'aria-controls': 'listbox-1',
            'aria-owns': 'listbox-1',
            onFocus: vi.fn(),
            onBlur: vi.fn(),
        });

        let result: any;
        const TestComponent = () => {
            result = useComboboxInput({
                context: {
                    openOnFocus: true,
                    openOnClick: false,
                    handleInputChange,
                } as any,
                refs: {} as any,
            });
            return null;
        };

        render(<TestComponent />);

        const event = { key: 'Enter' } as React.KeyboardEvent;
        act(() => {
            result.onKeyDown(event);
        });

        expect(onKeyDown).toHaveBeenCalledWith(event);
        expect(handleInputChange).not.toHaveBeenCalled();
    });

    it('should call propsOnKeyDown after handling key event', () => {
        const onClick = vi.fn();
        const onKeyDown = vi.fn();
        const propsOnKeyDown = vi.fn();
        const handleInputChange = vi.fn();

        mockUseComboboxTrigger.mockReturnValue({
            onClick,
            onKeyDown,
            'aria-expanded': false,
            id: 'combobox-1',
            role: 'combobox',
            'aria-activedescendant': '',
            'aria-controls': 'listbox-1',
            'aria-owns': 'listbox-1',
            onFocus: vi.fn(),
            onBlur: vi.fn(),
        });

        let result: any;
        const TestComponent = () => {
            result = useComboboxInput({
                context: {
                    openOnFocus: true,
                    openOnClick: false,
                    handleInputChange,
                } as any,
                refs: {} as any,
                onKeyDown: propsOnKeyDown,
            });
            return null;
        };

        render(<TestComponent />);

        const event = { key: 'Enter' } as React.KeyboardEvent;
        act(() => {
            result.onKeyDown(event);
        });

        expect(onKeyDown).toHaveBeenCalledWith(event);
        expect(propsOnKeyDown).toHaveBeenCalledWith(event);
    });
});
