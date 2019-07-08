import { Categories, Category, DemoObject } from 'LumX/demo/react/constants';

/////////////////////////////

/**
 * The title of the demo.
 */
const title = 'Expansion panel';

/**
 * The category of the demo.
 */
const category: Category = Categories.components;

/**
 * The description of the component.
 */
const description = '';

const demos: { [demoName: string]: DemoObject } = {
    label: {
        description: '',
        title: 'Default',
    },
    trimmed: {
        description: '',
        title: 'Trimmed variant',
    },
    header: {
        description: '',
        title: 'Custom header',
    },
    complex: {
        description: '',
        title: 'Complex content',
    },
};

/////////////////////////////

export { category, description, title, demos };
