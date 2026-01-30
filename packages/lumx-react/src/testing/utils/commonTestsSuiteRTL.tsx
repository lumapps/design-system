import React from 'react';
import { RenderOptions } from '@testing-library/react';
import { GenericProps, Theme } from '@lumx/react';
import { ThemeProvider } from '@lumx/react/utils/theme/ThemeContext';
import { invertTheme } from '@lumx/react/utils/theme/invertTheme';
import {
    commonTestsSuiteTL as coreCommonTestsSuiteTL,
    Options,
    getTestElements,
    SetupFunction,
    expectTheme,
} from '@lumx/core/testing/commonTestsSuiteTL';

export type SetupRenderOptions = RenderOptions;
export type RenderWrapper = RenderOptions['wrapper'];

/**
 * Common tests on components
 * - Check base class name and class name forwarding
 * - Check props forwarding
 */
export function commonTestsSuiteRTL<S extends GenericProps>(setup: SetupFunction, options: Options<S>): void {
    const { forwardRef, applyTheme, forwardClassName } = options;

    coreCommonTestsSuiteTL(setup, options);

    describe('React - Common tests suite', () => {
        if (forwardRef) {
            it('should forward ref', async () => {
                const ref = React.createRef();
                const wrappers = await setup({ ref });
                expect(ref.current).toBe(wrappers[forwardRef]);
            });
        }

        if (forwardClassName) {
            it('should forward any CSS class', async () => {
                const modifiedProps = {
                    className: 'component component--is-tested',
                };
                const wrappers = await setup(modifiedProps);
                expect(wrappers[forwardClassName]).toHaveClass(modifiedProps.className);
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
