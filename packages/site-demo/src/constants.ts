import { ReactNode } from 'react';

import { ColorPalette } from '@lumx/react';

/////////////////////////////
//                         //
//    Public attributes    //
//                         //
/////////////////////////////

enum Categories {
    components = 'Components',
}
type Category = Categories;

interface IDemoObject {
    /**
     * The description of the demo.
     */
    description?: ReactNode;

    /**
     * A list of complementary files to load when displaying the source code.
     */
    files?: string[];

    /**
     * The title of the demo.
     */
    title?: string;
}
type DemoObject = IDemoObject;

enum Theme {
    lumapps = 'lumapps',
    material = 'material',
}

/**
 * The available themes in the demo site.
 */
const THEMES = {
    lumapps: 'lumapps',
    material: 'material',
};

/**
 * The default theme to use in the demo site at startup.
 */
const DEFAULT_THEME = THEMES[Object.keys(THEMES)[0]];

/**
 * Color variant details
 */
interface IColorVariantDetail {
    hexCode: string;
    opacity: string;
    fontColor: string;
}

type IColorPaletteWithVariants = { [key in ColorPalette]: { [key in string]: IColorVariantDetail } };

/**
 * The icons to use in the template.
 */
const COLOR_VARIANTS = {
    blue: {
        D2: {
            fontColor: 'light',
            hexCode: '#2972e2',
        },
        D1: {
            fontColor: 'light',
            hexCode: '#2885f6',
        },
        // eslint-disable-next-line id-length
        N: {
            fontColor: 'light',
            hexCode: '#2493ff',
        },
        L1: {
            fontColor: 'dark',
            hexCode: '#2493ff',
            opacity: '80%',
        },
        L2: {
            fontColor: 'dark',
            hexCode: '#2493ff',
            opacity: '60%',
        },
        L3: {
            fontColor: 'dark',
            hexCode: '#2493ff',
            opacity: '40%',
        },
        L4: {
            fontColor: 'dark',
            hexCode: '#2493ff',
            opacity: '20%',
        },
        L5: {
            fontColor: 'dark',
            hexCode: '#2493ff',
            opacity: '10%',
        },
        L6: {
            fontColor: 'dark',
            hexCode: '#2493ff',
            opacity: '5%',
        },
    },
    dark: {
        // eslint-disable-next-line id-length
        N: {
            fontColor: 'light',
            hexCode: '#28336d',
        },
        L1: {
            fontColor: 'light',
            hexCode: '#28336d',
            opacity: '80%',
        },
        L2: {
            fontColor: 'light',
            hexCode: '#28336d',
            opacity: '60%',
        },
        L3: {
            fontColor: 'dark',
            hexCode: '#28336d',
            opacity: '40%',
        },
        L4: {
            fontColor: 'dark',
            hexCode: '#28336d',
            opacity: '20%',
        },
        L5: {
            fontColor: 'dark',
            hexCode: '#28336d',
            opacity: '10%',
        },
        L6: {
            fontColor: 'dark',
            hexCode: '#28336d',
            opacity: '5%',
        },
    },
    light: {
        // eslint-disable-next-line id-length
        N: {
            fontColor: 'dark',
            hexCode: '#fff',
        },
        L1: {
            fontColor: 'dark',
            hexCode: '#fff',
            opacity: '90%',
        },
        L2: {
            fontColor: 'dark',
            hexCode: '#fff',
            opacity: '80%',
        },
        L3: {
            fontColor: 'dark',
            hexCode: '#fff',
            opacity: '60%',
        },
        L4: {
            fontColor: 'light',
            hexCode: '#fff',
            opacity: '40%',
        },
        L5: {
            fontColor: 'light',
            hexCode: '#fff',
            opacity: '20%',
        },
        L6: {
            fontColor: 'light',
            hexCode: '#fff',
            opacity: '10%',
        },
    },
    yellow: {
        D2: {
            fontColor: 'light',
            hexCode: '#fea41c',
        },
        D1: {
            fontColor: 'dark',
            hexCode: '#ffb71f',
        },
        // eslint-disable-next-line id-length
        N: {
            fontColor: 'dark',
            hexCode: '#ffc525',
        },
        L1: {
            fontColor: 'dark',
            hexCode: '#ffc525',
            opacity: '80%',
        },
        L2: {
            fontColor: 'dark',
            hexCode: '#ffc525',
            opacity: '60%',
        },
        L3: {
            fontColor: 'dark',
            hexCode: '#ffc525',
            opacity: '40%',
        },
        L4: {
            fontColor: 'dark',
            hexCode: '#ffc525',
            opacity: '20%',
        },
        L5: {
            fontColor: 'dark',
            hexCode: '#ffc525',
            opacity: '10%',
        },
        L6: {
            fontColor: 'dark',
            hexCode: '#ffc525',
            opacity: '5%',
        },
    },
    red: {
        D2: {
            fontColor: 'light',
            hexCode: '#c2395a',
        },
        D1: {
            fontColor: 'light',
            hexCode: '#d83e5e',
        },
        // eslint-disable-next-line id-length
        N: {
            fontColor: 'light',
            hexCode: '#e94361',
        },
        L1: {
            fontColor: 'dark',
            hexCode: '#e94361',
            opacity: '80%',
        },
        L2: {
            fontColor: 'dark',
            hexCode: '#e94361',
            opacity: '60%',
        },
        L3: {
            fontColor: 'dark',
            hexCode: '#e94361',
            opacity: '40%',
        },
        L4: {
            fontColor: 'dark',
            hexCode: '#e94361',
            opacity: '20%',
        },
        L5: {
            fontColor: 'dark',
            hexCode: '#e94361',
            opacity: '10%',
        },
        L6: {
            fontColor: 'dark',
            hexCode: '#e94361',
            opacity: '5%',
        },
    },
    green: {
        D2: {
            fontColor: 'light',
            hexCode: '#008f4e',
        },
        D1: {
            fontColor: 'light',
            hexCode: '#0fa15a',
        },
        // eslint-disable-next-line id-length
        N: {
            fontColor: 'light',
            hexCode: '#19b065',
        },
        L1: {
            fontColor: 'dark',
            hexCode: '#19b065',
            opacity: '80%',
        },
        L2: {
            fontColor: 'dark',
            hexCode: '#19b065',
            opacity: '60%',
        },
        L3: {
            fontColor: 'dark',
            hexCode: '#19b065',
            opacity: '40%',
        },
        L4: {
            fontColor: 'dark',
            hexCode: '#19b065',
            opacity: '20%',
        },
        L5: {
            fontColor: 'dark',
            hexCode: '#19b065',
            opacity: '10%',
        },
        L6: {
            fontColor: 'dark',
            hexCode: '#19b065',
            opacity: '5%',
        },
    },
};

/////////////////////////////

export { DEFAULT_THEME, THEMES, COLOR_VARIANTS, Theme, IColorPaletteWithVariants, IColorVariantDetail, Categories, Category, DemoObject };
