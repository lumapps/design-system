import { describe, it, expect } from 'vitest';
import { h, Fragment } from 'vue';
import { Icon } from '@lumx/vue/components/icon';
import { wrapChildrenIconWithSpaces } from './wrapChildrenIconWithSpaces';

describe('wrapChildrenIconWithSpaces', () => {
    it('should ignore undefined children', () => {
        expect(wrapChildrenIconWithSpaces(undefined)).toBeUndefined();
    });

    it('should wrap Icon with spaces', () => {
        const iconNode = h(Icon, { icon: 'some-icon' });
        const children = [
            'text',
            iconNode,
            'more text'
        ];
        
        const result = wrapChildrenIconWithSpaces(children);
        
        expect(result).toHaveLength(5);
        expect(result![0]).toBe('text');
        expect(result![1]).toBe(' ');
        expect(result![2]).toBe(iconNode);
        expect(result![3]).toBe(' ');
        expect(result![4]).toBe('more text');
    });

    it('should recurse into elements', () => {
        const iconNode = h(Icon, { icon: 'some-icon' });
        const divNode = h('div', [ 'inner', iconNode ]);
        
        const result = wrapChildrenIconWithSpaces([divNode]);
        
        expect(result).toHaveLength(1);
        const newDiv = result![0] as any;
        // inner, space, icon, space
        expect(newDiv.children).toHaveLength(4); 
        expect(newDiv.children[1]).toBe(' ');
        expect(newDiv.children[2]).toBe(iconNode);
        expect(newDiv.children[3]).toBe(' ');
    });

    it('should flatten fragments', () => {
        const iconNode = h(Icon, { icon: 'some-icon' });
        const fragment = h(Fragment, [ 'frag-text', iconNode ]);
        
        const result = wrapChildrenIconWithSpaces([fragment]);
        
        // Should be flattened: frag-text, space, icon, space
        expect(result).toHaveLength(4); 
        expect(result![0]).toBe('frag-text');
        expect(result![1]).toBe(' ');
        expect(result![2]).toBe(iconNode);
        expect(result![3]).toBe(' ');
    });
});
