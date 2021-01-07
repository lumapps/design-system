import React from 'react';
import { mount, shallow } from 'enzyme';
import 'jest-enzyme';
import { commonTestsSuite, itShouldRenderStories } from '@lumx/react/testing/utils';

import { SkeletonCircle, SkeletonCircleProps } from './SkeletonCircle';
import * as stories from './SkeletonCircle.stories';

const CLASSNAME = SkeletonCircle.className as string;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = (props: Partial<SkeletonCircleProps> = {}, shallowRendering = true) => {
    const renderer: any = shallowRendering ? shallow : mount;
    const wrapper: any = renderer(<SkeletonCircle {...(props as any)} />);
    return { props, wrapper };
};

describe(`<${SkeletonCircle.displayName}>`, () => {
    // 1. Test render via snapshot.
    describe('Snapshots and structure', () => {
        itShouldRenderStories(stories, SkeletonCircle);
    });

    // Common tests suite.
    commonTestsSuite(setup, { className: 'wrapper', prop: 'wrapper' }, { className: CLASSNAME });
});
