import { ColorPaletteWithVariants, ColorVariantDetail } from '@lumx/demo/constants';
import { ColorPalette, Theme } from '@lumx/react';
import classNames from 'classnames';
import React, { ReactElement } from 'react';

interface DemoColorProps {
    theme: Theme;
    color: ColorPalette;
    colorVariants: ColorPaletteWithVariants;
}

const DemoColor = ({ theme, color, colorVariants }: DemoColorProps): ReactElement => (
    <div className={classNames('demo-colors', { 'lumx-theme-background-dark-N': theme === Theme.dark })}>
        {Object.entries(colorVariants[color]).map(([key, hue]: [string, ColorVariantDetail]) => (
            <div
                className={classNames(
                    'demo-colors__hue',
                    `lumx-theme-background-${color}-${key}`,
                    `lumx-theme-color-${hue.fontColor}-N`,
                )}
                key={key}
            >
                <span className="demo-colors__key">{key}</span>

                <div className="demo-colors__meta">
                    <span className="demo-colors__hex-code">{hue.hexCode}</span>
                    {hue.opacity && <span className="demo-colors__opacity">{hue.opacity}</span>}
                </div>
            </div>
        ))}
    </div>
);

export { DemoColor };
