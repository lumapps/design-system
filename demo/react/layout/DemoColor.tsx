import { ColorPalette, Theme } from 'LumX';
import classNames from 'classnames';
import React from 'react';
import {IColorPaletteWithVariants, IColorVariantDetail} from "LumX/demo/constants";

interface IDemoColorProps {
    theme: Theme;
    color: ColorPalette;
    colorVariants: IColorPaletteWithVariants;
}

const DemoColor = ({ theme, color, colorVariants }: IDemoColorProps) => (
    <div className={classNames('demo-colors', { 'lumx-theme-background-dark-N': theme === Theme.dark })}>
        {Object.entries(colorVariants[color]).map(([key, hue]) => (
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
