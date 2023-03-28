import React, { ReactElement } from 'react';

import { mount, shallow } from 'enzyme';
import 'jest-enzyme';

import { commonTestsSuite, Wrapper } from '@lumx/react/testing/utils';
import { UserBlock, UserBlockProps } from './UserBlock';

const CLASSNAME = UserBlock.className as string;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = ({ ...propsOverride }: Partial<UserBlockProps> = {}, shallowRendering = true) => {
    const props: UserBlockProps = { ...propsOverride };
    const renderer: (el: ReactElement) => Wrapper = shallowRendering ? shallow : mount;
    const wrapper: Wrapper = renderer(<UserBlock {...props} />);

    return { props, wrapper };
};

describe(`<${UserBlock.displayName}>`, () => {
    // 1. Test render via snapshot.
    describe('Snapshots and structure', () => {
        it('should forward name props', () => {
            const { wrapper } = setup({ name: 'John Doe', nameProps: { 'data-custom-attribute': true } });

            expect(wrapper.find('.lumx-user-block__name[data-custom-attribute]')).toHaveLength(1);
        });
    });

    // Common tests suite.
    commonTestsSuite(setup, { className: 'wrapper', prop: 'wrapper' }, { className: CLASSNAME });
});
