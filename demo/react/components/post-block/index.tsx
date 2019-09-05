import { Categories, DemoObject } from 'LumX/demo/react/constants';

/////////////////////////////

/**
 * The title of the demo.
 */
const title = 'PostBlocks';

/**
 * The category of the demo.
 */
const category = Categories.components;

/**
 * The description of the component.
 */
const description = 'Display a Lumapps post';

const demos: { [demoName: string]: DemoObject } = {
    /* tslint:disable: object-literal-sort-keys */
    default: {},
    /* tslint:enable: object-literal-sort-keys */
};

/////////////////////////////

export { category, description, title, demos };
