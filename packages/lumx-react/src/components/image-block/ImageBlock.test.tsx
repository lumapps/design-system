import React from 'react';
import { mount, shallow } from 'enzyme';
import 'jest-enzyme';
import { commonTestsSuite, itShouldRenderStories } from '@lumx/react/testing/utils';

import { ImageBlock, ImageBlockProps } from './ImageBlock';
import * as stories from './ImageBlock.stories';

const CLASSNAME = ImageBlock.className as string;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = (props: Partial<ImageBlockProps> = {}, shallowRendering = true) => {
    const renderer: any = shallowRendering ? shallow : mount;
    const wrapper: any = renderer(<ImageBlock {...(props as any)} />);
    return { props, wrapper };
};

describe(`<${ImageBlock.displayName}>`, () => {
    // 1. Test render via snapshot.
    describe('Snapshots and structure', () => {
        itShouldRenderStories(stories, ImageBlock);
    });

    // Common tests suite.
    commonTestsSuite(setup, { className: 'wrapper', prop: 'wrapper' }, { className: CLASSNAME });
});
