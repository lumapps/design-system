import { Categories, Category, DemoObject } from 'LumX/demo/react/constants';

/////////////////////////////

/**
 * The title of the demo.
 */
const title: string = 'Tooltips';

/**
 * The category of the demo.
 */
const category: Category = Categories.components;

/**
 * The description of the component.
 */
const description: string = '';

const demos: { [demoName: string]: DemoObject } = {
    /* Tslint:disable: object-literal-sort-keys. */
    default: {
        description: '',
        title: 'Default',
    },
    /* Tslint:enable: object-literal-sort-keys. */
};

/////////////////////////////

export { category, description, title, demos };
