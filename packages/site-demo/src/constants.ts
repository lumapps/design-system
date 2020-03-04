import { ColorPalette } from '@lumx/react';
import { ReactNode } from 'react';

enum Categories {
    components = 'Components',
}

type Category = Categories;

interface DemoObject {
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

/**
 * Color variant details
 */
interface ColorVariantDetail {
    hexCode: string;
    opacity: string;
    fontColor: string;
}

type ColorPaletteWithVariants = { [key in ColorPalette]: { [key2 in string]: ColorVariantDetail } };

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

export { COLOR_VARIANTS, ColorPaletteWithVariants, ColorVariantDetail, Categories, Category, DemoObject };
