import { MODULE_NAME, SERVICE_PREFIX } from 'LumX/angularjs/constants/common_constants';

/////////////////////////////

/**
 * The color palette.
 *
 * @type {Array}
 * @constant
 * @readonly
 */
const ThemeConstant = ['primary', 'secondary', 'blue', 'yellow', 'red', 'green'];

/////////////////////////////

angular.module(`${MODULE_NAME}.theme`).constant(`${SERVICE_PREFIX}ThemeConstant`, ThemeConstant);

/////////////////////////////

export { ThemeConstant };
