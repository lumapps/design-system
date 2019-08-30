import { mdiAccessPoint, mdiAccountBadge, mdiAlphaF } from '@mdi/js';

const CHOICES = ['First item', 'Second item', 'Third item'];
const CHOICES_WITH_ICONS = [
    {
        label: 'First item',
        icon: mdiAccessPoint,
    },
    {
        label: 'Second item',
        icon: mdiAccountBadge,
    },
    {
        label: 'Third item',
        icon: mdiAlphaF,
    },
];

const LABEL = 'Select label';

const PLACEHOLDER = 'Select a value';

export { CHOICES, CHOICES_WITH_ICONS, LABEL, PLACEHOLDER };
