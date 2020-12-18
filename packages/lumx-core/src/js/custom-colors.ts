interface Variants {
    D2?: string;
    D1?: string;
    N?: string;
    L1?: string;
    L2?: string;
    L3?: string;
    L4?: string;
    L5?: string;
    L6?: string;
}

type ColorPalette = Partial<Record<'primary' | 'secondary', Variants>>;

/**
 * Generate CSS variables for the given color palette.
 */
export function generateCSSColorVariables(palette: ColorPalette): string {
    let output = '';
    for (const [color, variants] of Object.entries(palette)) {
        if (!variants) continue;

        for (const [variantName, colorValue] of Object.entries(variants)) {
            output += `--lumx-color-${color}-${variantName}: ${colorValue};\n`;
        }
    }
    return output;
}

/**
 * Add a css rule in a given sheet.
 *
 * @param sheet    The sheet to insert the new rules in.
 * @param selector The css rules selector.
 * @param rules    The css rules.
 * @param index    The css rule index.
 */
function _addCSSRule(sheet: CSSStyleSheet, selector: string, rules: string, index: number) {
    if ('insertRule' in sheet) {
        sheet.insertRule(`${selector}{${rules}}`, index);
    } else if ('addRule' in sheet) {
        (sheet as any).addRule(selector, rules, index);
    }
}

/**
 * Set primary and secondary custom colors.
 *
 * @param sheet        The sheet to insert the custom rules in.
 * @param colorPalette The custom color palette.
 * @param selector     The selector used to scope the custom colors (defaults to ':root').
 */
export function setCustomColors(sheet: CSSStyleSheet, colorPalette: ColorPalette, selector = ':root') {
    const rules = generateCSSColorVariables(colorPalette);
    _addCSSRule(sheet, selector, rules, 0);
}
