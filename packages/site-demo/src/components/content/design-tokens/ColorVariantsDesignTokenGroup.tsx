import classNames from 'classnames';
import React from 'react';

import { useThemeColorVariants } from '@lumx/demo/utils/hooks/useThemeColorVariants';
import { FlexBox, Orientation, Theme } from '@lumx/react';

import { DesignToken } from './DesignToken';
import { DesignTokenGroup } from './DesignTokenGroup';

interface Props {
    /** Color name (blue, red, dark, etc.). */
    color: string;
    /** Theme adapting the component to light or dark background. */
    theme: Theme;
}

/**
 * Component used to present the group of color variant for a color of design tokens in the documentation site.
 *
 * @param props Components props.
 * @return ReactElement.
 */
export const ColorVariantsDesignTokenGroup: React.FC<Props> = ({ color, theme = Theme.light }) => (
    <DesignTokenGroup theme={theme}>
        {Object.entries(useThemeColorVariants(color)).map(([key, hue], index) => (
            <DesignToken
                key={index}
                prefix={<div className={`lumx-color-background-${color}-${key}`} style={{ width: 20, height: 20 }} />}
                name={`$lumx-color-${color}-${key}`}
                description={`Version: ${hue.version}`}
                value={`#${hue.hex}`}
                theme={theme}
            >
                <p>{hue.comment}</p>
                <FlexBox orientation={Orientation.horizontal}>
                    <div className={`lumx-color-background-${color}-${key}`} style={{ width: 60, height: 60 }} />
                    <div
                        className={classNames(
                            'lumx-typography-body1',
                            'lumx-spacing-margin-left-big  ',
                            `lumx-color-font-${theme === 'light' ? 'dark' : 'light'}-L2`,
                        )}
                    >
                        <span className="lumx-base-display-block">#{hue.hex}</span>
                        <span className="lumx-base-display-block">
                            rgb({hue.rgb.r}, {hue.rgb.g}, {hue.rgb.b})
                        </span>
                        <span className="lumx-base-display-block">{hue.rgb.a * 100}%</span>
                    </div>
                </FlexBox>
            </DesignToken>
        ))}
    </DesignTokenGroup>
);
