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
            it('should forward any CSS class', async () => {
                const modifiedProps = {
                    class: 'component component--is-tested',
                };
                const wrappers = await setup(modifiedProps);
                expect(wrappers[forwardClassName]).toHaveClass(modifiedProps.class);
            });
        }
    });
}
