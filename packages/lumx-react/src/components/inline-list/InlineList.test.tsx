import React from 'react';

import { shallow } from 'enzyme';
import 'jest-enzyme';

import { commonTestsSuite } from '@lumx/react/testing/utils';
import { InlineList, InlineListProps } from '.';

const setup = (props: Partial<InlineListProps> = {}) => {
    const wrapper = shallow(<InlineList {...props} />);
    return { props, wrapper };
};

describe(`<${InlineList.displayName}>`, () => {
    describe('Snapshots and structure', () => {
        it('should render default', () => {
            const { wrapper } = setup({ children: ['Some text', 'Some other text'] });
            expect(wrapper).toHaveDisplayName('ul');
            expect(wrapper.prop('className')).toBe(InlineList.className);
            expect(wrapper.find('li')).toHaveLength(2);
        });

        it('should render with typography', () => {
            const { wrapper } = setup({ typography: 'body2', children: 'Some text' });
            expect(wrapper).toHaveClassName('lumx-typography-body2');
        });

        it('should render with color', () => {
            const { wrapper } = setup({ color: 'blue', children: 'Some text' });
            expect(wrapper).toHaveClassName('lumx-color-font-blue-N');
        });

        it('should render with color and variant', () => {
            const { wrapper } = setup({ color: 'blue', colorVariant: 'D2', children: 'Some text' });
            expect(wrapper).toHaveClassName('lumx-color-font-blue-D2');
        });
    });

    // Common tests suite.
    commonTestsSuite(setup, { className: 'wrapper', prop: 'wrapper' }, { className: InlineList.className });
});
