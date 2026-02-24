import { render, screen } from '@testing-library/vue';
import BaseAvatarTests, { setup } from '@lumx/core/js/components/Avatar/Tests';
import { CLASSNAME } from '@lumx/core/js/components/Avatar';
import { commonTestsSuiteVTL, SetupRenderOptions } from '@lumx/vue/testing';

import { Avatar } from '.';

describe('<Avatar />', () => {
    const renderAvatar = (props: any, options?: SetupRenderOptions<any>) => render(Avatar, { ...options, props });

    BaseAvatarTests({
        render: renderAvatar,
        screen,
    });

    const setupAvatar = (props: any = {}, options: SetupRenderOptions<any> = {}) =>
        setup(props, { ...options, render: renderAvatar, screen });

    commonTestsSuiteVTL(setupAvatar, {
        baseClassName: CLASSNAME,
        forwardClassName: 'avatar',
        forwardAttributes: 'avatar',
        applyTheme: {
            affects: [{ element: 'avatar' }],
            viaProp: true,
            viaContext: true,
            defaultTheme: 'light',
        },
    });

    describe('Vue', () => {
        it('renders actions slot', () => {
            render(Avatar, {
                props: { image: 'test.png', alt: 'Avatar' },
                slots: { actions: '<button type="submit">Action</button>' },
            });
            expect(document.querySelector(`.${CLASSNAME}__actions`)).toBeInTheDocument();
        });

        it('renders badge slot', () => {
            render(Avatar, {
                props: { image: 'test.png', alt: 'Avatar' },
                slots: { badge: '<span>Badge</span>' },
            });
            expect(document.querySelector(`.${CLASSNAME}__badge`)).toBeInTheDocument();
        });
    });
});
