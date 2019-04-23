import { Categories, Category, DemoObject } from 'LumX/demo/react/constants';

/////////////////////////////

/**
 * The title of the demo.
 */
const title: string = 'Popovers';

/**
 * The category of the demo.
 */
const category: Category = Categories.components;

/**
 * The description of the component.
 */
const description: string =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis eu sem et mauris convallis tempor. Mauris placerat enim eget ligula fermentum, in aliquam lorem congue. Vivamus lacinia consectetur mollis.';

const demos: { [demoName: string]: DemoObject } = {
    /* tslint:disable: object-literal-sort-keys */
    default: {
        description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis eu sem et mauris convallis tempor. Mauris placerat enim eget ligula fermentum, in aliquam lorem congue. Vivamus lacinia consectetur mollis.',
        title: 'Default',
    },
    /* tslint:enable: object-literal-sort-keys */
};

/////////////////////////////

export { category, description, title, demos };
