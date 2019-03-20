import { COMPONENT_PREFIX, MODULE_NAME } from 'LumX/angularjs/constants/common_constants';

import { mdiAlertCircle, mdiCheckCircle, mdiClose, mdiCloseCircle, mdiMagnify, mdiMenuDown } from 'LumX/icons';

import template from './select.html';

/////////////////////////////

function SelectController($document, $interpolate, $sce, $scope, $timeout, LumXDropdownService, LumXUtilsService) {
    'ngInject';

    // eslint-disable-next-line consistent-this
    const lumx = this;

    /////////////////////////////
    //                         //
    //    Private attributes   //
    //                         //
    /////////////////////////////

    /**
     * The down key code.
     *
     * @type {number}
     * @constant
     * @readonly
     */
    const _DOWN_KEY_CODE = 40;

    /**
     * The choice template.
     *
     * @type {string}
     */
    let _choiceTemplate;

    /**
     * The model controller.
     *
     * @type {Object}
     */
    // eslint-disable-next-line one-var
    let _modelController;

    /**
     * The selected template.
     *
     * @type {string}
     */
    // eslint-disable-next-line one-var
    let _selectedTemplate;

    /////////////////////////////
    //                         //
    //    Public attributes    //
    //                         //
    /////////////////////////////

    /**
     * Whether the select is focus or not.
     *
     * @type {boolean}
     */
    lumx.isFocus = false;

    /**
     * Whether the dropdown is open or not.
     *
     * @type {boolean}
     */
    lumx.isOpen = false;

    /**
     * The dropdown unique identifier.
     *
     * @type {string}
     */
    lumx.dropdownUuid = LumXUtilsService.generateUUID();

    /**
     * The filter model.
     *
     * @type {string}
     */
    lumx.filterModel = undefined;

    /**
     * The select icons.
     *
     * @type {Object}
     */
    lumx.icons = {
        mdiAlertCircle,
        mdiCheckCircle,
        mdiClose,
        mdiCloseCircle,
        mdiMagnify,
        mdiMenuDown,
    };

    /**
     * The dropdown target unique identifier.
     *
     * @type {string}
     */
    lumx.targetUuid = LumXUtilsService.generateUUID();

    /**
     * The model view value.
     *
     * @type {string}
     */
    lumx.viewValue = undefined;

    /////////////////////////////
    //                         //
    //    Private functions    //
    //                         //
    /////////////////////////////

    /**
     * Returns the object index in an array.
     *
     * @param  {Array}  arr The array to check in.
     * @param  {Object} obj The object to check.
     * @return {number} The object index.
     */
    function _arrayObjectIndexOf(arr, obj) {
        for (let i = 0, len = arr.length; i < len; i++) {
            if (angular.equals(obj, arr[i])) {
                return i;
            }
        }

        return -1;
    }

    /**
     * Init view value.
     */
    function _initViewValue() {
        if (angular.isDefined(lumx.modelToSelection)) {
            if (lumx.multiple) {
                lumx.viewValue = [];

                angular.forEach(_modelController.$viewValue, (item) => {
                    lumx.modelToSelection({
                        // eslint-disable-next-line id-blacklist
                        callback(response) {
                            lumx.viewValue.push(response);
                        },
                        // eslint-disable-next-line id-blacklist
                        data: item,
                    });
                });
            } else {
                lumx.modelToSelection({
                    // eslint-disable-next-line id-blacklist
                    callback(response) {
                        lumx.viewValue = response;
                    },
                    // eslint-disable-next-line id-blacklist
                    data: _modelController.$viewValue,
                });
            }
        } else {
            lumx.viewValue = _modelController.$viewValue;
        }
    }

    /**
     * Select item synchronously (no selectiontoModel).
     *
     * @param {Object} choice The choice object.
     */
    function _updateModel(choice) {
        let updatedModel;

        if (lumx.multiple) {
            updatedModel = angular.copy(_modelController.$viewValue);

            const choiceIndex = _arrayObjectIndexOf(_modelController.$viewValue, choice);

            if (choiceIndex === -1) {
                updatedModel.push(choice);
            } else {
                updatedModel.splice(choiceIndex, 1);
            }
        } else {
            updatedModel = choice;
        }

        _modelController.$setViewValue(updatedModel);
    }

    /**
     * Update view value on select.
     *
     * @param {Object} choice The choice object.
     */
    function _updateViewValue(choice) {
        if (lumx.multiple) {
            const choiceIndex = _arrayObjectIndexOf(lumx.viewValue, choice);

            if (choiceIndex === -1) {
                lumx.viewValue.push(choice);
            } else {
                lumx.viewValue.splice(choiceIndex, 1);
            }
        } else {
            lumx.viewValue = choice;
        }
    }

    /**
     * Handle key events on input wrapper focus.
     *
     * @param {Event} evt The key event.
     */
    function _onKeyPress(evt) {
        if (evt.keyCode === _DOWN_KEY_CODE && !lumx.isOpen) {
            lumx.openDropdown();

            evt.preventDefault();
            evt.stopPropagation();
        }
    }

    /////////////////////////////
    //                         //
    //     Public functions    //
    //                         //
    /////////////////////////////

    /**
     * Clear the model on clear button click.
     *
     * @param {Event} [evt] The event that triggered the function.
     */
    function clearModel(evt) {
        if (angular.isDefined(evt)) {
            evt.stopPropagation();
        }

        if (lumx.multiple) {
            _modelController.$setViewValue([]);
            lumx.viewValue.length = 0;
        } else {
            _modelController.$setViewValue(undefined);
            lumx.viewValue = undefined;
        }
    }

    /**
     * Close the dropdown menu.
     */
    function closeDropdown() {
        LumXDropdownService.close(lumx.dropdownUuid);
    }

    /**
     * Disable key events on input wrapper blur.
     */
    function disableKeyEvents() {
        lumx.isFocus = false;
        $document.off('keydown keypress', _onKeyPress);
    }

    /**
     * Display the choice according to the choice template.
     *
     * @param  {Object} choice The choice object.
     * @return {string} The choice label.
     */
    function displayChoice(choice) {
        const choiceScope = {
            $choice: choice,
        };

        const interpolatedChoice = $interpolate(_choiceTemplate)(choiceScope);

        return $sce.trustAsHtml(interpolatedChoice);
    }

    /**
     * Display the selected item according to the selected template.
     *
     * @param  {Object} [selected] The selected object.
     * @return {string} The selected label.
     */
    function displaySelected(selected) {
        const selectedScope = {
            $selected: angular.isDefined(selected) ? selected : lumx.viewValue,
        };

        const interpolatedSelected = $interpolate(_selectedTemplate)(selectedScope);

        return $sce.trustAsHtml(interpolatedSelected);
    }

    /**
     * Enable key events on input wrapper focus.
     */
    function enableKeyEvents() {
        lumx.isFocus = true;
        $document.on('keydown keypress', _onKeyPress);
    }

    /**
     * Check if the model is empty.
     *
     * @return {boolean} Whether the model is empty or not.
     */
    function isModelEmpty() {
        if (lumx.multiple) {
            return _modelController.$viewValue.length === 0;
        }

        return angular.isUndefined(_modelController.$viewValue);
    }

    /**
     * Check if a choice is selected.
     *
     * @param  {Object}  choice The choice object.
     * @return {boolean} Whether the choice is selected or not.
     */
    function isSelected(choice) {
        if (lumx.multiple) {
            return _arrayObjectIndexOf(lumx.viewValue, choice) !== -1;
        }

        return angular.equals(choice, lumx.viewValue);
    }

    /**
     * Open the dropdown menu on input wrapper click.
     */
    function openDropdown() {
        LumXDropdownService.open(lumx.dropdownUuid, { target: `#${lumx.targetUuid}` });
    }

    /**
     * Register the choice template.
     *
     * @param {string} choiceTemplate The choice template.
     */
    function registerChoiceTemplate(choiceTemplate) {
        _choiceTemplate = choiceTemplate;
    }

    /**
     * Select the selected template.
     *
     * @param {string} selectedTemplate The choice template.
     */
    function registerSelectedTemplate(selectedTemplate) {
        _selectedTemplate = selectedTemplate;
    }

    /**
     * Select a choice.
     *
     * @param {Object} choice The choice object.
     * @param {Event}  [evt]  The event that triggered the function.
     */
    function select(choice, evt) {
        if (angular.isDefined(evt) && lumx.multiple) {
            evt.stopPropagation();
        }

        if (angular.isDefined(lumx.selectionToModel)) {
            lumx.selectionToModel({
                // eslint-disable-next-line id-blacklist
                callback(response) {
                    _updateModel(response);
                    _updateViewValue(choice);
                },
                // eslint-disable-next-line id-blacklist
                data: choice,
            });
        } else {
            _updateModel(choice);
            _updateViewValue(choice);
        }

        if (lumx.multiple) {
            $timeout(() => {
                LumXDropdownService.updateActiveDropdownPosition();
            });
        }
    }

    /**
     * Set the model controller.
     *
     * @param {Object} modelController The model controller.
     */
    function setModelController(modelController) {
        _modelController = modelController;

        _modelController.$render = _initViewValue;
    }

    /**
     * Update choices list according to filter model.
     */
    function updateFilter() {
        if (angular.isDefined(lumx.filter)) {
            lumx.filter({
                newValue: lumx.filterModel,
            });
        }
    }

    /////////////////////////////

    lumx.clearModel = clearModel;
    lumx.closeDropdown = closeDropdown;
    lumx.disableKeyEvents = disableKeyEvents;
    lumx.displayChoice = displayChoice;
    lumx.displaySelected = displaySelected;
    lumx.enableKeyEvents = enableKeyEvents;
    lumx.isModelEmpty = isModelEmpty;
    lumx.isSelected = isSelected;
    lumx.openDropdown = openDropdown;
    lumx.registerChoiceTemplate = registerChoiceTemplate;
    lumx.registerSelectedTemplate = registerSelectedTemplate;
    lumx.select = select;
    lumx.setModelController = setModelController;
    lumx.updateFilter = updateFilter;

    /////////////////////////////
    //                         //
    //          Events         //
    //                         //
    /////////////////////////////

    /**
     * Add focus class to input wrapper on dropdown open.
     *
     * @param {Event}  evt        The dropdown open event.
     * @param {Object} dropdownId The dropdown identifier.
     */
    $scope.$on(`${COMPONENT_PREFIX}-dropdown__open`, (evt, dropdownId) => {
        if (dropdownId === lumx.dropdownUuid) {
            lumx.isOpen = true;
        }
    });

    /**
     * Remove focus class to input wrapper on dropdown close.
     *
     * @param {Event}  evt        The dropdown open event.
     * @param {Object} dropdownId The dropdown identifier.
     */
    $scope.$on(`${COMPONENT_PREFIX}-dropdown__close`, (evt, dropdownId) => {
        if (dropdownId === lumx.dropdownUuid) {
            lumx.isOpen = false;
        }
    });
}

