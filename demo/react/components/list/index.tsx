import { Categories, Category, DemoObject } from 'LumX/demo/react/constants';

/////////////////////////////

/**
 * The title of the demo.
 */
const title: string = 'Lists';

/**
 * The category of the demo.
 */
const category: Category = Categories.components;

/**
 * The description of the component.
 */
const description: string = 'List displays related content grouped together and organized vertically.';

const demos: { [demoName: string]: DemoObject } = {
    /* tslint:disable: object-literal-sort-keys */
    tiny: {
        title: 'Tiny',
    },
    default: {
        title: 'Default (Regular)',
    },
    big: {
        title: 'Big',
    },
    huge: {
        title: 'Huge',
    },
    /* tslint:enable: object-literal-sort-keys */
};

/////////////////////////////

export { category, description, title, demos };
