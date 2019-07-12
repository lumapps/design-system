import { Categories, Category, DemoObject } from 'LumX/demo/react/constants';

/////////////////////////////

/**
 * The title of the demo.
 */
const title = 'Selects';

/**
 * The category of the demo.
 */
const category: Category = Categories.components;

/**
 * The description of the component.
 */
const description =
    'Selects display options in a list and present the users choice in the list box. Use it when users need to select one or more options.';

const demos: { [demoName: string]: DemoObject } = {
    /* tslint:disable: object-literal-sort-keys */
    default: {
        description: '',
        title: 'Single selection',
    },
    multiSelection: {
        description: '',
        title: 'Multi selection',
    },
    multiSelectionWithSearch: {
        description: '',
        title: 'Multi selection with search',
    },
    selectValid: {
        description: '',
        title: 'Select valid',
    },
    selectInvalid: {
        description: '',
        title: 'Select invalid',
    },
    chipSelection: {
        description: '',
        title: 'Chip selection',
    },
    mutiChipSelection: {
        description: '',
        title: 'Multi Chip selection',
    },
    /* tslint:enable: object-literal-sort-keys */
};

/////////////////////////////

export { category, description, title, demos };
