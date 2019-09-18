import { Categories, Category, DemoObject } from 'LumX/demo/react/constants';

/////////////////////////////

/**
 * The title of the demo.
 */
const title = 'Radio Button';

/**
 * The category of the demo.
 */
const category: Category = Categories.components;

/**
 * The description of the component.
 */
const description = 'Radio buttons display exclusive options to chose from.';

const demos: { [demoName: string]: DemoObject } = {
    /* Tslint:disable: object-literal-sort-keys. */
    default: {
        description: '',
        title: 'Default',
    },
    'with-helpers': {
        title: 'With helpers',
    },
    /* Tslint:enable: object-literal-sort-keys. */
};

/////////////////////////////

export { category, description, title, demos };
