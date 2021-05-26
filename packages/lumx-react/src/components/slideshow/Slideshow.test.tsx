import React, { ReactElement } from 'react';
import pick from 'lodash/pick';

import { mount, shallow } from 'enzyme';
import 'jest-enzyme';

import { commonTestsSuite, itShouldRenderStories, Wrapper } from '@lumx/react/testing/utils';
import { Slideshow, SlideshowProps } from './Slideshow';
import { SlideshowControls } from './SlideshowControls';
import * as stories from './Slideshow.stories';

const CLASSNAME = Slideshow.className as string;

const setup = ({ ...propsOverride }: Partial<SlideshowProps> = {}, shallowRendering = true) => {
    const props: SlideshowProps = {
        slideshowControlsProps: {
            nextButtonProps: { label: 'Next' },
            previousButtonProps: { label: 'Prev' },
        },
        ...propsOverride,
    };

    const renderer: (el: ReactElement) => Wrapper = shallowRendering ? shallow : mount;
    const wrapper: Wrapper = renderer(<Slideshow {...props} />);

    return { props, wrapper };
};

describe(`<${Slideshow.displayName}>`, () => {
    // 1. Test render via snapshot.
    describe('Snapshots and structure', () => {
        itShouldRenderStories(pick(stories, ['default', 'Simple']), {
            or: [Slideshow, { path: [Slideshow, SlideshowControls] }],
        });
    });

    // Common tests suite.
    commonTestsSuite(setup, { className: 'wrapper', prop: 'wrapper' }, { className: CLASSNAME });
});
