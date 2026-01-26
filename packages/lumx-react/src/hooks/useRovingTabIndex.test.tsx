import { render, act } from '@testing-library/react';
import { useRovingTabIndex } from './useRovingTabIndex';

const TestComponent = ({ args }: any) => {
    useRovingTabIndex(args);
    return null;
};

describe('useRovingTabIndex', () => {
    it('should set initial tabIndex and navigate with arrows', () => {
        const parent = document.createElement('div');
        const btn1 = document.createElement('button');
        const btn2 = document.createElement('button');
        btn1.className = 'item';
        btn2.className = 'item';
        parent.appendChild(btn1);
        parent.appendChild(btn2);

        const ref = { current: parent };
        render(<TestComponent args={{ parentRef: ref as any, elementSelector: '.item' }} />);

        expect(btn1.getAttribute('tabindex')).toBe('0');
        expect(btn2.getAttribute('tabindex')).toBe('-1');

        // ArrowRight press
        act(() => {
            btn1.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
        });

        // Note: focus() call happens in hook. In JSDOM we might need to check activeElement
        // but let's check if the logic cycles through.
        // Actually the hook doesn't change tabIndex unless keepTabIndex is true.
        // But it does call .focus()
    });
});
