import React from 'react';
import { Theme } from '@lumx/react';
import { RenderOptions } from '@testing-library/react';
import { ThemeProvider } from '@lumx/react/utils/theme/ThemeContext';
import { invertTheme } from '@lumx/react/utils/theme/invertTheme';
import {
    commonTestsSuiteRTL as coreCommonTestsSuiteRTL,
    CommonSetup,
    SetupFunction,
    Options,
    SetupRenderOptions as CommonSetupRenderOptions,
    getTestElements,
    expectTheme,
} from '@lumx/core/testing/commonTestsSuiteRTL';

export type RenderWrapper = RenderOptions['wrapper'];
export type SetupRenderOptions = CommonSetupRenderOptions<RenderWrapper>;
/**
 * Common tests on components
 * - Check base class name and class name forwarding
 * - Check props forwarding
 */
export function commonTestsSuiteRTL<S extends CommonSetup>(
    setup: SetupFunction<S, RenderWrapper>,
    options: Options<S>,
): void {
    const { forwardRef, applyTheme } = options;

    coreCommonTestsSuiteRTL(setup, options);

    if (forwardRef || applyTheme) {
        describe('React - Common tests suite', () => {
            if (forwardRef) {
                it('should forward ref', async () => {
                    const ref = React.createRef();
                    const wrappers = await setup({ ref });
                    expect(ref.current).toBe(wrappers[forwardRef]);
                });
            }

            if (applyTheme) {
                describe('theme', () => {
                    const { defaultTheme, viaProp, viaContext } = applyTheme;
                    const testElements = getTestElements(applyTheme);

                    const contextTheme = invertTheme(defaultTheme || Theme.light);
                    it.each(testElements)(
                        `should $apply context theme=${contextTheme} to \`$element\``,
                        async (affectedElement) => {
                            const Wrapper = ({ children }: any) => (
                                <ThemeProvider value={contextTheme}>{children}</ThemeProvider>
                            );
                            const wrappers = await setup({}, { wrapper: Wrapper });
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
                                const Wrapper = ({ children }: any) => (
                                    <ThemeProvider value={contextTheme}>{children}</ThemeProvider>
                                );
                                const wrappers = await setup({ theme: propTheme }, { wrapper: Wrapper });
                                expectTheme(wrappers, affectedElement, propTheme);
                            },
                        );
                    }
                });
            }
        });
    }
}
