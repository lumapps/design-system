import { MODULE_NAME } from './constants/common_constants';

angular.module(`${MODULE_NAME}.utils.depth`, []);
angular.module(`${MODULE_NAME}.utils.enter-keypress`, []);
angular.module(`${MODULE_NAME}.utils.event-scheduler`, []);
angular.module(`${MODULE_NAME}.utils.focus-on-init`, []);
angular.module(`${MODULE_NAME}.utils.focus-trap`, []);
angular.module(`${MODULE_NAME}.utils.stop-propagation`, []);
angular.module(`${MODULE_NAME}.utils.utils`, []);

angular.module(`${MODULE_NAME}.utils`, [
    `${MODULE_NAME}.utils.depth`,
    `${MODULE_NAME}.utils.enter-keypress`,
    `${MODULE_NAME}.utils.event-scheduler`,
    `${MODULE_NAME}.utils.focus-on-init`,
    `${MODULE_NAME}.utils.focus-trap`,
    `${MODULE_NAME}.utils.stop-propagation`,
    `${MODULE_NAME}.utils.utils`,
]);

angular.module(`${MODULE_NAME}.avatar`, []);
angular.module(`${MODULE_NAME}.button`, []);
angular.module(`${MODULE_NAME}.checkbox`, []);
angular.module(`${MODULE_NAME}.chip`, []);
angular.module(`${MODULE_NAME}.comment-block`, []);
angular.module(`${MODULE_NAME}.dialog`, []);
angular.module(`${MODULE_NAME}.divider`, []);
angular.module(`${MODULE_NAME}.drag-handle`, []);
angular.module(`${MODULE_NAME}.dropdown`, []);
angular.module(`${MODULE_NAME}.editable-media`, []);
angular.module(`${MODULE_NAME}.expansion-panel`, []);
angular.module(`${MODULE_NAME}.grid`, []);
angular.module(`${MODULE_NAME}.icon`, []);
angular.module(`${MODULE_NAME}.image-block`, []);
angular.module(`${MODULE_NAME}.lightbox`, []);
angular.module(`${MODULE_NAME}.link`, []);
angular.module(`${MODULE_NAME}.list`, []);
angular.module(`${MODULE_NAME}.notification`, []);
angular.module(`${MODULE_NAME}.popover`, []);
angular.module(`${MODULE_NAME}.post-block`, []);
angular.module(`${MODULE_NAME}.progress`, []);
angular.module(`${MODULE_NAME}.progress-tracker`, []);
angular.module(`${MODULE_NAME}.radio-button`, []);
angular.module(`${MODULE_NAME}.select`, []);
angular.module(`${MODULE_NAME}.side-navigation`, []);
angular.module(`${MODULE_NAME}.slideshow`, []);
angular.module(`${MODULE_NAME}.switch`, []);
angular.module(`${MODULE_NAME}.table`, []);
angular.module(`${MODULE_NAME}.tabs`, []);
angular.module(`${MODULE_NAME}.text-field`, []);
angular.module(`${MODULE_NAME}.theme`, []);
angular.module(`${MODULE_NAME}.thumbnail`, []);
angular.module(`${MODULE_NAME}.toolbar`, []);
angular.module(`${MODULE_NAME}.tooltip`, []);
angular.module(`${MODULE_NAME}.user-block`, []);

angular.module(MODULE_NAME, [
    `${MODULE_NAME}.avatar`,
    `${MODULE_NAME}.button`,
    `${MODULE_NAME}.checkbox`,
    `${MODULE_NAME}.chip`,
    `${MODULE_NAME}.comment-block`,
    `${MODULE_NAME}.dialog`,
    `${MODULE_NAME}.divider`,
    `${MODULE_NAME}.drag-handle`,
    `${MODULE_NAME}.dropdown`,
    `${MODULE_NAME}.editable-media`,
    `${MODULE_NAME}.expansion-panel`,
    `${MODULE_NAME}.grid`,
    `${MODULE_NAME}.icon`,
    `${MODULE_NAME}.image-block`,
    `${MODULE_NAME}.lightbox`,
    `${MODULE_NAME}.link`,
    `${MODULE_NAME}.list`,
    `${MODULE_NAME}.notification`,
    `${MODULE_NAME}.popover`,
    `${MODULE_NAME}.post-block`,
    `${MODULE_NAME}.progress`,
    `${MODULE_NAME}.progress-tracker`,
    `${MODULE_NAME}.radio-button`,
    `${MODULE_NAME}.select`,
    `${MODULE_NAME}.side-navigation`,
    `${MODULE_NAME}.slideshow`,
    `${MODULE_NAME}.switch`,
    `${MODULE_NAME}.tabs`,
    `${MODULE_NAME}.table`,
    `${MODULE_NAME}.text-field`,
    `${MODULE_NAME}.theme`,
    `${MODULE_NAME}.utils`,
    `${MODULE_NAME}.thumbnail`,
    `${MODULE_NAME}.toolbar`,
    `${MODULE_NAME}.tooltip`,
    `${MODULE_NAME}.user-block`,
]);
