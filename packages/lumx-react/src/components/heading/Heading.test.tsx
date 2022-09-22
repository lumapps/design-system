import React from 'react';

import { mount, shallow } from 'enzyme';
import 'jest-enzyme';

import { commonTestsSuite } from '@lumx/react/testing/utils';
import { Heading, HeadingProps } from './Heading';
import { HeadingLevelProvider } from './HeadingLevelProvider';

const setup = (props: Partial<HeadingProps> = {}) => {
    const wrapper = shallow(<Heading {...props} />);
    return { props, wrapper };
};

describe(`<${Heading.displayName}>`, () => {
    describe('Snapshots and structure', () => {
        it('should render a Text component with h1 by default', () => {
            const { wrapper } = setup({ children: 'Some text' });
            expect(wrapper).toHaveDisplayName('Text');
            expect(wrapper).toHaveProp('as', 'h1');
            expect(wrapper.prop('className')).toBe(Heading.className);
        });

        it('should render with as', () => {
            const { wrapper } = setup({ children: 'Some text', as: 'h2' });
            expect(wrapper).toHaveDisplayName('Text');
            expect(wrapper).toHaveProp('as', 'h2');
            expect(wrapper.prop('className')).toBe(Heading.className);
        });

        it('should correctly render levels nested in HeadingLevel', () => {
            const wrapper = mount(
                <>
                    <Heading>Level 1</Heading>
                    <HeadingLevelProvider>
                        <Heading>Level 2</Heading>
                        <HeadingLevelProvider>
                            <Heading>Level 3</Heading>
                            <HeadingLevelProvider>
                                <Heading>Level 4</Heading>
                                <HeadingLevelProvider>
                                    <Heading>Level 5 - 1</Heading>
                                    <Heading>Level 5 - 2</Heading>
                                    <HeadingLevelProvider>
                                        <Heading>Level 6</Heading>
                                        <HeadingLevelProvider>
                                            <Heading>Level 7</Heading>
                                        </HeadingLevelProvider>
                                    </HeadingLevelProvider>
                                </HeadingLevelProvider>
                            </HeadingLevelProvider>
                        </HeadingLevelProvider>
                    </HeadingLevelProvider>
                    ,
                </>,
            );

            expect(wrapper.find('h1')).toHaveText('Level 1');
            expect(wrapper.find('h2')).toHaveText('Level 2');
            expect(wrapper.find('h3')).toHaveText('Level 3');
            expect(wrapper.find('h4')).toHaveText('Level 4');

            const h5 = wrapper.find('h5');
            expect(h5).toHaveLength(2);
            expect(h5.at(0)).toHaveText('Level 5 - 1');
            expect(h5.at(1)).toHaveText('Level 5 - 2');
            // There should be 2 h6 because it is the maximum value;
            const h6 = wrapper.find('h6');
            expect(h6).toHaveLength(2);
            expect(h6.at(0)).toHaveText('Level 6');
            expect(h6.at(1)).toHaveText('Level 7');
        });
    });

    // Common tests suite.
    commonTestsSuite(setup, { className: 'wrapper', prop: 'wrapper' }, { className: Heading.className });
});
