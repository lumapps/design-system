import React from 'react';

import { commonTestsSuiteRTL } from '@lumx/react/testing/utils';
import { mdiEarth } from '@lumx/icons';
import { Icon } from '@lumx/react';
import { render } from '@testing-library/react';
import { getByClassName } from '@lumx/react/testing/utils/queries';
import { Text, TextProps } from '.';

const setup = (props: Partial<TextProps> = {}) => {
    const { container } = render(<Text as="span" {...props} />);
    const element = getByClassName(container, Text.className as string);
    return { props, container, element };
};

describe(`<${Text.displayName}>`, () => {
    describe('Render', () => {
        it('should render default', () => {
            const { element } = setup({ children: 'Some text' });
            expect(element.tagName).toBe('SPAN');
        });

        it('should render with as', () => {
            const { element } = setup({ children: 'Some text', as: 'p' });
            expect(element.tagName).toBe('P');
        });

        it('should render with typography', () => {
            const { element } = setup({ typography: 'body2', children: 'Some text' });
            expect(element.tagName).toBe('SPAN');
            expect(element).toHaveClass('lumx-typography-body2');
        });

        it('should render with color', () => {
            const { element } = setup({ color: 'blue', children: 'Some text' });
            expect(element.tagName).toBe('SPAN');
            expect(element).toHaveClass('lumx-color-font-blue-N');
        });

        it('should render with color and variant', () => {
            const { element } = setup({ color: 'blue', colorVariant: 'D2', children: 'Some text' });
            expect(element.tagName).toBe('SPAN');
            expect(element).toHaveClass('lumx-color-font-blue-D2');
        });

        it('should render truncated', () => {
            const { element } = setup({ truncate: true });
            expect(element.tagName).toBe('SPAN');
            expect(element).toHaveClass('lumx-text--is-truncated');
        });

        it('should render truncated multiline', () => {
            const { element } = setup({ truncate: { lines: 2 } });
            expect(element.tagName).toBe('SPAN');
            expect(element).toHaveClass('lumx-text--is-truncated-multiline');
        });

        it('should render noWrap', () => {
            const { element } = setup({ noWrap: true });
            expect(element.tagName).toBe('SPAN');
            expect(element).toHaveClass('lumx-text--no-wrap');
        });

        it('should wrap icons with spaces', () => {
            const { element } = setup({ children: ['Some text', <Icon key="icon" icon={mdiEarth} />, 'with icon'] });
            // Spaces have been inserted around the icon.
            expect(element).toMatchInlineSnapshot(`
                <span
                  class="lumx-text"
                >
                  Some text
                   
                  <i
                    class="lumx-icon lumx-icon--no-shape lumx-icon--path"
                  >
                    <svg
                      aria-hidden="true"
                      height="1em"
                      preserveAspectRatio="xMidYMid meet"
                      style="vertical-align: -0.125em;"
                      viewBox="0 0 24 24"
                      width="1em"
                    >
                      <path
                        d="M17.9,17.39C17.64,16.59 16.89,16 16,16H15V13A1,1 0 0,0 14,12H8V10H10A1,1 0 0,0 11,9V7H13A2,2 0 0,0 15,5V4.59C17.93,5.77 20,8.64 20,12C20,14.08 19.2,15.97 17.9,17.39M11,19.93C7.05,19.44 4,16.08 4,12C4,11.38 4.08,10.78 4.21,10.21L9,15V16A2,2 0 0,0 11,18M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"
                        fill="currentColor"
                      />
                    </svg>
                  </i>
                   
                  with icon
                </span>
            `);
        });

        it('should render dangerouslySetInnerHTML', () => {
            const { element } = setup({ dangerouslySetInnerHTML: { __html: '<strong>HTML text</strong>' } });
            expect(element).toHaveTextContent('HTML text');
        });
    });

    // Common tests suite.
    commonTestsSuiteRTL(setup, {
        baseClassName: Text.className as string,
        forwardClassName: 'element',
        forwardAttributes: 'element',
    });
});
