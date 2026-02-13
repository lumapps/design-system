/* eslint-disable vue/order-in-components */
/* eslint-disable vue/one-component-per-file */
import { defineComponent } from 'vue';
import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import BaseThumbnailTests, { setup } from '@lumx/core/js/components/Thumbnail/Tests';
import { CLASSNAME } from '@lumx/core/js/components/Thumbnail';
import { commonTestsSuiteVTL, SetupRenderOptions } from '@lumx/vue/testing';
import { provideDisabledState } from '../../composables/useDisabledState';

import { Thumbnail } from '.';

describe('<Thumbnail />', () => {
    const renderThumbnail = (props: any, options?: SetupRenderOptions<any>) =>
        render(Thumbnail, {
            ...options,
            props,
        });

    // Run core tests
    BaseThumbnailTests({
        render: renderThumbnail,
        screen,
    });

    const setupThumbnail = (props: any = {}, options: SetupRenderOptions<any> = {}) =>
        setup(props, { ...options, render: renderThumbnail, screen });

    // Vue-specific tests
    describe('Vue-specific', () => {
        describe('clickable button', () => {
            it('should emit click event when clicked', async () => {
                const onClick = vi.fn();
                const { getByRole } = render(
                    defineComponent({
                        components: { Thumbnail },
                        setup() {
                            return { onClick };
                        },
                        template: `<Thumbnail alt="Name" image="https://example.com/image.jpg" @click="onClick" />`,
                    }),
                );
                const button = getByRole('button', { name: 'Name' });
                expect(button).toHaveAttribute('type', 'button');

                await userEvent.click(button);

                expect(onClick).toHaveBeenCalledTimes(1);
            });

            it('should not emit click when disabled with aria-disabled', async () => {
                const onClick = vi.fn();
                const { container } = render(
                    defineComponent({
                        components: { Thumbnail },
                        setup() {
                            return { onClick };
                        },
                        template: `<Thumbnail alt="Name" image="https://example.com/image.jpg" :aria-disabled="true" @click="onClick" />`,
                    }),
                );
                const thumbnail = container.querySelector(`.${CLASSNAME}`) as HTMLElement;

                await userEvent.click(thumbnail);

                expect(onClick).not.toHaveBeenCalled();
            });

            it('should not render button in disabled context', async () => {
                const onClick = vi.fn();
                const { container } = render(
                    defineComponent({
                        template: `
                            <Wrapper>
                                <Thumbnail alt="Name" image="https://example.com/image.jpg" @click="onClick" />
                            </Wrapper>
                        `,
                        components: {
                            Thumbnail,
                            Wrapper: defineComponent({
                                setup(_props, { slots }) {
                                    provideDisabledState({ state: 'disabled' });
                                    return () => slots.default?.();
                                },
                            }),
                        },
                        setup() {
                            return { onClick };
                        },
                    }),
                );

                const thumbnail = container.querySelector(`.${CLASSNAME}`);
                expect(container.querySelector('button')).toBe(null);
                expect(thumbnail?.tagName).toBe('DIV');

                if (thumbnail) await userEvent.click(thumbnail);
                expect(onClick).not.toHaveBeenCalled();
            });
        });

        describe('clickable link', () => {
            it('should emit click event when link is clicked', async () => {
                const onClick = vi.fn((evt: any) => evt.preventDefault());
                const { getByRole } = render(
                    defineComponent({
                        components: { Thumbnail },
                        setup() {
                            return { onClick };
                        },
                        template: `<Thumbnail alt="Name" image="https://example.com/image.jpg" :linkProps="{ href: '#' }" @click="onClick" />`,
                    }),
                );
                const link = getByRole('link');
                expect(link).toHaveAttribute('href', '#');

                await userEvent.click(link);

                expect(onClick).toHaveBeenCalledTimes(1);
            });

            it('should not render link in disabled context', async () => {
                const onClick = vi.fn();
                const { container } = render(
                    defineComponent({
                        template: `
                            <Wrapper>
                                <Thumbnail
                                    alt="Name"
                                    image="https://example.com/image.jpg"
                                    linkAs="a"
                                    :linkProps="{ href: '#' }"
                                    @click="onClick"
                                />
                            </Wrapper>
                        `,
                        components: {
                            Thumbnail,
                            Wrapper: defineComponent({
                                setup(_props, { slots }) {
                                    provideDisabledState({ state: 'disabled' });
                                    return () => slots.default?.();
                                },
                            }),
                        },
                        setup() {
                            return { onClick };
                        },
                    }),
                );

                const thumbnail = container.querySelector(`.${CLASSNAME}`);
                expect(container.querySelector('a')).toBe(null);
                expect(thumbnail?.tagName).toBe('DIV');
            });
        });

        describe('badge slot', () => {
            it('should render badge slot', () => {
                const { container } = render(Thumbnail, {
                    props: { alt: 'Name', image: 'https://example.com/image.jpg' },
                    slots: {
                        badge: '<span data-testid="badge">Badge</span>',
                    },
                });

                expect(screen.getByTestId('badge')).toBeInTheDocument();
                expect(container.querySelector(`.${CLASSNAME}__badge`)).toBeInTheDocument();
            });
        });

        describe('fallback slot', () => {
            it('should accept fallback slot content', () => {
                const { container } = render(
                    defineComponent({
                        components: { Thumbnail },
                        template: `
                            <Thumbnail alt="Name" image="https://example.com/image.jpg">
                                <template #fallback>
                                    <span data-testid="fallback-content">Custom fallback</span>
                                </template>
                            </Thumbnail>
                        `,
                    }),
                );

                // Verify the component renders (slot will be used when image errors, but we're just testing it's accepted)
                expect(container.querySelector(`.${CLASSNAME}`)).toBeInTheDocument();
            });
        });
    });

    // Common tests suite
    commonTestsSuiteVTL(setupThumbnail, {
        baseClassName: CLASSNAME,
        forwardClassName: 'thumbnail',
        forwardAttributes: 'thumbnail',
        forwardRef: 'thumbnail',
    });
});
