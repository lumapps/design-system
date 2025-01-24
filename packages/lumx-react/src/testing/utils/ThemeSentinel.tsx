import React from 'react';
import { useTheme } from '@lumx/react/utils/theme/ThemeContext';

const TEST_ID = 'theme-sentinel';

/** Test component used as sentinel to detect the value of the theme context */
export function ThemeSentinel() {
    const theme = useTheme();
    return <div data-testid={TEST_ID} className={`--theme-${theme}`} />;
}
ThemeSentinel.testId = TEST_ID;
