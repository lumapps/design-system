import { h } from 'vue';
import { render, screen } from '@testing-library/vue';
import { describe, it, expect } from 'vitest';
import { VueToJSX } from './VueToJSX';

describe('VueToJSX', () => {
    it('should render the wrapped component and pass props', () => {
        const MockComponent = (props: { testProp?: string }) => h('div', { 'data-testid': 'mock' }, props.testProp);
        const WrappedComponent = VueToJSX(MockComponent);

        render(WrappedComponent, { props: { testProp: 'hello' } });

        const element = screen.getByTestId('mock');
        expect(element).toBeInTheDocument();
        expect(element).toHaveTextContent('hello');
    });

    it('should pass default slot as children prop', () => {
        const MockComponent = (props: { children?: any }) => h('div', { 'data-testid': 'mock' }, props.children);
        const WrappedComponent = VueToJSX(MockComponent);

        render(WrappedComponent, {
            slots: {
                default: 'Slot Content',
            },
        });

        const element = screen.getByTestId('mock');
        expect(element).toHaveTextContent('Slot Content');
    });

    it('should pass props and children together', () => {
        const MockComponent = (props: { label: string; children?: any }) =>
            h('div', { 'data-testid': 'mock' }, [props.label, props.children]);
        const WrappedComponent = VueToJSX(MockComponent);

        render(WrappedComponent, {
            props: { label: 'Label: ' },
            slots: {
                default: 'Content',
            },
        });

        const element = screen.getByTestId('mock');
        expect(element).toHaveTextContent('Label: Content');
    });
});
