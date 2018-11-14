(function IIFE() {
    'use strict';

    /////////////////////////////

    LxDropdownService.$inject = ['$rootScope'];

    function LxDropdownService($rootScope) {
        var service = this;

        /////////////////////////////
        //                         //
        //    Private attributes   //
        //                         //
        /////////////////////////////

        /**
         * The active dropdown uuid.
         *
         * @type {string}
         */
        var _activeDropdownUuid;

        /////////////////////////////
        //                         //
        //     Public functions    //
        //                         //
        /////////////////////////////

        /**
         * Close a given dropdown.
         *
         * @param {string} uuid The dropdown uuid.
         */
        function close(uuid) {
            $rootScope.$broadcast('lx-dropdown__close', {
                uuid: uuid
            });
        }

        /**
         * Close the active dropdown.
         */
        function closeActiveDropdown() {
            if (angular.isDefined(_activeDropdownUuid) && _activeDropdownUuid.length > 0) {
                $rootScope.$broadcast('lx-dropdown__close', {
                    uuid: _activeDropdownUuid
                });
            }
        }

        /**
         * Open a given dropdown.
         *
         * @param {string} uuid   The dropdown uuid.
         * @param {string} target The dropdown target.
         */
        function open(uuid, target) {
            $rootScope.$broadcast('lx-dropdown__open', {
                uuid: uuid,
                target: target
            });
        }

        /**
         * Check if a given dropdown is open.
         *
         * @param  {string}  uuid The dropdown uuid.
         * @return {boolean} Wether the given dropdown is open or not.
         */
        function isOpen(uuid) {
            return _activeDropdownUuid === uuid;
        }

        /**
         * Register the active dropdown uuid.
         *
         * @param {string} uuid The dropdown uuid.
         */
        function registerActiveDropdownUuid(uuid) {
            _activeDropdownUuid = uuid;
        }

        /**
         * Reset the active dropdown uuid.
         */
        function resetActiveDropdownUuid() {
            _activeDropdownUuid = undefined;
        }

        /////////////////////////////

        service.close = close;
        service.closeActiveDropdown = closeActiveDropdown;
        service.open = open;
        service.isOpen = isOpen;
        service.registerActiveDropdownUuid = registerActiveDropdownUuid;
        service.resetActiveDropdownUuid = resetActiveDropdownUuid;
    }

    /////////////////////////////

    angular.module('lumx.dropdown').service('LxDropdownService', LxDropdownService);
})();
