import React from 'react';

import { shallow } from 'enzyme';
import 'jest-enzyme';

import { commonTestsSuite } from '@lumx/react/testing/utils';
import { Text, TextProps } from './Text';

const setup = (props: Partial<TextProps> = {}) => {
    const wrapper = shallow(<Text as="span" {...props} />);
    return { props, wrapper };
};

describe(`<${Text.displayName}>`, () => {
    describe('Snapshots and structure', () => {
        it('should render default', () => {
            const { wrapper } = setup({ children: 'Some text' });
            expect(wrapper).toHaveDisplayName('span');
            expect(wrapper.prop('className')).toBe(Text.className);
        });

        it('should render with as', () => {
            const { wrapper } = setup({ children: 'Some text', as: 'p' });
            expect(wrapper).toHaveDisplayName('p');
            expect(wrapper.prop('className')).toBe(Text.className);
        });

        it('should render with typography', () => {
            const { wrapper } = setup({ typography: 'body2', children: 'Some text' });
            expect(wrapper).toHaveDisplayName('span');
            expect(wrapper).toHaveClassName('lumx-typography-body2');
        });

        it('should render with color', () => {
            const { wrapper } = setup({ color: 'blue', children: 'Some text' });
            expect(wrapper).toHaveDisplayName('span');
            expect(wrapper).toHaveClassName('lumx-color-font-blue-N');
        });

        it('should render with color and variant', () => {
            const { wrapper } = setup({ color: 'blue', colorVariant: 'D2', children: 'Some text' });
            expect(wrapper).toHaveDisplayName('span');
            expect(wrapper).toHaveClassName('lumx-color-font-blue-D2');
        });

        it('should render truncated', () => {
            const { wrapper } = setup({ truncate: true });
            expect(wrapper).toHaveDisplayName('span');
            expect(wrapper).toHaveClassName('lumx-text--is-truncated');
        });

        it('should render truncated multiline', () => {
            const { wrapper } = setup({ truncate: { lines: 2 } });
            expect(wrapper).toHaveDisplayName('span');
            expect(wrapper).toHaveClassName('lumx-text--is-truncated-multiline');
            expect(wrapper).toHaveStyle({ '--lumx-text-truncate-lines': 2 });
        });
    });

    // Common tests suite.
    commonTestsSuite(setup, { className: 'wrapper', prop: 'wrapper' }, { className: Text.className });
});
