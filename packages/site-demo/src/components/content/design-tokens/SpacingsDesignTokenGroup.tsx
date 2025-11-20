import { DesignToken } from './DesignToken';
import { DesignTokenGroup } from './DesignTokenGroup';

const SPACINGS = {
    tiny: 4,
    regular: 8,
    big: 16,
    huge: 24,
};

/**
 * Component used to present spacing design tokens in the documentation site.
 *
 * @return ReactElement.
 */
export const SpacingsDesignTokenGroup: React.FC = () => (
    <DesignTokenGroup>
        {Object.entries(SPACINGS).map(([key, size], index) => (
            <DesignToken key={index} name={`$lumx-spacing-unit-${key}`} description="Version: 0.1" value={`${size}px`}>
                <div style={{ border: '1px dashed rgba(40, 51, 109, 0.2)' }}>
                    <div
                        className={`lumx-color-background-primary-N lumx-spacing-margin-${key}`}
                        style={{ height: 100 }}
                    />
                </div>
            </DesignToken>
        ))}
    </DesignTokenGroup>
);
