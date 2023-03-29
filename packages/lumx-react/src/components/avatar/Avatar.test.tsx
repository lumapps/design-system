import React from 'react';

import { commonTestsSuiteRTL } from '@lumx/react/testing/utils';
import { render } from '@testing-library/react';
import { queryByClassName } from '@lumx/react/testing/utils/queries';
import { Avatar, AvatarProps } from './Avatar';

const CLASSNAME = Avatar.className as string;

const setup = (propsOverride: Partial<AvatarProps> = {}) => {
    const props: AvatarProps = {
        image: 'path/to/avatar/image.png',
        alt: 'Image',
        ...propsOverride,
    };
    render(<Avatar {...props} />);
    const avatar = queryByClassName(document.body, CLASSNAME);
    return { avatar, props };
};

describe(`<${Avatar.displayName}>`, () => {
    // Common tests suite.
    commonTestsSuiteRTL(setup, { baseClassName: CLASSNAME, forwardClassName: 'avatar', forwardAttributes: 'avatar' });
});
