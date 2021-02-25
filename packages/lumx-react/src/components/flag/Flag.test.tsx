import { mount, shallow } from 'enzyme';
import 'jest-enzyme';
import React, { ReactElement } from 'react';

import { ColorPalette, Theme } from '@lumx/react';
import { mdiAbTesting } from '@lumx/icons';
import { itShouldRenderStories, commonTestsSuite, Wrapper } from '@lumx/react/testing/utils';
import { getBasicClass } from '@lumx/react/utils';

import { Flag, FlagProps } from './Flag';
import * as stories from './Flag.stories';

const CLASSNAME = Flag.className as string;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = (propOverrides: Partial<FlagProps> = {}, shallowRendering = true) => {
    const props = {
        label: 'default',
        ...propOverrides,
    };
    const renderer: (el: ReactElement) => Wrapper = shallowRendering ? shallow : mount;
    const wrapper = renderer(<Flag {...props} />);

    return {
        props,
        iconEl: wrapper.find('Icon'),
        wrapper,
    };
};

describe(`<${Flag.displayName} />`, () => {
    // 1. Test render via snapshot (default state of component).
    describe('Snapshots and structure', () => {
        itShouldRenderStories(stories, Flag);
    });

    // 4. Test conditions (i.e. things that display or not in the UI based on props).
    describe('Conditions', () => {
        it('should use the icon', () => {
            const { iconEl } = setup({ icon: mdiAbTesting });

            expect(iconEl).toBeDefined();
            expect(iconEl.prop('icon')).toEqual(mdiAbTesting);
        });

        it('should have correct default color', () => {
            const { wrapper } = setup({});
            expect(wrapper).toHaveClassName(
                getBasicClass({
                    prefix: CLASSNAME,
                    type: 'color',
                    value: ColorPalette.dark,
                }),
            );
        });

        it('should switch color with theme', () => {
            const { wrapper } = setup({ theme: Theme.dark });
            expect(wrapper).toHaveClassName(
                getBasicClass({
                    prefix: CLASSNAME,
                    type: 'color',
                    value: ColorPalette.light,
                }),
            );
        });

        it('should use the color', () => {
            const color = ColorPalette.green;
            const { wrapper, iconEl } = setup({ icon: mdiAbTesting, color });

            expect(iconEl.prop('color')).toEqual(color);
            expect(wrapper).toHaveClassName(
                getBasicClass({
                    prefix: CLASSNAME,
                    type: 'color',
                    value: color,
                }),
            );
        });
    });

    // Common tests suite.
    commonTestsSuite(setup, { className: 'wrapper', prop: 'wrapper' }, { className: CLASSNAME });
});
