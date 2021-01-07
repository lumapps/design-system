import { Mosaic, MosaicProps } from '@lumx/react/components/mosaic/Mosaic';
import { commonTestsSuite, Wrapper } from '@lumx/react/testing/utils';

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

type SetupProps = Partial<MosaicProps>;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = (propsOverride: SetupProps = {}, shallowRendering = true) => {
    const props: any = { ...propsOverride };
    const renderer: (el: ReactElement) => Wrapper = shallowRendering ? shallow : mount;
    const wrapper = renderer(<Mosaic {...props} />);

    return {
        thumbnails: wrapper.find('Thumbnail'),
        props,
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
                    { alt: 'image0', image: 'image/file/path/0' },
                    { alt: 'image1', image: 'image/file/path/1' },
                    { alt: 'image2', image: 'image/file/path/2' },
                    { alt: 'image3', image: 'image/file/path/3' },
                ],
            });
            thumbnails.forEach((thumbnail: Wrapper) => {
                expect(thumbnail.prop('theme')).toBe(expectedTheme);
            });
        });
    });

    // 3. Test events.
    describe('Events', () => {
        it('should keep Thumbnail onClick', () => {
            const onClick = jest.fn();
            const { thumbnails } = setup({
                thumbnails: [
                    { alt: 'image0', image: 'image/file/path/0', onClick },
                    { alt: 'image1', image: 'image/file/path/1' },
                    { alt: 'image2', image: 'image/file/path/2' },
                    { alt: 'image3', image: 'image/file/path/3' },
                ],
            });
            thumbnails.forEach((thumbnail: Wrapper) => {
                thumbnail.simulate('click');
            });
            expect(onClick).toHaveBeenCalledTimes(1);
        });

        it('should handle both Thumbnail onClick and Mosaic onImageClick', () => {
            const onImageClick = jest.fn();
            const onClick = jest.fn();
            const { thumbnails } = setup({
                onImageClick,
                thumbnails: [
                    { alt: 'image0', image: 'image/file/path/0', onClick },
                    { alt: 'image1', image: 'image/file/path/1' },
                    { alt: 'image2', image: 'image/file/path/2' },
                    { alt: 'image3', image: 'image/file/path/3' },
                ],
            });
            thumbnails.forEach((thumbnail: Wrapper) => {
                thumbnail.simulate('click');
            });
            expect(onClick).toHaveBeenCalledTimes(1);
            expect(onImageClick).toHaveBeenCalledTimes(4);
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
