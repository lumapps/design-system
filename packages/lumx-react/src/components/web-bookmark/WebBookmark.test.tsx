import React, { ReactElement } from 'react';

import { mount, shallow } from 'enzyme';
import 'jest-enzyme';

import { ICommonSetup, Wrapper, commonTestsSuite } from '@lumx/react/testing/utils';
import { getBasicClass } from '@lumx/react/utils';

import { Size, Theme } from '..';
import { CLASSNAME, DEFAULT_PROPS, WebBookmark, WebBookmarkProps } from './WebBookmark';

/////////////////////////////

/**
 * Define the overriding properties waited by the `setup` function.
 */
type ISetupProps = Partial<WebBookmarkProps>;

/**
 * Defines what the `setup` function will return.
 */
interface ISetup extends ICommonSetup {
    props: ISetupProps;

    /**
     * [Enter the description of this wrapper].
     * [You should also probably change the name of the wrapper to something more meaningful].
     */
    wrapper: Wrapper;
    thumbnail: Wrapper;
}

/////////////////////////////

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 *
 * @param  props  The props to use to override the default props of the component.
 * @param  [shallowRendering=true] Indicates if we want to do a shallow or a full rendering.
 * @return An object with the props, the component wrapper and some shortcut to some element inside of the component.
 */
const setup = (props: ISetupProps = {}, shallowRendering: boolean = true): ISetup => {
    const renderer: (el: ReactElement) => Wrapper = shallowRendering ? shallow : mount;

    // @ts-ignore
    const wrapper: Wrapper = renderer(<WebBookmark {...props} />);

    return {
        props,
        thumbnail: wrapper.find('Thumbnail'),
        wrapper,
    };
};

describe(`<${WebBookmark.displayName}>`, () => {
    // 1. Test render via snapshot (default states of component).
    describe('Snapshots and structure', () => {
        // Here is an example of a basic rendering check, with snapshot.

        it('should render correctly', () => {
            const { wrapper } = setup();
            expect(wrapper).toMatchSnapshot();

            expect(wrapper).toExist();
            expect(wrapper).toHaveClassName(CLASSNAME);
        });

        it('should render correctly', () => {
            const { wrapper } = setup({ size: Size.big });
            expect(wrapper).toMatchSnapshot();

            expect(wrapper).toExist();
            expect(wrapper).toHaveClassName(CLASSNAME);
        });
    });

    /////////////////////////////

    // 2. Test defaultProps value and important props custom values.
    describe('Props', () => {
        // Here are some examples of basic props check.

        it('should use default props', () => {
            const { wrapper, thumbnail } = setup();
            Object.keys(DEFAULT_PROPS).forEach((prop: string) => {
                expect(wrapper).toHaveClassName(
                    getBasicClass({ prefix: CLASSNAME, type: prop, value: DEFAULT_PROPS[prop] }),
                );
            });
            expect(thumbnail).toHaveProp('image', '');
        });

        it('should pass className prop to the wrapper', () => {
            const expectedClassName = 'must-be-set';
            const { wrapper } = setup({ className: expectedClassName });

            expect(wrapper).toHaveClassName(expectedClassName);
        });

        it('should pass `thumbnail` prop to the `Thumbnail` component as `image` prop', () => {
            const expectedThumbnail = 'https://expected.thumbnail';
            const { thumbnail } = setup({ thumbnail: expectedThumbnail });

            expect(thumbnail).toHaveProp('image', expectedThumbnail);
        });

        it('should set --big class variant on wrapper if size = Size.big', () => {
            const { wrapper } = setup({ size: Size.big });

            expect(wrapper).toHaveClassName(getBasicClass({ prefix: CLASSNAME, type: 'size', value: Size.big }));
        });

        it('should set --theme-dark class variant on wrapper if theme = Theme.dark', () => {
            const { wrapper } = setup({ theme: Theme.dark });

            expect(wrapper).toHaveClassName(getBasicClass({ prefix: CLASSNAME, type: 'theme', value: Theme.dark }));
        });
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
    commonTestsSuite(setup, {}, { className: CLASSNAME });
});
