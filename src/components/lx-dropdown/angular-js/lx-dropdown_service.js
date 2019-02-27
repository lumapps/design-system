function LxDropdownService($rootScope) {
    const service = this;

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
    let _activeDropdownUuid;

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
    function closeDropdown(uuid) {
        $rootScope.$broadcast('lx-dropdown__close', {
            uuid,
        });
    }

    /**
     * Close the active dropdown.
     */
    function closeActiveDropdown() {
        if (angular.isDefined(_activeDropdownUuid) && _activeDropdownUuid.length > 0) {
            $rootScope.$broadcast('lx-dropdown__close', {
                uuid: _activeDropdownUuid,
            });
        }
    }

    /**
     * Open a given dropdown.
     *
     * @param {string} uuid   The dropdown uuid.
     * @param {string} target The dropdown target.
     * @param {string} source The dropdown source.
     */
    function openDropdown(uuid, target, source) {
        $rootScope.$broadcast('lx-dropdown__open', {
            source,
            target,
            uuid,
        });
    }

    /**
     * Check if a given dropdown is open.
     *
     * @param  {string}  uuid The dropdown uuid.
     * @return {boolean} Whether the given dropdown is open or not.
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

    service.close = closeDropdown;
    service.closeActiveDropdown = closeActiveDropdown;
    service.open = openDropdown;
    service.isOpen = isOpen;
    service.registerActiveDropdownUuid = registerActiveDropdownUuid;
    service.resetActiveDropdownUuid = resetActiveDropdownUuid;
}

/////////////////////////////

angular.module('lumx.dropdown').service('LxDropdownService', LxDropdownService);

/////////////////////////////

export { LxDropdownService };
