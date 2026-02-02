import { ButtonProps, CLASSNAME } from '@lumx/core/js/components/Button/Button';
import { ButtonGroupProps, CLASSNAME as BUTTON_GROUP_CLASSNAME } from '@lumx/core/js/components/Button/ButtonGroup';

import Button from './Button.vue';
import ButtonGroup from './ButtonGroup.vue';

Button.className = CLASSNAME;
ButtonGroup.className = BUTTON_GROUP_CLASSNAME;

export { Button, ButtonGroup };
export type { ButtonProps, ButtonGroupProps };
