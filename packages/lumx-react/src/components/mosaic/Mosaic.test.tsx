import { Mosaic, MosaicProps } from '@lumx/react/components/mosaic/Mosaic';
import { CommonSetup, commonTestsSuite, Wrapper } from '@lumx/react/testing/utils';

import { mount, shallow } from 'enzyme';
import 'jest-enzyme';

import React, { ReactElement } from 'react';
import { Theme } from '..';
import * as stories from './Mosaic.stories';

const CLASSNAME = Mosaic.className as string;

// Mock out the useIntersectionObserver hook since it can't work with Jest/Enzyme.
jest.mock('@lumx/react/hooks/useIntersectionObserver', () => ({
    useIntersectionObserver: () => new Map(),
}));

/**
 * Define the overriding properties waited by the `setup` function.
 */
type SetupProps = Partial<MosaicProps>;

/**
 * Defines what the `setup` function will return.
 */
interface Setup extends CommonSetup {
    props: SetupProps;

    /**
     * The <div> element that wraps the dialog and children elements.
     */
    wrapper: Wrapper;

    thumbnails: Wrapper;
}

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = (propsOverride: SetupProps = {}, shallowRendering = true): Setup => {
    const props: any = { ...propsOverride };
    const renderer: (el: ReactElement) => Wrapper = shallowRendering ? shallow : mount;
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
                const wrapper = shallow(<Story />);
                expect(wrapper.find('Mosaic').dive()).toMatchSnapshot();
            });
        }
    });

    // 2. Test defaultProps value and important props custom values.
    describe('Props', () => {
        it('should pass theme prop to Thumbnails', () => {
            const expectedTheme = Theme.dark;
            const { thumbnails } = setup({
                theme: expectedTheme,
                thumbnails: [
                    { image: 'image/file/path/0' },
                    { image: 'image/file/path/1' },
                    { image: 'image/file/path/2' },
                    { image: 'image/file/path/3' },
                ],
            });
            thumbnails.forEach((thumbnail: Wrapper) => {
                expect(thumbnail.prop('theme')).toBe(expectedTheme);
            });
        });

        it('should only set tabIndex at 0 if thumbnail has onClick', () => {
            const expectedTheme = Theme.dark;
            const onClick = jest.fn();
            const { thumbnails } = setup({
                theme: expectedTheme,
                thumbnails: [
                    { image: 'image/file/path/0' },
                    { image: 'image/file/path/1', onClick },
                    { image: 'image/file/path/2' },
                    { image: 'image/file/path/3', onClick },
                ],
            });
            thumbnails.forEach((thumbnail: Wrapper, index: number) => {
                if (index === 1 || index === 3) {
                    expect(thumbnail.prop('tabIndex')).toBe('0');
                } else {
                    expect(thumbnail.prop('tabIndex')).toBeUndefined();
                }
            });
        });
    });

    // 3. Test events.
    describe('Events', () => {
        const clickOnFirstThumbnail = jest.fn();
        it('should call onClick callback when Thumbnail is clicked', () => {
            const { thumbnails } = setup({
                thumbnails: [
                    {
                        onClick: clickOnFirstThumbnail,
                        image: 'image/file/path/0',
                    },
                    { image: 'image/file/path/1' },
                    { image: 'image/file/path/2' },
                    { image: 'image/file/path/3' },
                ],
            });
            thumbnails.forEach((thumbnail: Wrapper) => {
                thumbnail.simulate('click');
            });
            expect(clickOnFirstThumbnail).toHaveBeenCalledTimes(1);
        });
    });

    // 4. Test conditions (i.e. things that display or not in the UI based on props).
    describe('Conditions', () => {
        // Nothing to do here.
    });

    // 5. Test state.
    describe('State', () => {
        // Nothing to do here.
    });

    // Common tests suite.
    commonTestsSuite(setup, { className: 'wrapper' }, { className: CLASSNAME });
});
