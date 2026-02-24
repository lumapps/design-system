import { commonTestsSuiteRTL, SetupRenderOptions } from '@lumx/react/testing/utils';
import { render, screen, fireEvent } from '@testing-library/react';
import { queryByClassName } from '@lumx/react/testing/utils/queries';
import { vi } from 'vitest';
import { Size } from '@lumx/react';
import BaseAvatarTests from '@lumx/core/js/components/Avatar/Tests';
import { Avatar, AvatarProps } from './Avatar';

const CLASSNAME = Avatar.className as string;

const setup = (propsOverride: Partial<AvatarProps> = {}, { wrapper }: SetupRenderOptions = {}) => {
    const props: AvatarProps = {
        image: 'path/to/avatar/image.png',
        alt: 'Image',
        ...propsOverride,
    };
    render(<Avatar {...props} />, { wrapper });
    const avatar = queryByClassName(document.body, CLASSNAME);
    return { avatar, props };
};

describe(`<${Avatar.displayName}>`, () => {
    BaseAvatarTests({
        render: (props: AvatarProps) => render(<Avatar {...props} />),
        screen,
    });

    commonTestsSuiteRTL(setup, {
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

    describe('Rendering & Content', () => {
        it('renders the thumbnail with correct props', () => {
            setup({ alt: 'Test Alt', image: 'test.jpg' });
            const img = screen.getByRole('img');
            expect(img).toHaveAttribute('alt', 'Test Alt');
            expect(img).toHaveAttribute('src', 'test.jpg');
        });

        it('renders actions when provided', () => {
            setup({ actions: <button type="submit">Action</button> });
            const actionsContainer = document.querySelector(`.${CLASSNAME}__actions`);
            expect(actionsContainer).toBeInTheDocument();
            expect(screen.getByText('Action')).toBeInTheDocument();
        });

        it('renders badge when provided', () => {
            setup({ badge: <span>Badge</span> });
            const badgeContainer = document.querySelector(`.${CLASSNAME}__badge`);
            expect(badgeContainer).toBeInTheDocument();
            expect(screen.getByText('Badge')).toBeInTheDocument();
        });
    });

    describe('Interactions', () => {
        it('handles onClick via Thumbnail', () => {
            const onClick = vi.fn();
            setup({ onClick });
            const thumbnail = document.querySelector('.lumx-thumbnail');
            fireEvent.click(thumbnail!);
            expect(onClick).toHaveBeenCalled();
        });

        it('handles onKeyPress via Thumbnail', () => {
            const onKeyPress = vi.fn();
            setup({ onKeyPress });
            const thumbnail = document.querySelector('.lumx-thumbnail');
            fireEvent.keyPress(thumbnail!, { key: 'Enter', code: 'Enter', charCode: 13 });
            expect(onKeyPress).toHaveBeenCalled();
        });

        it('renders as a link when linkProps are provided', () => {
            setup({ linkProps: { href: 'https://example.com' } });
            const link = screen.getByRole('link');
            expect(link).toHaveAttribute('href', 'https://example.com');
        });
    });

    describe('Styling', () => {
        it('applies size class', () => {
            const { avatar } = setup({ size: Size.xl });
            expect(avatar).toHaveClass('lumx-avatar--size-xl');
        });
    });
});
