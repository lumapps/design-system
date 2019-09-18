import { Categories, Category, DemoObject } from 'LumX/demo/react/constants';

/////////////////////////////

/**
 * The title of the demo.
 */
const title = 'Popovers';

/**
 * The category of the demo.
 */
const category: Category = Categories.components;

/**
 * The description of the component.
 */
const description =
    'Popovers can be used as a component to position floating elements over the UI but also as a based element to build advanced behavior like tooltips, dropdown selectors, on hover details ... Etc.';

const demos: { [demoName: string]: DemoObject } = {
    /* tslint:disable: object-literal-sort-keys */
    default: {
        description: 'Popover can be used to display elements above the rest of the UI.',
        title: 'Default behavior',
    },
    offsets: {
        description: 'Popover can be offseted from its anchor point.',
        title: 'Using offsets',
    },
    controled: {
        description: '',
        title: 'Control the popper visibility',
    },
    placements: {
        description: 'Popover can be placed using one of 15 anchor points.',
        title: 'Using anchor point',
    },
    matchParentWidth: {
        description: 'You can force the width of the popper to match the anchor width.',
        title: 'Popover matches the anchor width',
    },
    realCase: {
        description: '',
        title: 'Using advanced components',
    },
    /* tslint:enable: object-literal-sort-keys */
};

/////////////////////////////

export { category, description, title, demos };
