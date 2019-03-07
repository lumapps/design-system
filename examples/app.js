/* eslint-disable import/unambiguous */

const MODULE = angular.module('lumx-example-app', ['@lumx/angularjs']);

MODULE.config(() => {
    // eslint-disable-next-line no-console
    console.log('Application configuration started');
}).run((LxNotificationService) => {
    LxNotificationService.success('LumX Example Application successfully started!');
});
