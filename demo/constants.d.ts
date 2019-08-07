/////////////////////////////
//                         //
//    Public attributes    //
//                         //
/////////////////////////////

/**
 * Defines the allowed themes.
 */
import { ColorPalette } from "LumX";

declare enum Theme {
    lumapps = 'lumapps',
    material = 'material',
}

/**
 * The available themes in the demo site.
 */
declare const THEMES: { [key in Theme]: Theme };

/**
 * The default theme to use in the demo site at startup.
 */
declare const DEFAULT_THEME: Theme;

/**
 * Color variant details
 */
interface IColorVariantDetail {
    hexCode: string;
    opacity: string;
    fontColor: string;
}

type IColorPaletteWithVariants = { [key in ColorPalette]: { [key in string]: IColorVariantDetail}};

/**
 * Color palette with variants.
 */
declare const COLOR_VARIANTS: IColorPaletteWithVariants;

/////////////////////////////

export { THEMES, DEFAULT_THEME, Theme, IColorPaletteWithVariants, IColorVariantDetail, COLOR_VARIANTS };
