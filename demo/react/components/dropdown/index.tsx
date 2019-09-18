import { Categories, Category, DemoObject } from 'LumX/demo/react/constants';

/////////////////////////////

/**
 * The title of the demo.
 */
const title = 'Dropdown';

/**
 * The category of the demo.
 */
const category: Category = Categories.components;

/**
 * The description of the component.
 */
const description = 'Dropdowns present multiple actions in a small area.';

// Dropdowns are commonly used for contextual menus and in form selects. They can contain dividers, icons, a user picture and a thumbnail.

const demos: { [demoName: string]: DemoObject } = {
    /* Tslint:disable: object-literal-sort-keys. */
    default: {},
    target: {},
    /* Tslint:enable: object-literal-sort-keys. */
};

/////////////////////////////

export { category, description, title, demos };
