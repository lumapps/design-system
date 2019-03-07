import { MODULE_NAME } from 'LumX/angularjs/constants/common_constants';

/////////////////////////////

function LxUtilsService() {
    'ngInject';

    const service = this;

    /////////////////////////////
    //                         //
    //     Public functions    //
    //                         //
    /////////////////////////////

    /**
     * Disable body scroll.
     */
    function disableBodyScroll() {
        angular.element('body').css({
            overflow: 'hidden',
        });
    }

    /**
     * Restore body scroll.
     */
    function restoreBodyScroll() {
        angular.element('body').css({
            overflow: 'visible',
        });
    }

    /**
     * Generate a unique identifier.
     *
     * @return {string} A unique identifier.
     */
    function generateUUID() {
        /* eslint-disable no-bitwise, no-magic-numbers */
        let time = new Date().getTime();

        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
            const random = (time + Math.random() * 16) % 16 | 0;
            time = Math.floor(time / 16);

            return (char === 'x' ? random : (random & 0x3) | 0x8).toString(16);
        });
        /* eslint-enable no-bitwise, no-magic-numbers */
    }

    /////////////////////////////

    service.disableBodyScroll = disableBodyScroll;
    service.restoreBodyScroll = restoreBodyScroll;
    service.generateUUID = generateUUID;
}

/////////////////////////////

angular.module(`${MODULE_NAME}.utils.utils`).service('LxUtilsService', LxUtilsService);

/////////////////////////////

export { LxUtilsService };
