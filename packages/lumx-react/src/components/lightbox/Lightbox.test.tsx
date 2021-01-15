import React from 'react';
import { mount, shallow } from 'enzyme';
import 'jest-enzyme';
import { commonTestsSuite, itShouldRenderStories } from '@lumx/react/testing/utils';

import { Lightbox, LightboxProps } from './Lightbox';
import * as stories from '../../stories/generated/Lightbox/Demos.stories';

const CLASSNAME = Lightbox.className as string;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = (props: Partial<LightboxProps> = {}, shallowRendering = true) => {
    const renderer: any = shallowRendering ? shallow : mount;
    const propsOverride = { isOpen: true, ...props } as any;
    const wrapper: any = renderer(<Lightbox {...propsOverride} />);
    const lightbox = wrapper.find(`.${CLASSNAME}`);
    return { props, wrapper, lightbox };
};

describe(`<${Lightbox.displayName}>`, () => {
    // 1. Test render via snapshot.
    describe('Snapshots and structure', () => {
        itShouldRenderStories(stories, Lightbox, { props: { defaultIsOpen: true } });
    });

    // Common tests suite.
    commonTestsSuite(setup, { className: 'lightbox', prop: 'lightbox' }, { className: CLASSNAME });
});
