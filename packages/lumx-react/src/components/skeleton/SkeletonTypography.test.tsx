import React from 'react';
import { mount, shallow } from 'enzyme';
import 'jest-enzyme';
import { commonTestsSuite, itShouldRenderStories } from '@lumx/react/testing/utils';

import { SkeletonTypography, SkeletonTypographyProps } from './SkeletonTypography';
import * as stories from './SkeletonTypography.stories';

const CLASSNAME = SkeletonTypography.className as string;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = (props: Partial<SkeletonTypographyProps> = {}, shallowRendering = true) => {
    const renderer: any = shallowRendering ? shallow : mount;
    const wrapper: any = renderer(<SkeletonTypography {...(props as any)} />);
    return { props, wrapper };
};

describe(`<${SkeletonTypography.displayName}>`, () => {
    // 1. Test render via snapshot.
    describe('Snapshots and structure', () => {
        itShouldRenderStories(stories, SkeletonTypography);
    });

    // Common tests suite.
    commonTestsSuite(setup, { className: 'wrapper', prop: 'wrapper' }, { className: CLASSNAME });
});
