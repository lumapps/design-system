import { CLASSNAME, Mosaic, MosaicProps } from '@lumx/react/components/mosaic/Mosaic';

import { ICommonSetup, Wrapper, commonTestsSuite } from '@lumx/react/testing/utils';

import { mount, shallow } from 'enzyme';
import 'jest-enzyme';
import React from 'react';

import { Theme } from '..';
import * as stories from './Mosaic.stories';

// Mock out the useIntersectionObserver hook since it can't work with Jest/Enzyme.
jest.mock('@lumx/react/hooks/useIntersectionObserver', () => ({
    useIntersectionObserver: () => new Map(),
}));

/////////////////////////////

/**
 * Define the overriding properties waited by the `setup` function.
 */
type ISetupProps = Partial<MosaicProps>;

/**
 * Defines what the `setup` function will return.
 */
interface ISetup extends ICommonSetup {
    props: ISetupProps;

    /**
     * The <div> element that wraps the dialog and children elements.
     */
    wrapper: Wrapper;

    thumbnails: Wrapper;
}

/////////////////////////////

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 *
 * @param props  The props to use to override the default props of the component.
 * @param     [shallowRendering=true] Indicates if we want to do a shallow or a full rendering.
 * @return      An object with the props, the component wrapper and some shortcut to some element inside of the
 *                       component.
 */
const setup = ({ ...props }: ISetupProps = {}, shallowRendering = true): ISetup => {
    const renderer = shallowRendering ? shallow : mount;
    // @ts-ignore
    const wrapper = renderer(<Mosaic {...props} />);

    return {
        props,
        thumbnails: wrapper.find('Thumbnail'),
        wrapper,
    };
};

describe(`<${Mosaic.displayName}>`, () => {
    // 1. Test render via snapshot.
    describe('Snapshots and structure', () => {
        // Do snapshot render test on every stories.
        for (const [storyName, Story] of Object.entries(stories)) {
            if (typeof Story !== 'function') {
                continue;
            }

            it(`should render story ${storyName}`, () => {
                // @ts-ignore
                const wrapper = shallow(<Story />);
                expect(wrapper.find('Mosaic').dive()).toMatchSnapshot();
            });
        }
    });

    /////////////////////////////

    // 2. Test defaultProps value and important props custom values.
    describe('Props', () => {
        it('should pass theme prop to Thumbnails', () => {
            const expectedTheme = Theme.dark;
            const { thumbnails } = setup({
                theme: expectedTheme,
                thumbnails: [
                    { url: 'https://picsum.photos/200' },
                    { url: 'https://picsum.photos/210' },
                    { url: 'https://picsum.photos/220' },
                    { url: 'https://picsum.photos/230' },
                ],
            });
            thumbnails.forEach((thumbnail: Wrapper) => {
                expect(thumbnail.prop('theme')).toBe(expectedTheme);
            });
        });
    });

    /////////////////////////////

    // 3. Test events.
    describe('Events', () => {
        const clickOnFirstThumbnail = jest.fn();
        it('should call onClick callback when Thumbnail is clicked', () => {
            const { thumbnails } = setup({
                thumbnails: [
                    {
                        onClick: clickOnFirstThumbnail,
                        url: 'https://picsum.photos/200',
                    },
                    { url: 'https://picsum.photos/210' },
                    { url: 'https://picsum.photos/220' },
                    { url: 'https://picsum.photos/230' },
                ],
            });
            thumbnails.forEach((thumbnail: Wrapper) => {
                thumbnail.simulate('click');
            });
            expect(clickOnFirstThumbnail).toHaveBeenCalledTimes(1);
            expect(clickOnFirstThumbnail).toHaveBeenCalledWith(0);
        });
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
    commonTestsSuite(setup, { className: 'wrapper' }, { className: CLASSNAME });
});
