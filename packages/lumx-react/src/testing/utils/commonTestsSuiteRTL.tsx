import isEmpty from 'lodash/isEmpty';

import { GenericProps } from '@lumx/react/utils/type';
import { queryByClassName } from '@lumx/react/testing/utils/queries';
import React from 'react';
import { Theme } from '@lumx/react';
import { RenderOptions } from '@testing-library/react';
import { ThemeProvider } from '@lumx/react/utils/theme/ThemeContext';
import castArray from 'lodash/castArray';
import { invertTheme } from '@lumx/react/utils/theme/invertTheme';

interface CommonSetup {
    props: GenericProps;
}

type AffectConfig<E> = { element: E; classModifier?: 'color' | 'theme'; inverted?: boolean };
type Not<E> = { not: E };

interface Options<S extends CommonSetup> {
    baseClassName: string;
    forwardClassName?: keyof S;
    forwardAttributes?: keyof S;
    forwardRef?: keyof S;
    applyTheme?: {
        /** Element(s) to which we apply the theme class */
        affects: Array<AffectConfig<keyof S> | Not<AffectConfig<keyof S>>>;
        /** Apply theme via theme prop */
        viaProp: boolean;
        /** Apply theme via theme context */
        viaContext: boolean;
        /** Apply a default theme if no prop or context was provided */
        defaultTheme?: Theme;
    };
}

export type RenderWrapper = RenderOptions['wrapper'];
export type SetupRenderOptions = { wrapper?: RenderWrapper };
export type SetupFunction<S extends CommonSetup> = (
    props?: GenericProps,
    options?: SetupRenderOptions,
) => S | Promise<S>;

/**
 * Common tests on components
 * - Check base class name and class name forwarding
 * - Check props forwarding
 */
export function commonTestsSuiteRTL<S extends CommonSetup>(setup: SetupFunction<S>, options: Options<S>): void {
    if (isEmpty(options)) {
        return;
    }
    const { baseClassName, forwardClassName, forwardAttributes, forwardRef, applyTheme } = options;
    describe('Common tests suite', () => {
        it('should render with base class name', async () => {
            await setup();
            expect(queryByClassName(document.body, baseClassName)).toBeInTheDocument();
        });

        if (forwardClassName) {
            it('should forward any CSS class', async () => {
                const modifiedProps = {
                    className: 'component component--is-tested',
                };
                const wrappers = await setup(modifiedProps);
                expect(wrappers[forwardClassName]).toHaveClass(modifiedProps.className);
            });
        }

        if (forwardAttributes) {
            it('should forward any other prop', async () => {
                const modifiedProps = {
                    winter: 'is coming',
                };
                const wrappers = await setup(modifiedProps);
                expect(wrappers[forwardAttributes]).toHaveAttribute('winter', modifiedProps.winter);
            });
        }

        if (forwardRef) {
            it('should forward ref', async () => {
                const ref = React.createRef();
                const wrappers = await setup({ ref });
                expect(ref.current).toBe(wrappers[forwardRef]);
            });
        }

        if (applyTheme) {
            describe('theme', () => {
                const { affects, defaultTheme, viaProp, viaContext } = applyTheme;
                const testElements = affects.map((configOrNot) => {
                    let shouldHaveModifier: boolean = true;
                    let config: AffectConfig<any>;
                    if ('not' in configOrNot) {
                        shouldHaveModifier = false;
                        config = configOrNot.not;
                    } else config = configOrNot;

                    const {
                        element,
                        classModifier = 'theme',
                        inverted = false,
                    }: AffectConfig<any> = typeof config === 'object' ? config : { element: config };
                    return {
                        element,
                        getExpectedClassModifier: (theme: Theme) =>
                            `--${classModifier}-${inverted ? invertTheme(theme) : theme}`,
                        shouldHaveModifier,
                        apply: shouldHaveModifier ? 'apply' : 'not apply',
                    };
                });

                const expectTheme = (
                    wrappers: any,
                    { element, getExpectedClassModifier, shouldHaveModifier }: any,
                    theme: Theme,
                    override: { shouldHaveModifier?: boolean } = {},
                ) => {
                    for (const wrapper of castArray(wrappers[element])) {
                        let expected: any = expect(wrapper.className);
                        if (override.shouldHaveModifier === false || !shouldHaveModifier) {
                            expected = expected.not;
                        }
                        expected.toContain(getExpectedClassModifier(theme));
                    }
                };

                if (defaultTheme) {
                    it.each(testElements)(
                        `should $apply default theme (${defaultTheme}) to \`$element\``,
                        async (affectedElement) => {
                            const wrappers = await setup();
                            expectTheme(wrappers, affectedElement, defaultTheme);
                        },
                    );
                }

                // Only the elements that are affected by theme
                const affectedElements = testElements.filter((e) => e.shouldHaveModifier);
                if (!defaultTheme && affectedElements.length) {
                    it.each(affectedElements)(
                        `should not apply default theme (${defaultTheme}) to \`$element\``,
                        async (affectedElement) => {
                            const wrappers = await setup();
                            expectTheme(wrappers, affectedElement, Theme.light, { shouldHaveModifier: false });
                            expectTheme(wrappers, affectedElement, Theme.dark, { shouldHaveModifier: false });
                        },
                    );
                }

                if (viaProp) {
                    const theme = invertTheme(defaultTheme || Theme.light);
                    it.each(testElements)(
                        `should $apply prop theme=${theme} to \`$element\``,
                        async (affectedElement) => {
                            const wrappers = await setup({ theme });
                            expectTheme(wrappers, affectedElement, theme);
                        },
                    );
                }

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
