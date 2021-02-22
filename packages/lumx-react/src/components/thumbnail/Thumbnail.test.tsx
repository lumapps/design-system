import React from 'react';

import { mount, shallow } from 'enzyme';
import 'jest-enzyme';
import { commonTestsSuite, itShouldRenderStories } from '@lumx/react/testing/utils';

import { Thumbnail, ThumbnailProps } from './Thumbnail';
import { Clickable, CustomFallback, Default, DefaultFallback, IconFallback, WithBadge } from './Thumbnail.stories';

const CLASSNAME = Thumbnail.className as string;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = (props: Partial<ThumbnailProps> = {}, shallowRendering = true) => {
    const renderer: any = shallowRendering ? shallow : mount;
    const wrapper: any = renderer(<Thumbnail {...(props as any)} />);
    return { props, wrapper };
};

describe(`<${Thumbnail.displayName}>`, () => {
    // 1. Test render via snapshot.
    describe('Snapshots and structure', () => {
        itShouldRenderStories(
            { Default, Clickable, DefaultFallback, CustomFallback, IconFallback, WithBadge },
            Thumbnail,
        );
    });

    // Common tests suite.
    commonTestsSuite(setup, { className: 'wrapper', prop: 'wrapper' }, { className: CLASSNAME });
});
