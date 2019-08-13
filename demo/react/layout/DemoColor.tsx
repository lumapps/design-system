import { ColorPalette, Theme } from 'LumX';
import { IColorPaletteWithVariants, IColorVariantDetail } from 'LumX/demo/constants';
import classNames from 'classnames';
import React, { ReactElement } from 'react';

interface IDemoColorProps {
    theme: Theme;
    color: ColorPalette;
    colorVariants: IColorPaletteWithVariants;
}

const DemoColor = ({ theme, color, colorVariants }: IDemoColorProps): ReactElement => (
    <div className={classNames('demo-colors', { 'lumx-theme-background-dark-N': theme === Theme.dark })}>
        {Object.entries(colorVariants[color]).map(([key, hue]: [string, IColorVariantDetail]) => (
            <div
                className={classNames(
                    'demo-colors__hue',
                    `lumx-theme-background-${color}-${key}`,
                    `lumx-theme-color-${hue.fontColor}-N`,
                )}
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
