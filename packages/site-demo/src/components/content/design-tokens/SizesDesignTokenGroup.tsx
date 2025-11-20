import { DesignToken } from './DesignToken';
import { DesignTokenGroup } from './DesignTokenGroup';

const SIZES = {
    xxs: 14,
    xs: 20,
    s: 24,
    m: 36,
    l: 64,
    xl: 128,
    xxl: 256,
};

/**
 * Component used to present size design tokens in the documentation site.
 *
 * @return ReactElement.
 */
export const SizesDesignTokenGroup: React.FC = () => (
    <DesignTokenGroup>
        {Object.entries(SIZES).map(([key, size], index) => (
            <DesignToken key={index} name={`$lumx-size-${key}`} description="Version: 0.25" value={`${size}px`}>
                <div className="lumx-color-background-primary-N" style={{ width: size, height: size }} />
            </DesignToken>
        ))}
    </DesignTokenGroup>
);
