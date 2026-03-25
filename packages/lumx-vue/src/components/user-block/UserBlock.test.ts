import { h } from 'vue';
import { render, screen } from '@testing-library/vue';
import { vi } from 'vitest';
import { getByClassName, queryByClassName } from '@lumx/core/testing/queries';
import BaseUserBlockTests, { setup } from '@lumx/core/js/components/UserBlock/Tests';
import { CLASSNAME as THUMBNAIL_CLASSNAME } from '@lumx/core/js/components/Thumbnail';
import { CLASSNAME } from '@lumx/core/js/components/UserBlock';
import { Orientation } from '@lumx/core/js/constants';
import { commonTestsSuiteVTL, SetupRenderOptions } from '@lumx/vue/testing';

import { UserBlock } from '.';
import Text from '../text/Text';

describe('<UserBlock />', () => {
    const renderUserBlock = (props: any, options?: SetupRenderOptions<any>) =>
        render(UserBlock, {
            ...options,
            props,
        });

    // Run core tests
    BaseUserBlockTests({
        render: renderUserBlock,
        screen,
    });

    const setupUserBlock = (props: any = {}, options: SetupRenderOptions<any> = {}) =>
        setup(props, { ...options, render: renderUserBlock, screen });

    // Vue-specific tests
    describe('Vue', () => {
        it('should render actions in vertical orientation', () => {
            renderUserBlock(
                {
                    orientation: Orientation.vertical,
                },
                {
                    slots: {
                        'simple-action': () => h('button', { type: 'button' }, 'Simple'),
                        'multiple-actions': () => h('button', { type: 'button' }, 'Multiple'),
                    },
                },
            );
            expect(screen.getByText('Simple')).toBeInTheDocument();
            expect(screen.getByText('Multiple')).toBeInTheDocument();
        });

        it('should forward name props', () => {
            const { userBlock } = setupUserBlock({
                name: 'John Doe',
                nameProps: { 'data-custom-attribute': true },
            });
            const name = queryByClassName(userBlock, `${CLASSNAME}__name`);
            expect(name).toHaveAttribute('data-custom-attribute');
        });

        it('should emit click event', async () => {
            const { emitted } = renderUserBlock({
                name: 'John Doe',
                avatarProps: { image: 'profile-picture.jpg', alt: 'John Doe' },
            });

            const userBlock = getByClassName(document.body, CLASSNAME);
            const name = queryByClassName(userBlock, `${CLASSNAME}__name`);

            await (name as HTMLElement).click();
            expect(emitted()).toHaveProperty('click');
        });

        it('should emit mouseenter event', async () => {
            const onMouseenter = vi.fn();
            renderUserBlock({
                name: 'John Doe',
                avatarProps: { image: 'profile-picture.jpg', alt: 'John Doe' },
                onMouseenter,
            });

            const userBlock = getByClassName(document.body, CLASSNAME);

            const event = new MouseEvent('mouseenter', { bubbles: true });
            userBlock.dispatchEvent(event);

            expect(onMouseenter).toHaveBeenCalledTimes(1);
        });

        it('should emit mouseleave event', async () => {
            const onMouseleave = vi.fn();
            renderUserBlock({
                name: 'John Doe',
                avatarProps: { image: 'profile-picture.jpg', alt: 'John Doe' },
                onMouseleave,
            });

            const userBlock = getByClassName(document.body, CLASSNAME);

            const event = new MouseEvent('mouseleave', { bubbles: true });
            userBlock.dispatchEvent(event);

            expect(onMouseleave).toHaveBeenCalledTimes(1);
        });

        it('should render link', () => {
            const { userBlock } = setupUserBlock({
                linkProps: { href: 'https://example.com' },
                name: 'John Doe',
                avatarProps: { image: 'profile-picture.jpg', alt: 'John Doe' },
            });

            const name = queryByClassName(userBlock, `${CLASSNAME}__name`);
            const avatar = queryByClassName(userBlock, `${CLASSNAME}__avatar`);
            const thumbnail = avatar && queryByClassName(avatar, THUMBNAIL_CLASSNAME);

            // Link name
            expect(name?.tagName).toBe('A');
            expect(name).toHaveAttribute('href', 'https://example.com');

            // Link thumbnail (but excluded from tab stops)
            expect(thumbnail?.tagName).toBe('A');
            expect(thumbnail?.tabIndex).toBe(-1);
            expect(thumbnail).toHaveAttribute('href', 'https://example.com');
        });

        it('should render additional fields', () => {
            renderUserBlock(
                {},
                {
                    slots: {
                        'additional-fields': () => h(Text, { as: 'span' }, { default: () => 'Works in Toronto' }),
                    },
                },
            );
            expect(screen.queryByText(/works in toronto/i)).toBeInTheDocument();
        });

        it('should render after', () => {
            const { userBlock } = setupUserBlock(
                {},
                {
                    slots: {
                        after: () => h(Text, { as: 'span' }, { default: () => 'After' }),
                    },
                },
            );
            const afterElement = queryByClassName(userBlock, `${CLASSNAME}__after`);
            expect(afterElement).toBeInTheDocument();
            expect(screen.queryByText(/after/i)).toBeInTheDocument();
        });

        it('should apply className to field Text components', () => {
            const { userBlock } = setupUserBlock({
                fields: ['Field 1', 'Field 2'],
            });
            const fieldElements = userBlock.querySelectorAll(`.${CLASSNAME}__field`);
            expect(fieldElements).toHaveLength(2);

            fieldElements.forEach((fieldElement) => {
                // Both lumx-user-block__field (from core) and lumx-text (from Text component) should be present
                expect(fieldElement).toHaveClass(`${CLASSNAME}__field`);
                expect(fieldElement).toHaveClass('lumx-text');
            });

            // Verify actual text content is rendered
            expect(screen.getByText('Field 1')).toBeInTheDocument();
            expect(screen.getByText('Field 2')).toBeInTheDocument();
        });
    });

    // Common tests suite
    commonTestsSuiteVTL(setupUserBlock, {
        baseClassName: CLASSNAME,
        forwardClassName: 'div',
        forwardAttributes: 'div',
        forwardRef: 'div',
        applyTheme: {
            affects: [{ element: 'div' }],
            viaProp: true,
            viaContext: true,
            defaultTheme: 'light',
        },
    });
});
