import React from 'react';
import { mount, shallow } from 'enzyme';
import 'jest-enzyme';
import { commonTestsSuite, itShouldRenderStories } from '@lumx/react/testing/utils';

import { Popover, PopoverProps } from './Popover';
import * as stories from '../../stories/generated/Popover/Demos.stories';

const CLASSNAME = Popover.className as string;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = (props: Partial<PopoverProps> = {}, shallowRendering = true) => {
    const propsOverride = { anchorRef: { current: null }, children: null, isOpen: true, ...props } as any;
    const renderer: any = shallowRendering ? shallow : mount;
    const wrapper: any = renderer(<Popover {...propsOverride} />);
    const popover = wrapper.find(`.${CLASSNAME}`);
    return { props, wrapper, popover };
};

describe(`<${Popover.displayName}>`, () => {
    // 1. Test render via snapshot.
    describe('Snapshots and structure', () => {
        itShouldRenderStories(stories, Popover);
    });

    // Common tests suite.
    commonTestsSuite(setup, { className: 'popover', prop: 'popover' }, { className: CLASSNAME });
});
