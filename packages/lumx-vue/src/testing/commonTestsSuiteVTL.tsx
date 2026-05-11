import { GenericProps, Theme } from '@lumx/vue';
import { RenderOptions } from '@testing-library/vue';
import { invertTheme } from '@lumx/core/js/utils/theme/invertTheme';
import {
    commonTestsSuiteTL as coreCommonTestsSuiteTL,
    SetupFunction,
    Options,
    getTestElements,
    expectTheme,
} from '@lumx/core/testing/commonTestsSuiteTL';

export type SetupRenderOptions<Props> = RenderOptions<Props>;
/**
 * Common tests on components
 * - Check base class name and class name forwarding
 * - Check props forwarding
 */
export function commonTestsSuiteVTL<S extends GenericProps>(setup: SetupFunction, options: Options<S>): void {
    const { applyTheme, forwardClassName } = options;

    coreCommonTestsSuiteTL(setup, options);

    describe('Vue - Common tests suite', () => {
        if (applyTheme) {
            describe('theme', () => {
                const { defaultTheme, viaProp, viaContext } = applyTheme;
                const testElements = getTestElements(applyTheme);

                const contextTheme = invertTheme(defaultTheme || Theme.light);
                it.each(testElements)(
                    `should $apply context theme=${contextTheme} to \`$element\``,
                    async (affectedElement) => {
                        const wrappers = await setup(
                            {},
                            {
                                global: {
                                    provide: {
                                        theme: contextTheme,
                                    },
                                },
                            },
                        );
                        expectTheme(wrappers, affectedElement, contextTheme, {
                            shouldHaveModifier: !viaContext ? false : undefined,
                        });
                    },
                );

                if (viaProp && viaContext) {
                    const propTheme = invertTheme(contextTheme);
                    it.each(testElements)(
                        `should $apply prop theme=${propTheme} to \`$element\` overriding the context theme=${contextTheme}`,
                        async (affectedElement) => {
                            const wrappers = await setup(
                                { theme: propTheme },
                                {
                                    global: {
                                        provide: {
                                            theme: contextTheme,
                                        },
                                    },
                                },
                            );
                            expectTheme(wrappers, affectedElement, propTheme);
                        },
                    );
                }
            });
        }

        if (forwardClassName) {
            /** Assert that no class token appears more than once on an element. */
            const expectNoDuplicateClass = (el: HTMLElement) => {
                const classList = Array.from(el.classList);
                expect(new Set(classList).size).toBe(classList.length);
            };

            it('should forward any CSS class without duplication', async () => {
                const wrappers = await setup({ class: 'component component--is-tested' });
                const el = wrappers[forwardClassName] as HTMLElement;
                expect(el).toHaveClass('component component--is-tested');
                expectNoDuplicateClass(el);
            });

            it('should accept an array of class names', async () => {
                const wrappers = await setup({ class: ['class-a', 'class-b'] });
                const el = wrappers[forwardClassName] as HTMLElement;
                expect(el).toHaveClass('class-a');
                expect(el).toHaveClass('class-b');
                expectNoDuplicateClass(el);
            });

            it('should accept an object of conditional class names', async () => {
                const wrappers = await setup({ class: { 'class-active': true, 'class-disabled': false } });
                const el = wrappers[forwardClassName] as HTMLElement;
                expect(el).toHaveClass('class-active');
                expect(el).not.toHaveClass('class-disabled');
                expectNoDuplicateClass(el);
            });

            it('should merge className attr with class prop without duplication', async () => {
                const wrappers = await setup({ class: 'from-class-prop', className: 'from-class-name-attr' });
                const el = wrappers[forwardClassName] as HTMLElement;
                expect(el).toHaveClass('from-class-prop');
                expect(el).toHaveClass('from-class-name-attr');
                expectNoDuplicateClass(el);
            });
        }
    });
}
