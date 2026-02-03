import { h } from 'vue';
import { render, screen, fireEvent } from '@testing-library/vue';
import { describe, it, expect, vi } from 'vitest';
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

    it('should map class prop to className when default slot is present', () => {
        const MockComponent = (props: { className?: string; children?: any }) =>
            h('div', { 'data-testid': 'mock', class: props.className }, props.children);
        const WrappedComponent = VueToJSX(MockComponent);

        render(WrappedComponent, {
            props: { class: 'test-class' },
            slots: { default: 'Content' },
        });

        const element = screen.getByTestId('mock');
        expect(element).toHaveClass('test-class');
    });

    it('should map class prop to className when no slots are present', () => {
        const MockComponent = (props: { className?: string }) =>
            h('div', { 'data-testid': 'mock', class: props.className });
        const WrappedComponent = VueToJSX(MockComponent);

        render(WrappedComponent, {
            props: { class: 'test-class' },
        });

        const element = screen.getByTestId('mock');
        expect(element).toHaveClass('test-class');
    });

    it('should generate event handlers based on events prop', async () => {
        const MockComponent = (props: { onClick?: any; onFocus?: any }) =>
            h('div', {
                'data-testid': 'mock',
                onClick: props.onClick,
                onFocus: props.onFocus
            });

        const emitSpy = vi.fn();
        const WrappedComponent = VueToJSX(
            MockComponent,
            { emit: emitSpy, events: ['click', 'focus'] }
        );

        render(WrappedComponent);
        const element = screen.getByTestId('mock');

        await fireEvent.click(element);
        expect(emitSpy).toHaveBeenCalledWith('click', expect.anything());

        await fireEvent.focus(element);
        expect(emitSpy).toHaveBeenCalledWith('focus', expect.anything());
    });

    it('should not generate handlers if events list is not provided', () => {
        const MockComponent = vi.fn((_props: any) => h('div'));
        const WrappedComponent = VueToJSX(MockComponent);

        render(WrappedComponent);

        // Check the props passed to MockComponent
        // MockComponent is a functional component, so it receives props as first arg
        const props = MockComponent.mock.calls[0][0] as any;
        expect(props).not.toHaveProperty('onClick');
    });

    it('should handle options with only emit but no events', () => {
        const MockComponent = vi.fn((_props: any) => h('div'));
        const emitSpy = vi.fn();
        const WrappedComponent = VueToJSX(MockComponent, { emit: emitSpy });

        render(WrappedComponent);

        const props = MockComponent.mock.calls[0][0] as any;
        expect(props).not.toHaveProperty('onClick');
    });

    it('should handle undefined options gracefully', () => {
        const MockComponent = vi.fn((_props: any) => h('div'));
        const WrappedComponent = VueToJSX(MockComponent, undefined);

        render(WrappedComponent);

        const props = MockComponent.mock.calls[0][0] as any;
        expect(props).not.toHaveProperty('onClick');
    });

    it('should handle options with events but no emit', () => {
        const MockComponent = vi.fn((_props: any) => h('div'));
        const WrappedComponent = VueToJSX(MockComponent, { events: ['click'] });

        render(WrappedComponent);

        const props = MockComponent.mock.calls[0][0] as any;
        // Should have onClick handler, but it won't emit anything since emit is undefined
        expect(props).toHaveProperty('onClick');
    });
});