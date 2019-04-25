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
const description: string = '';

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
    tooltip: {
        description:
            'Popover can be used to create a tootltip behavior i.e. On hovering a target pop a component anchored to the target. When the mouse exists the target the poped element is hidden.',
        title: 'Popover with tooltip behavior',
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
        title: 'Popover match the anchor width',
    },
    realCase: {
        description: '',
        title: 'Using advanced components',
    },
    /* tslint:enable: object-literal-sort-keys */
};

/////////////////////////////

export { category, description, title, demos };
