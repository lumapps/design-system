import { MODULE_NAME } from '@lumx/angularjs/lumx'

/////////////////////////////

/**
 * The color palette.
 *
 * @type {Array}
 * @constant
 * @readonly
 */
const LxThemeConstant = ['primary', 'secondary', 'blue', 'yellow', 'red', 'green'];

/////////////////////////////

angular.module(`${MODULE_NAME}.theme`).constant('LxThemeConstant', LxThemeConstant);

/////////////////////////////

export { LxThemeConstant };
