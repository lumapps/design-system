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
            rgb: 'rgb(41,114,226)',
            opacity: '100%',
            description: 'The most darker value of blue color',
        },
        D1: {
            fontColor: 'light',
            hexCode: '#2885f6',
            rgb: 'rgb(40,133,246)',
            opacity: '100%',
            description: 'The less darker value of blue color',
        },
        N: {
            fontColor: 'light',
            hexCode: '#2493ff',
            rgb: 'rgb(36,147,255)',
            opacity: '100%',
            description: 'The neutral value of blue color',
        },
        L1: {
            fontColor: 'dark',
            hexCode: '#2493ff',
            rgb: 'rgb(36,147,255)',
            opacity: '80%',
            description: 'Base dark color with 80% opacity',
        },
        L2: {
            fontColor: 'dark',
            hexCode: '#2493ff',
            rgb: 'rgb(36,147,255)',
            opacity: '60%',
            description: 'Base dark color with 60% opacity',
        },
        L3: {
            fontColor: 'dark',
            hexCode: '#2493ff',
            rgb: 'rgb(36,147,255)',
            opacity: '40%',
            description: 'Base dark color with 40% opacity',
        },
        L4: {
            fontColor: 'dark',
            hexCode: '#2493ff',
            rgb: 'rgb(36,147,255)',
            opacity: '20%',
            description: 'Base dark color with 20% opacity',
        },
        L5: {
            fontColor: 'dark',
            hexCode: '#2493ff',
            rgb: 'rgb(36,147,255)',
            opacity: '10%',
            description: 'Base dark color with 10% opacity',
        },
        L6: {
            fontColor: 'dark',
            hexCode: '#2493ff',
            rgb: 'rgb(36,147,255)',
            opacity: '5%',
            description: 'Base dark color with 5% opacity',
        },
    },
    dark: {
        N: {
            fontColor: 'light',
            hexCode: '#28336d',
            rgb: 'rgb(40,51,109)',
            opacity: '100%',
            description: 'The neutral value of base dark color',
        },
        L1: {
            fontColor: 'light',
            hexCode: '#28336d',
            rgb: 'rgb(40,51,109)',
            opacity: '80%',
            description: 'Base dark color with 80% opacity',
        },
        L2: {
            fontColor: 'light',
            hexCode: '#28336d',
            rgb: 'rgb(40,51,109)',
            opacity: '60%',
            description: 'Base dark color with 60% opacity',
        },
        L3: {
            fontColor: 'dark',
            hexCode: '#28336d',
            rgb: 'rgb(40,51,109)',
            opacity: '40%',
            description: 'Base dark color with 40% opacity',
        },
        L4: {
            fontColor: 'dark',
            hexCode: '#28336d',
            rgb: 'rgb(40,51,109)',
            opacity: '20%',
            description: 'Base dark color with 20% opacity',
        },
        L5: {
            fontColor: 'dark',
            hexCode: '#28336d',
            rgb: 'rgb(40,51,109)',
            opacity: '10%',
            description: 'Base dark color with 10% opacity',
        },
        L6: {
            fontColor: 'dark',
            hexCode: '#28336d',
            rgb: 'rgb(40,51,109)',
            opacity: '5%',
            description: 'Base dark color with 5% opacity',
        },
    },
    light: {
        N: {
            fontColor: 'dark',
            hexCode: '#fff',
            rgb: 'rgb(255,255,255)',
            opacity: '100%',
            description: 'The neutral value of light color',
        },
        L1: {
            fontColor: 'dark',
            hexCode: '#fff',
            rgb: 'rgb(255,255,255)',
            opacity: '90%',
            description: 'Light color with 90% opacity',
        },
        L2: {
            fontColor: 'dark',
            hexCode: '#fff',
            rgb: 'rgb(255,255,255)',
            opacity: '80%',
            description: 'Light color with 80% opacity',
        },
        L3: {
            fontColor: 'dark',
            hexCode: '#fff',
            rgb: 'rgb(255,255,255)',
            opacity: '60%',
            description: 'Light color with 60% opacity',
        },
        L4: {
            fontColor: 'light',
            hexCode: '#fff',
            rgb: 'rgb(255,255,255)',
            opacity: '40%',
            description: 'Light color with 40% opacity',
        },
        L5: {
            fontColor: 'light',
            hexCode: '#fff',
            rgb: 'rgb(255,255,255)',
            opacity: '20%',
            description: 'Light color with 20% opacity',
        },
        L6: {
            fontColor: 'light',
            hexCode: '#fff',
            rgb: 'rgb(255,255,255)',
            opacity: '10%',
            description: 'Light color with 10% opacity',
        },
    },
    yellow: {
        D2: {
            fontColor: 'light',
            hexCode: '#e16b00',
            rgb: 'rgb(225,107,0)',
            opacity: '100%',
            description: 'The most darker value of yellow color',
        },
        D1: {
            fontColor: 'dark',
            hexCode: '#fea41c',
            rgb: 'rgb(254,164,28)',
            opacity: '100%',
            description: 'The less darker value of yellow color',
        },
        N: {
            fontColor: 'dark',
            hexCode: '#ffc525',
            rgb: 'rgb(255,197,37)',
            opacity: '100%',
            description: 'The neutral value of yellow color',
        },
        L1: {
            fontColor: 'dark',
            hexCode: '#ffc525',
            rgb: 'rgb(255,197,37)',
            opacity: '80%',
            description: 'Yellow color with 80% opacity',
        },
        L2: {
            fontColor: 'dark',
            hexCode: '#ffc525',
            rgb: 'rgb(255,197,37)',
            opacity: '60%',
            description: 'Yellow color with 60% opacity',
        },
        L3: {
            fontColor: 'dark',
            hexCode: '#ffc525',
            rgb: 'rgb(255,197,37)',
            opacity: '40%',
            description: 'Yellow color with 40% opacity',
        },
        L4: {
            fontColor: 'dark',
            hexCode: '#ffc525',
            rgb: 'rgb(255,197,37)',
            opacity: '20%',
            description: 'Yellow color with 20% opacity',
        },
        L5: {
            fontColor: 'dark',
            hexCode: '#ffc525',
            rgb: 'rgb(255,197,37)',
            opacity: '10%',
            description: 'Yellow color with 10% opacity',
        },
        L6: {
            fontColor: 'dark',
            hexCode: '#ffc525',
            rgb: 'rgb(255,197,37)',
            opacity: '5%',
            description: 'Yellow color with 5% opacity',
        },
    },
    red: {
        D2: {
            fontColor: 'light',
            hexCode: '#c2395a',
            rgb: 'rgb(194,57,90)',
            opacity: '100%',
            description: 'The most darker value of red color',
        },
        D1: {
            fontColor: 'light',
            hexCode: '#d83e5e',
            rgb: 'rgb(216,62,94)',
            opacity: '100%',
            description: 'The less darker value of red color',
        },
        N: {
            fontColor: 'light',
            hexCode: '#e94361',
            rgb: 'rgb(233,67,97)',
            opacity: '100%',
            description: 'The neutral value of red color',
        },
        L1: {
            fontColor: 'dark',
            hexCode: '#e94361',
            rgb: 'rgb(233,67,97)',
            opacity: '80%',
            description: 'Red color with 80% opacity',
        },
        L2: {
            fontColor: 'dark',
            hexCode: '#e94361',
            rgb: 'rgb(233,67,97)',
            opacity: '60%',
            description: 'Red color with 60% opacity',
        },
        L3: {
            fontColor: 'dark',
            hexCode: '#e94361',
            rgb: 'rgb(233,67,97)',
            opacity: '40%',
            description: 'Red color with 40% opacity',
        },
        L4: {
            fontColor: 'dark',
            hexCode: '#e94361',
            rgb: 'rgb(233,67,97)',
            opacity: '20%',
            description: 'Red color with 20% opacity',
        },
        L5: {
            fontColor: 'dark',
            hexCode: '#e94361',
            rgb: 'rgb(233,67,97)',
            opacity: '10%',
            description: 'Red color with 10% opacity',
        },
        L6: {
            fontColor: 'dark',
            hexCode: '#e94361',
            rgb: 'rgb(233,67,97)',
            opacity: '5%',
            description: 'Red color with 5% opacity',
        },
    },
    green: {
        D2: {
            fontColor: 'light',
            hexCode: '#008f4e',
            rgb: 'rgb(0,143,78)',
            opacity: '100%',
            description: 'The most darker value of green color',
        },
        D1: {
            fontColor: 'light',
            hexCode: '#0fa15a',
            rgb: 'rgb(15,161,90)',
            opacity: '100%',
            description: 'The most darker value of green color',
        },
        N: {
            fontColor: 'light',
            hexCode: '#19b065',
            rgb: 'rgb(25,176,101)',
            opacity: '100%',
            description: 'The neutral value of green color',
        },
        L1: {
            fontColor: 'dark',
            hexCode: '#19b065',
            rgb: 'rgb(25,176,101)',
            opacity: '80%',
            description: 'Green color with 80% opacity',
        },
        L2: {
            fontColor: 'dark',
            hexCode: '#19b065',
            rgb: 'rgb(25,176,101)',
            opacity: '60%',
            description: 'Green color with 60% opacity',
        },
        L3: {
            fontColor: 'dark',
            hexCode: '#19b065',
            rgb: 'rgb(25,176,101)',
            opacity: '40%',
            description: 'Green color with 40% opacity',
        },
        L4: {
            fontColor: 'dark',
            hexCode: '#19b065',
            rgb: 'rgb(25,176,101)',
            opacity: '20%',
            description: 'Green color with 20% opacity',
        },
        L5: {
            fontColor: 'dark',
            hexCode: '#19b065',
            rgb: 'rgb(25,176,101)',
            opacity: '10%',
            description: 'Green color with 10% opacity',
        },
        L6: {
            fontColor: 'dark',
            hexCode: '#19b065',
            rgb: 'rgb(25,176,101)',
            opacity: '5%',
            description: 'Green color with 5% opacity',
        },
    },
};

export { COLOR_VARIANTS, ColorPaletteWithVariants, ColorVariantDetail, Categories, Category, DemoObject };
