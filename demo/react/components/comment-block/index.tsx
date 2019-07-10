import { Categories, Category, DemoObject } from 'LumX/demo/react/constants';

/////////////////////////////

/**
 * The title of the demo.
 */
const title = 'CommentBlocks';

/**
 * The category of the demo.
 */
const category: Category = Categories.components;

/**
 * The description of the component.
 */
const description = '';

const demos: { [demoName: string]: DemoObject } = {
    /* tslint:disable: object-literal-sort-keys */
    default: {},
    /* tslint:enable: object-literal-sort-keys */
};

/////////////////////////////

export { category, description, title, demos };
