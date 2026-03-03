import React from 'react';
import { FlexBox } from '@lumx/react';
import {
    prepareThemeData,
    type Entry,
    type ThemeVariablesOptions,
    type Variables,
} from '@lumx/core/stories/utils/themeVariables';
import { ThemingVariablesTable } from '@lumx/core/stories/utils/ThemingVariablesTable';

// Re-export types for convenience
export type { ThemeVariablesOptions, PropertyTree, Entry, Variables } from '@lumx/core/stories/utils/themeVariables';

/**
 * Storybook decorator for theming CSS custom properties.
 * Allows interactive editing of design tokens via an "Edit variables" panel.
 *
 * @param options - Configuration object with properties tree and initial values
 * @returns Storybook decorator function
 *
 * @example
 * import pick from 'lodash/pick';
 * import { DESIGN_TOKENS } from '@lumx/core/js/constants/_internal/design-tokens';
 *
 * export const Theming = {
 *     decorators: [
 *         withTheming({
 *             properties: pick(DESIGN_TOKENS, ['button']),
 *             values: `
 *                 --lumx-button-emphasis-high-state-default-theme-light-background-color: red;
 *                 --lumx-button-emphasis-high-state-hover-theme-light-background-color: blue;
 *             `,
 *         }),
 *     ],
 * };
 */
export function withTheming(options: ThemeVariablesOptions) {
    return (Story: any, ctx: any) => {
        // Prepare theme data using core utility
        const { filteredStyles, defaultStyle } = prepareThemeData(options);

        // React-specific state management
        const [style, setStyle] = React.useState<Variables>(filteredStyles(ctx.args));

        // React-specific event handler
        const handleVariableChange = React.useCallback(([key, value]: Entry) => {
            setStyle((prevStyle) => ({ ...prevStyle, [key]: value }));
        }, []);

        // Wrapper component for details element
        const DetailsContainer = React.useCallback(
            // eslint-disable-next-line react/no-unused-prop-types
            ({ children }: { children: React.ReactNode }) => (
                <details className="lumx-spacing-margin-vertical-huge">{children}</details>
            ),
            [],
        );

        return (
            <>
                <Story args={{ ...ctx.args, style: { ...ctx.args.style, ...style } }} />
                <ThemingVariablesTable
                    style={style}
                    defaultStyle={defaultStyle}
                    onVariableChange={handleVariableChange}
                    nestedComponents={{
                        FlexBox,
                        DetailsContainer,
                    }}
                />
            </>
        );
    };
}