/////////////////////////////

function SelectDirective() {
    'ngInject';

    function link(scope, el, attrs, ctrls, transclude) {
        ctrls[0].setModelController(ctrls[1]);

        transclude(
            scope,
            (clone) => {
                let choiceTemplate = '';

                for (let i = 0; i < clone.length; i++) {
                    choiceTemplate += clone[i].data || clone[i].outerHTML || '';
                }

                ctrls[0].registerChoiceTemplate(choiceTemplate);
            },
            null,
            'choices',
        );

        transclude(
            scope,
            (clone) => {
                let selectedTemplate = '';

                for (let i = 0; i < clone.length; i++) {
                    selectedTemplate += clone[i].data || clone[i].outerHTML || '';
                }

                ctrls[0].registerSelectedTemplate(selectedTemplate);
            },
            null,
            'selected',
        );
    }

    return {
        bindToController: true,
        controller: SelectController,
        controllerAs: 'lumx',
        link,
        replace: true,
        require: [`${COMPONENT_PREFIX}Select`, 'ngModel'],
        restrict: 'E',
        scope: {
            choices: '=lxChoices',
            filter: '&?lxFilter',
            hasError: '=?lxHasError',
            hasFilter: '=?lxHasFilter',
            hasHelper: '=?lxHasHelper',
            helper: '@?lxHelper',
            isClearable: '=lxIsClearable',
            isDisabled: '=?ngDisabled',
            isLoading: '=?lxIsLoading',
            isValid: '=?lxIsValid',
            label: '@?lxLabel',
            modelToSelection: '&?lxModelToSelection',
            multiple: '=?lxMultiple',
            placeholder: '@?lxPlaceholder',
            selectionToModel: '&?lxSelectionToModel',
            theme: '@?lxTheme',
            variant: '@?lxVariant',
        },
        template,
        transclude: {
            choices: `${COMPONENT_PREFIX}SelectChoices`,
            selected: `${COMPONENT_PREFIX}SelectSelected`,
        },
    };
}

/////////////////////////////

angular.module(`${MODULE_NAME}.select`).directive(`${COMPONENT_PREFIX}Select`, SelectDirective);

/////////////////////////////

export { SelectDirective };
