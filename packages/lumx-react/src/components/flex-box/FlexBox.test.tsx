import { mount, shallow } from 'enzyme';
import 'jest-enzyme';
import React, { ReactElement } from 'react';
import { commonTestsSuite, itShouldRenderStories, Wrapper } from '@lumx/react/testing/utils';

import { FlexBox, FlexBoxProps } from './FlexBox';
import * as stories from './FlexBox.stories';

const CLASSNAME = FlexBox.className as string;

type SetupProps = Partial<FlexBoxProps>;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = (propsOverride: SetupProps = {}, shallowRendering = true) => {
    const props: FlexBoxProps = {
        children: null,
        ...propsOverride,
    };
    const renderer: (el: ReactElement) => Wrapper = shallowRendering ? shallow : mount;
    const wrapper = renderer(<FlexBox {...props} />);

    return { props, wrapper };
};

describe(`<${FlexBox.displayName}>`, () => {
    // 1. Test render via snapshot.
    describe('Snapshots and structure', () => {
        itShouldRenderStories(stories, FlexBox);
    });

    /////////////////////////////

    // 2. Test defaultProps value and important props custom values.
    describe('Props', () => {
        // Nothing to do here.
    });

    /////////////////////////////

    // 3. Test events.
    describe('Events', () => {
        // Nothing to do here.
    });

    /////////////////////////////

    // 4. Test conditions (i.e. things that display or not in the UI based on props).
    describe('Conditions', () => {
        // Nothing to do here.
    });

    /////////////////////////////

    // 5. Test state.
    describe('State', () => {
        // Nothing to do here.
    });

    /////////////////////////////

    // Common tests suite.
    commonTestsSuite(setup, { className: 'wrapper', prop: 'wrapper' }, { className: CLASSNAME });
});
