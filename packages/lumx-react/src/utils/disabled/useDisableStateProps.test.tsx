import React from 'react';

import { fireEvent, render } from '@testing-library/react';
import { DisabledStateProvider } from './DisabledStateContext';
import { useDisableStateProps } from './useDisableStateProps';

describe(useDisableStateProps.name, () => {
    const setup = (props: any, wrapper?: React.ComponentType) => {
        const testId = 'test-container';
        const Component = () => {
            const { disabledStateProps, otherProps } = useDisableStateProps(props);
            return <div data-testid={testId} {...otherProps} {...disabledStateProps} />;
        };
        const renderResult = render(wrapper ? React.createElement(wrapper, undefined, <Component />) : <Component />);
        return { ...renderResult, element: renderResult.getByTestId(testId) };
    };

    it('should not be disabled by default', () => {
        const { element } = setup({});
        expect(element).not.toHaveAttribute('disabled');
        expect(element).toHaveAttribute('aria-disabled', 'false');
    });

    it('should be disabled with `disabled` prop', () => {
        const { element } = setup({ disabled: true });
        expect(element).toHaveAttribute('disabled');
    });

    it('should be disabled with `isDisabled` prop', () => {
        const { element } = setup({ isDisabled: true });
        expect(element).toHaveAttribute('disabled');
    });

    it('should be disabled with `aria-disabled` prop', () => {
        const { element } = setup({ 'aria-disabled': true });
        expect(element).toHaveAttribute('aria-disabled', 'true');
    });

    it('should be disabled with `aria-disabled` string prop', () => {
        const { element } = setup({ 'aria-disabled': 'true' });
        expect(element).toHaveAttribute('aria-disabled', 'true');
    });

    it('should be disabled with context', () => {
        const wrapper = ({ children }: any) => (
            <DisabledStateProvider state="disabled">{children}</DisabledStateProvider>
        );
        const { element } = setup({}, wrapper);
        expect(element).toHaveAttribute('disabled');
    });

    it('should prioritize context', () => {
        const wrapper = ({ children }: any) => (
            <DisabledStateProvider state="disabled">{children}</DisabledStateProvider>
        );
        const { element } = setup({ disabled: false }, wrapper);
        expect(element).toHaveAttribute('disabled');
        expect(element).toHaveAttribute('aria-disabled', 'false');
    });

    it('should forward onClick when not disabled', () => {
        const onClick = vi.fn();
        const { element } = setup({ onClick });
        fireEvent.click(element);
        expect(onClick).toHaveBeenCalled();
    });

    it('should not forward onClick when disabled', () => {
        const onClick = vi.fn();
        const { element } = setup({ disabled: true, onClick });
        fireEvent.click(element);
        expect(onClick).not.toHaveBeenCalled();
    });
});
