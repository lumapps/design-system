import { Categories, Category, DemoObject } from 'LumX/demo/react/constants';

/////////////////////////////

/**
 * The title of the demo.
 */
const title: string = 'Notifications';

/**
 * The category of the demo.
 */
const category: Category = Categories.components;

const demos: { [demoName: string]: DemoObject } = {
    /* tslint:disable: object-literal-sort-keys */
    default: {
        title: 'Default',
    },
    /* tslint:enable: object-literal-sort-keys */
};

/////////////////////////////

export { category, title, demos };
