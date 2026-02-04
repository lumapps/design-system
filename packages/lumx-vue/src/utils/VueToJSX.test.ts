/* eslint-disable @typescript-eslint/no-unused-vars */
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
                onFocus: props.onFocus,
            });

        const emitSpy = vi.fn();
        const WrappedComponent = VueToJSX(MockComponent, { emit: emitSpy, events: ['click', 'focus'] });

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

    it('should pass nestedComponents as second argument to component', () => {
        const MockText = vi.fn((props: any) => {
            const { children, ...restProps } = props || {};
            return h('span', restProps, children || 'Mock Text');
        });
        const MockComponent = vi.fn((props: any, nestedComponents: any) => {
            const { Text } = nestedComponents || {};
            return h('div', { 'data-testid': 'mock' }, Text ? Text({ children: 'Nested' }) : 'No Text');
        });

        const WrappedComponent = VueToJSX(MockComponent, { nestedComponents: { Text: MockText } });

        render(WrappedComponent);

        // Verify MockComponent received nestedComponents as second argument
        expect(MockComponent.mock.calls[0][1]).toEqual({ Text: MockText });
        // Verify the component used the nested Text component
        expect(MockText).toHaveBeenCalled();
    });

    it('should work without nestedComponents', () => {
        const MockComponent = vi.fn((props: any, nestedComponents: any) => {
            return h('div', { 'data-testid': 'mock' }, nestedComponents ? 'Has nested' : 'No nested');
        });

        const WrappedComponent = VueToJSX(MockComponent);

        render(WrappedComponent);

        const element = screen.getByTestId('mock');
        expect(element).toHaveTextContent('No nested');
        expect(MockComponent.mock.calls[0][1]).toBeUndefined();
    });

    it('should pass nestedComponents with default slot', () => {
        const MockText = (props: any) => {
            const { children, ...restProps } = props || {};
            return h('span', restProps, children);
        };
        const MockComponent = vi.fn((props: any, nestedComponents: any) => {
            const { Text } = nestedComponents || {};
            return h('div', { 'data-testid': 'mock' }, [Text ? Text({ children: 'Label: ' }) : null, props.children]);
        });

        const WrappedComponent = VueToJSX(MockComponent, { nestedComponents: { Text: MockText } });

        render(WrappedComponent, {
            slots: {
                default: 'Content',
            },
        });

        const element = screen.getByTestId('mock');
        expect(element).toHaveTextContent('Label: Content');
        expect(MockComponent.mock.calls[0][1]).toEqual({ Text: MockText });
    });

    it('should pass multiple nested components', () => {
        const MockText = (props: any) => h('span', { class: 'text' }, props.children);
        const MockIcon = (props: any) => h('i', { class: 'icon' }, props.icon);
        const MockComponent = vi.fn((props: any, nestedComponents: any) => {
            const { Text, Icon } = nestedComponents || {};
            return h('div', { 'data-testid': 'mock' }, [
                Icon ? Icon({ icon: 'star' }) : null,
                Text ? Text({ children: 'Label' }) : null,
            ]);
        });

        const WrappedComponent = VueToJSX(MockComponent, {
            nestedComponents: { Text: MockText, Icon: MockIcon },
        });

        render(WrappedComponent);

        expect(MockComponent.mock.calls[0][1]).toEqual({ Text: MockText, Icon: MockIcon });
        expect(screen.getByTestId('mock').querySelector('.text')).toBeInTheDocument();
        expect(screen.getByTestId('mock').querySelector('.icon')).toBeInTheDocument();
    });

    it('should work with nestedComponents and events together', async () => {
        const MockText = (props: any) => {
            const { children, ...restProps } = props || {};
            return h('span', restProps, children);
        };
        const MockComponent = (props: any, nestedComponents: any) => {
            const { Text } = nestedComponents || {};
            return h(
                'button',
                {
                    'data-testid': 'mock',
                    onClick: props.onClick,
                },
                Text ? Text({ children: 'Click me' }) : 'Button',
            );
        };

        const emitSpy = vi.fn();
        const WrappedComponent = VueToJSX(MockComponent, {
            emit: emitSpy,
            events: ['click'],
            nestedComponents: { Text: MockText },
        });

        render(WrappedComponent);

        const element = screen.getByTestId('mock');
        expect(element).toHaveTextContent('Click me');

        await fireEvent.click(element);
        expect(emitSpy).toHaveBeenCalledWith('click', expect.anything());
    });

    it('should handle event handlers with multiple arguments', async () => {
        const MockComponent = (props: { onChange?: any }) =>
            h('input', {
                'data-testid': 'mock',
                onChange: () => props.onChange?.('value1', 'value2', 123),
            });

        const emitSpy = vi.fn();
        const WrappedComponent = VueToJSX(MockComponent, { emit: emitSpy, events: ['change'] });

        render(WrappedComponent);
        const element = screen.getByTestId('mock');

        await fireEvent.change(element);
        expect(emitSpy).toHaveBeenCalledWith('change', 'value1', 'value2', 123);
    });

    it('should spread all arguments when emitting events', async () => {
        const MockComponent = (props: { onClick?: (...args: any[]) => void }) =>
            h('button', {
                'data-testid': 'mock',
                onClick: (event: Event) => {
                    // Simulate a component that passes the event plus additional data
                    props.onClick?.(event, { id: 'item-1', value: 42 }, 'extra-data');
                },
            });

        const emitSpy = vi.fn();
        const WrappedComponent = VueToJSX(MockComponent, { emit: emitSpy, events: ['click'] });

        render(WrappedComponent);
        const element = screen.getByTestId('mock');

        await fireEvent.click(element);

        // Verify emit was called with event name and all spread arguments
        expect(emitSpy).toHaveBeenCalledTimes(1);
        expect(emitSpy).toHaveBeenCalledWith(
            'click',
            expect.any(Object), // the event object
            { id: 'item-1', value: 42 },
            'extra-data',
        );
    });

    it('should handle zero arguments in event handlers', async () => {
        const MockComponent = (props: { onClick?: () => void }) =>
            h('button', {
                'data-testid': 'mock',
                onClick: () => props.onClick?.(),
            });

        const emitSpy = vi.fn();
        const WrappedComponent = VueToJSX(MockComponent, { emit: emitSpy, events: ['click'] });

        render(WrappedComponent);
        const element = screen.getByTestId('mock');

        await fireEvent.click(element);
        // Should emit with just the event name, no additional arguments
        expect(emitSpy).toHaveBeenCalledWith('click');
    });

    it('should correctly capitalize event names for handler props', async () => {
        const MockComponent = (props: { onCustomEvent?: any; onFocusIn?: any }) =>
            h('div', {
                'data-testid': 'mock',
                onClick: () => {
                    props.onCustomEvent?.();
                    props.onFocusIn?.();
                },
            });

        const emitSpy = vi.fn();
        const WrappedComponent = VueToJSX(MockComponent, {
            emit: emitSpy,
            events: ['customEvent', 'focusIn'],
        });

        render(WrappedComponent);
        const element = screen.getByTestId('mock');

        await fireEvent.click(element);
        expect(emitSpy).toHaveBeenCalledWith('customEvent');
        expect(emitSpy).toHaveBeenCalledWith('focusIn');
    });

    it('should handle complex slot content with VNodes', () => {
        const MockComponent = (props: { children?: any }) => h('div', { 'data-testid': 'mock' }, props.children);
        const WrappedComponent = VueToJSX(MockComponent);

        render(WrappedComponent, {
            slots: {
                default: () => h('span', { 'data-testid': 'nested' }, 'Nested VNode'),
            },
        });

        const element = screen.getByTestId('mock');
        const nested = screen.getByTestId('nested');
        expect(element).toBeInTheDocument();
        expect(nested).toBeInTheDocument();
        expect(nested).toHaveTextContent('Nested VNode');
    });

    it('should not mutate original props', () => {
        const MockComponent = vi.fn((props: any) => h('div', props));
        const WrappedComponent = VueToJSX(MockComponent);

        const originalProps = { testProp: 'value', class: 'test-class' };
        render(WrappedComponent, { props: originalProps });

        // Original props should remain unchanged
        expect(originalProps).toEqual({ testProp: 'value', class: 'test-class' });
        expect(originalProps).not.toHaveProperty('className');
    });

    it('should handle empty class string', () => {
        const MockComponent = (props: { className?: string }) =>
            h('div', { 'data-testid': 'mock', class: props.className });
        const WrappedComponent = VueToJSX(MockComponent);

        render(WrappedComponent, { props: { class: '' } });

        const element = screen.getByTestId('mock');
        expect(element).toBeInTheDocument();
        expect(element.className).toBe('');
    });

    it('should preserve other props when mapping className', () => {
        const MockComponent = (props: { className?: string; id?: string; 'data-custom'?: string }) =>
            h('div', {
                'data-testid': 'mock',
                class: props.className,
                id: props.id,
                'data-custom': props['data-custom'],
            });
        const WrappedComponent = VueToJSX(MockComponent);

        render(WrappedComponent, {
            props: { class: 'test-class', id: 'test-id', 'data-custom': 'custom-value' },
        });

        const element = screen.getByTestId('mock');
        expect(element).toHaveClass('test-class');
        expect(element).toHaveAttribute('id', 'test-id');
        expect(element).toHaveAttribute('data-custom', 'custom-value');
    });

    it('should handle single character event names', async () => {
        const MockComponent = (props: { onX?: any }) =>
            h('div', {
                'data-testid': 'mock',
                onClick: props.onX,
            });

        const emitSpy = vi.fn();
        const WrappedComponent = VueToJSX(MockComponent, { emit: emitSpy, events: ['x'] });

        render(WrappedComponent);
        const element = screen.getByTestId('mock');

        await fireEvent.click(element);
        expect(emitSpy).toHaveBeenCalledWith('x', expect.anything());
    });

    it('should work with multiple slots by using only default slot', () => {
        const MockComponent = (props: { children?: any }) => h('div', { 'data-testid': 'mock' }, props.children);
        const WrappedComponent = VueToJSX(MockComponent);

        render(WrappedComponent, {
            slots: {
                default: 'Default Content',
                // Named slots are not handled by VueToJSX, only default slot
                header: 'Header Content',
            },
        });

        const element = screen.getByTestId('mock');
        // Should only contain default slot content
        expect(element).toHaveTextContent('Default Content');
        expect(element).not.toHaveTextContent('Header Content');
    });

    it('should handle all options together: emit, events, and nestedComponents with slot', async () => {
        const MockText = (props: any) => h('span', { class: 'nested-text' }, props.children);
        const MockComponent = (props: any, nestedComponents: any) => {
            const { Text } = nestedComponents || {};
            return h(
                'button',
                {
                    'data-testid': 'mock',
                    class: props.className,
                    onClick: props.onClick,
                    onFocus: props.onFocus,
                },
                [Text ? Text({ children: 'Label: ' }) : null, props.children],
            );
        };

        const emitSpy = vi.fn();
        const WrappedComponent = VueToJSX(MockComponent, {
            emit: emitSpy,
            events: ['click', 'focus'],
            nestedComponents: { Text: MockText },
        });

        render(WrappedComponent, {
            props: { class: 'custom-class' },
            slots: { default: 'Button Text' },
        });

        const element = screen.getByTestId('mock');
        expect(element).toHaveClass('custom-class');
        expect(element).toHaveTextContent('Label: Button Text');

        await fireEvent.click(element);
        expect(emitSpy).toHaveBeenCalledWith('click', expect.anything());

        await fireEvent.focus(element);
        expect(emitSpy).toHaveBeenCalledWith('focus', expect.anything());
    });
});
