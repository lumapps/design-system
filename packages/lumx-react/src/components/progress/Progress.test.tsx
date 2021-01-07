import React from 'react';
import { mount, shallow } from 'enzyme';
import 'jest-enzyme';
import { commonTestsSuite, itShouldRenderStories } from '@lumx/react/testing/utils';

import { Progress, ProgressProps } from './Progress';
import * as stories from '../../stories/generated/Progress/Demos.stories';

const CLASSNAME = Progress.className as string;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = (props: Partial<ProgressProps> = {}, shallowRendering = true) => {
    const renderer: any = shallowRendering ? shallow : mount;
    const wrapper: any = renderer(<Progress {...(props as any)} />);
    return { props, wrapper };
};

describe(`<${Progress.displayName}>`, () => {
    // 1. Test render via snapshot.
    describe('Snapshots and structure', () => {
        itShouldRenderStories(stories, Progress);
    });

    // Common tests suite.
    commonTestsSuite(setup, { className: 'wrapper', prop: 'wrapper' }, { className: CLASSNAME });
});
