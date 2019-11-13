import { Categories, Category, DemoObject } from 'LumX/demo/react/constants';

/////////////////////////////

/**
 * The title of the demo.
 */
const title = 'Toolbars';

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
    default: {
        description:
            'A toolbar has three sections. An optional contextual icon button and a title on the left, contextual actions on the right.',
        title: 'Toolbars display information and actions related to the context.',
    },
    /* tslint:enable: object-literal-sort-keys */
};

/////////////////////////////

export { category, description, title, demos };
