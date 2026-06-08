// @vitest-environment jsdom
import { lastDescendant } from './lastDescendant';

describe('lastDescendant', () => {
    it('should return the element itself when it has no children', () => {
        const el = document.createElement('div');
        expect(lastDescendant(el)).toBe(el);
    });

    it('should return the last child for elements with one level of children', () => {
        const parent = document.createElement('div');
        const child1 = document.createElement('span');
        const child2 = document.createElement('span');
        parent.append(child1, child2);

        expect(lastDescendant(parent)).toBe(child2);
    });

    it('should return the deepest last child for deeply nested elements', () => {
        const parent = document.createElement('div');
        const child = document.createElement('div');
        const grandchild = document.createElement('span');
        parent.append(child);
        child.append(grandchild);

        expect(lastDescendant(parent)).toBe(grandchild);
    });
});
