import { expectTypeOf } from 'vitest';

import { IconButton } from '../button';
import { Chip } from '../chip';
import { Link } from '../link';

import { type MenuTriggerProps } from './MenuTrigger';

describe('Type tests', () => {
    it('default trigger exposes Button props', () => {
        expectTypeOf<MenuTriggerProps>().toHaveProperty('emphasis');
        expectTypeOf<MenuTriggerProps>().toHaveProperty('size');
        expectTypeOf<MenuTriggerProps>().toHaveProperty('isDisabled');
        expectTypeOf<MenuTriggerProps>().toHaveProperty('leftIcon');
    });

    it('as={IconButton} exposes icon and label', () => {
        expectTypeOf<MenuTriggerProps<typeof IconButton>>().toHaveProperty('icon');
        expectTypeOf<MenuTriggerProps<typeof IconButton>>().toHaveProperty('label');
    });

    it('as={Chip} exposes isClickable and size', () => {
        expectTypeOf<MenuTriggerProps<typeof Chip>>().toHaveProperty('isClickable');
        expectTypeOf<MenuTriggerProps<typeof Chip>>().toHaveProperty('size');
    });

    it('as={Link} accepts href and rightIcon', () => {
        expectTypeOf<MenuTriggerProps<typeof Link>>().toHaveProperty('href');
        expectTypeOf<MenuTriggerProps<typeof Link>>().toHaveProperty('rightIcon');
    });
});
