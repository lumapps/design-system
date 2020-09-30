import classNames from 'classnames';
import React from 'react';

import { useThemeColorVariants } from '@lumx/demo/hooks/useThemeColorVariants';
import { Theme } from '@lumx/react';

interface DemoColorProps {
    theme: Theme;
    color: string;
}

const DemoColor: React.FC<DemoColorProps> = ({ color, theme }) => {
    const colorVariants = useThemeColorVariants(color);
    return (
        <div className={classNames('demo-colors', { 'lumx-color-background-dark-N': theme === Theme.dark })}>
            {Object.entries(colorVariants).map(([variant, colorDescription]) => (
                <div
                    className={classNames(
                        'demo-colors__hue',
                        `lumx-color-background-${colorDescription.colorName}-${variant}`,
                        `lumx-color-font-${colorDescription.fontColor}-N`,
                    )}
                    key={variant}
                >
                    <span className="demo-colors__key">{variant}</span>

                    <div className="demo-colors__meta">
                        <span className="demo-colors__hex-code">#{colorDescription.hex}</span>
                        {colorDescription.rgb.a < 1 && (
                            <span className="demo-colors__opacity">{colorDescription.rgb.a * 100}%</span>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export { DemoColor };
