import castArray from 'lodash/castArray';
import isEmpty from 'lodash/isEmpty';

import { GenericProps } from '../js/types';
import { Theme } from '../js/constants';
import { invertTheme } from '../js/utils/theme/invertTheme';
import { queryByClassName } from './queries';

/**
 * Common setup interface for the tests.
 */
export interface CommonSetup {
    props: GenericProps;
}

/**
 * Configuration for an element affected by a theme.
 */
export type AffectConfig<E> = { element: E; classModifier?: 'color' | 'theme'; inverted?: boolean };

/**
 * Type utility to negate a configuration.
 */
export type Not<E> = { not: E };

/**
 * Configuration for applying a theme to the component.
 */
export type ApplyTheme<S extends CommonSetup> = {
    /** Element(s) to which we apply the theme class */
    affects: Array<AffectConfig<keyof S> | Not<AffectConfig<keyof S>>>;
    /** Apply theme via theme prop */
    viaProp: boolean;
    /** Apply theme via theme context */
    viaContext: boolean;
    /** Apply a default theme if no prop or context was provided */
    defaultTheme?: Theme;
    /** Default props to apply when testing theme */
    defaultProps?: S['props'];
};

/**
 * Options for the common tests suite.
 */
export interface Options<S extends CommonSetup> {
    baseClassName: string;
    forwardClassName?: keyof S;
    forwardAttributes?: keyof S;
    forwardRef?: keyof S;
    applyTheme?: ApplyTheme<S>;
}

/**
 * Options passed to the setup function.
 */
export type SetupRenderOptions<T> = { wrapper?: T };

/**
 * Function to setup the component for testing.
 */
export type SetupFunction<S extends CommonSetup, T> = (
    props?: GenericProps,
    options?: SetupRenderOptions<T>,
) => S | Promise<S>;

/**
 * Get the test elements based on the theme configuration.
 *
 * @param applyTheme The theme configuration.
 * @return The test elements configuration.
 */
export const getTestElements = <S extends CommonSetup>(applyTheme: ApplyTheme<S>) => {
    const { affects } = applyTheme;
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
            getExpectedClassModifier: (theme: Theme) => `--${classModifier}-${inverted ? invertTheme(theme) : theme}`,
            shouldHaveModifier,
            apply: shouldHaveModifier ? 'apply' : 'not apply',
        };
    });

    return testElements;
};

/**
 * Expect the theme to be applied to the element.
 *
 * @param wrappers The wrappers returned by the setup function.
 * @param elementConfig The configuration of the element to check.
 * @param theme The theme to check.
 * @param override Override the default expectations.
 */
export const expectTheme = (
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

/**
 * Run common tests on a component.
 *
 * - Check base class name and class name forwarding
 * - Check props forwarding
 * - Check theme application via props, context, and default theme
 *
 * @param setup The setup function returns the wrapper and the component.
 * @param options The options for the common tests.
 */
export function commonTestsSuiteRTL<S extends CommonSetup, T>(setup: SetupFunction<S, T>, options: Options<S>): void {
    if (isEmpty(options)) {
        return;
    }
    const { baseClassName, forwardClassName, forwardAttributes, applyTheme } = options;
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

        if (applyTheme) {
            describe('theme', () => {
                const { defaultTheme, viaProp } = applyTheme;
                const testElements = getTestElements(applyTheme);

                if (defaultTheme) {
                    it.each(testElements)(
                        `should $apply default theme (${defaultTheme}) to \`$element\``,
                        async (affectedElement) => {
                            const wrappers = await setup(applyTheme.defaultProps);
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
                            const wrappers = await setup(applyTheme.defaultProps);
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
                            const wrappers = await setup({ ...applyTheme.defaultProps, theme });
                            expectTheme(wrappers, affectedElement, theme);
                        },
                    );
                }
            });
        }
    });
}
