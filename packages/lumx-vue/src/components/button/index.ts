import { CLASSNAME } from '@lumx/core/js/components/Button/Button';
import { IconButtonProps, CLASSNAME as ICON_BUTTON_CLASSNAME } from '@lumx/core/js/components/Button/IconButton';
import { ButtonGroupProps, CLASSNAME as BUTTON_GROUP_CLASSNAME } from '@lumx/core/js/components/Button/ButtonGroup';

import Button, { ButtonProps } from './Button';
import IconButton from './IconButton.vue';
import ButtonGroup from './ButtonGroup.vue';

Button.className = CLASSNAME;
ButtonGroup.className = BUTTON_GROUP_CLASSNAME;
IconButton.className = ICON_BUTTON_CLASSNAME;

export { Button, ButtonGroup, IconButton };
export type { ButtonProps, ButtonGroupProps, IconButtonProps };
