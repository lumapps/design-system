import { setCustomColors } from '@lumx/core/js/custom-colors';
import { GlobalTheme } from '@lumx/core/js/types';

/**
 * Set primary and secondary custom colors.
 *
 * @param theme The theme to apply the custom color palette on.
 */
function setDemoCustomColors(theme: GlobalTheme) {
    const styleTag = document.createElement('style');
    document.head.appendChild(styleTag);

    const { sheet } = styleTag;

    setCustomColors(sheet as CSSStyleSheet, theme, {
        primary: {
            D2: '#fea41c',
            D1: '#ffb71f',
            N: '#ffc525',
            L1: 'rgba(255, 197, 37, 0.8)',
            L2: 'rgba(255, 197, 37, 0.6)',
            L3: 'rgba(255, 197, 37, 0.4)',
            L4: 'rgba(255, 197, 37, 0.2)',
            L5: 'rgba(255, 197, 37, 0.1)',
            L6: 'rgba(255, 197, 37, 0.05)',
        },
        secondary: {
            D2: '#c2395a',
            D1: '#d83e5e',
            N: '#e94361',
            L1: 'rgba(233, 67, 97, 0.8)',
            L2: 'rgba(233, 67, 97, 0.6)',
            L3: 'rgba(233, 67, 97, 0.4)',
            L4: 'rgba(233, 67, 97, 0.2)',
            L5: 'rgba(233, 67, 97, 0.1)',
            L6: 'rgba(233, 67, 97, 0.05)',
        },
    });
}

export { setDemoCustomColors };
