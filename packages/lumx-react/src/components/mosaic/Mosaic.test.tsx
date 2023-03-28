import { Mosaic, MosaicProps } from '@lumx/react/components/mosaic/Mosaic';
import { commonTestsSuite, Wrapper } from '@lumx/react/testing/utils';

import { mount, shallow } from 'enzyme';
import 'jest-enzyme';

import React, { ReactElement } from 'react';
import { Theme } from '..';

const CLASSNAME = Mosaic.className as string;

// Mock out the useIntersectionObserver hook since it can't work with Jest/Enzyme.
jest.mock('@lumx/react/hooks/useIntersectionObserver', () => ({
    useIntersectionObserver: () => new Map(),
}));

type SetupProps = Partial<MosaicProps>;

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

    // Common tests suite.
    commonTestsSuite(setup, { className: 'wrapper' }, { className: CLASSNAME });
});
