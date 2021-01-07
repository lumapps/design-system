import React from 'react';
import { mount, shallow } from 'enzyme';
import 'jest-enzyme';
import { commonTestsSuite, itShouldRenderStories } from '@lumx/react/testing/utils';

import { SkeletonRectangle, SkeletonRectangleProps } from './SkeletonRectangle';
import * as stories from './SkeletonRectangle.stories';

const CLASSNAME = SkeletonRectangle.className as string;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = (props: Partial<SkeletonRectangleProps> = {}, shallowRendering = true) => {
    const renderer: any = shallowRendering ? shallow : mount;
    const wrapper: any = renderer(<SkeletonRectangle {...(props as any)} />);
    return { props, wrapper };
};

describe(`<${SkeletonRectangle.displayName}>`, () => {
    // 1. Test render via snapshot.
    describe('Snapshots and structure', () => {
        itShouldRenderStories(stories, SkeletonRectangle);
    });

    // Common tests suite.
    commonTestsSuite(setup, { className: 'wrapper', prop: 'wrapper' }, { className: CLASSNAME });
});
