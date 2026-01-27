import { defineComponent, h } from 'vue';
import { isComponent } from './isComponent';

describe('isComponent', () => {
    it('should return true for component match by name', () => {
        const MyComponent = defineComponent({ name: 'MyComponent' });
        const vnode = h(MyComponent);
        expect(isComponent('MyComponent')(vnode)).toBe(true);
    });

    it('should return true for component match by reference', () => {
        const MyComponent = defineComponent({ name: 'MyComponent' });
        const vnode = h(MyComponent);
        expect(isComponent(MyComponent)(vnode)).toBe(true);
    });

    it('should return false for non-matching component', () => {
        const MyComponent = defineComponent({ name: 'MyComponent' });
        const OtherComponent = defineComponent({ name: 'OtherComponent' });
        const vnode = h(MyComponent);
        expect(isComponent(OtherComponent)(vnode)).toBe(false);
    });

    it('should return false for non-vnode', () => {
        const MyComponent = defineComponent({ name: 'MyComponent' });
        expect(isComponent(MyComponent)('not a vnode' as any)).toBe(false);
    });
});
