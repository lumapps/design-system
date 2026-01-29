/* eslint-disable vue/one-component-per-file */
/* eslint-disable vue/require-prop-types */
import { defineComponent, h } from 'vue';
import { render, fireEvent } from '@testing-library/vue';
import { useDisableStateProps } from './useDisableStateProps';
import { provideDisabledState } from './useDisabledState';

describe('useDisableStateProps', () => {
    const testId = 'test-container';

    const ChildComponent = defineComponent({
        props: ['componentProps'],
        setup(props) {
            const { disabledStateProps } = useDisableStateProps(props.componentProps);
            return () => h('button', { 'data-testid': testId, ...disabledStateProps.value });
        },
    });

    const ParentComponent = defineComponent({
        props: ['componentProps', 'providerValue'],
        setup(props) {
            if (props.providerValue) {
                provideDisabledState(props.providerValue);
            }
            return () => h(ChildComponent, { componentProps: props.componentProps });
        },
    });

    const setup = (props: any, providerValue?: any) => {
        const renderResult = render(ParentComponent, {
            props: {
                componentProps: props,
                providerValue,
            },
        });
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
        const { element } = setup({}, { state: 'disabled' });
        expect(element).toHaveAttribute('disabled');
    });

    it('should prioritize context', () => {
        const { element } = setup({ disabled: false }, { state: 'disabled' });
        expect(element).toHaveAttribute('disabled');
        expect(element).toHaveAttribute('aria-disabled', 'false');
    });
});
