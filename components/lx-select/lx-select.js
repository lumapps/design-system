(function IIFE() {
    'use strict';

    /////////////////////////////

    lxSelectController.$inject = ['$document', '$filter', '$interpolate', '$sce', '$scope', 'LxDropdownService',
        'LxUtilsService'];

    function lxSelectController($document, $filter, $interpolate, $sce, $scope, LxDropdownService,
        LxUtilsService) {
        var lxSelect = this;

        /////////////////////////////
        //                         //
        //    Private attributes   //
        //                         //
        /////////////////////////////

        /**
         * The choice template.
         *
         * @type {string}
         */
        var _choiceTemplate;

        /**
         * The model controller.
         *
         * @type {Object}
         */
        var _modelController;

        /**
         * The selected template.
         *
         * @type {string}
         */
        var _selectedTemplate;

        /////////////////////////////
        //                         //
        //    Private functions    //
        //                         //
        /////////////////////////////

        /**
         * Returns the object index in an array.
         *
         * @param  {Array}   arr The array to check in.
         * @param  {Object}  obj The object to check.
         * @return {integer} The object index.
         */
        function _arrayObjectIndexOf(arr, obj) {
            for (var i = 0, len = arr.length; i < len; i++) {
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
            if (angular.isDefined(lxSelect.modelToSelection)) {
                if (lxSelect.multiple) {
                    lxSelect.viewValue = [];

                    angular.forEach(_modelController.$viewValue, function(item) {
                        lxSelect.modelToSelection({
                            data: item,
                            callback: function(resp) {
                                lxSelect.viewValue.push(resp);
                            }
                        });
                    });
                } else {
                    lxSelect.modelToSelection({
                        data: _modelController.$viewValue,
                        callback: function(resp) {
                            lxSelect.viewValue = resp;
                        }
                    });
                }
            } else {
                lxSelect.viewValue = _modelController.$viewValue;
            }
        }

        /**
         * Increase active choice index on key down press.
         */
        function _nextChoiceOnKeyDown() {
            var filteredChoices = $filter('lxSelectChoicesFilter')(lxSelect.choices, lxSelect.filter, lxSelect.filterModel);

            if (lxSelect.activeChoiceIndex + 1 >= filteredChoices.length) {
                lxSelect.activeChoiceIndex = 0;
            } else {
                lxSelect.activeChoiceIndex += 1;
            }
        }

        /**
         * Handle key events on input rapper focus.
         *
         * @param {Event} evt The key event.
         */
        function _onKeyUp(evt) {
            if (evt.keyCode == 40) {
                if (lxSelect.isOpen) {
                    _nextChoiceOnKeyDown();
                    $scope.$apply();
                } else {
                    openDropdown();
                }
            } else if (evt.keyCode == 38) {
                if (lxSelect.isOpen) {
                    _previousChoiceOnKeyUp();
                    $scope.$apply();
                }
            } else if (evt.keyCode == 13) {
                if (lxSelect.isOpen) {
                    _selectChoiceOnKeyEnter();
                    $scope.$apply();

                    if (!lxSelect.multiple) {
                        closeDropdown();
                    }
                }
            }

            evt.stopPropagation();
        }

        /**
         * Decrease active choice index on key up press.
         */
        function _previousChoiceOnKeyUp() {
            var filteredChoices = $filter('lxSelectChoicesFilter')(lxSelect.choices, lxSelect.filter, lxSelect.filterModel);

            if (lxSelect.activeChoiceIndex === 0) {
                lxSelect.activeChoiceIndex = filteredChoices.length -1;
            } else {
                lxSelect.activeChoiceIndex -= 1;
            }
        }

        /**
         * Select choice from filtered list according to active choice index.
         */
        function _selectChoiceOnKeyEnter() {
            var filteredChoices = $filter('lxSelectChoicesFilter')(lxSelect.choices, lxSelect.filter, lxSelect.filterModel);

            select(filteredChoices[lxSelect.activeChoiceIndex]);
        }

        /**
         * Select item synchronously (no selectiontoModel)
         *
         * @param {Object} choice The choice object.
         */
        function _updateModel(choice) {
            var updatedModel;

            if (lxSelect.multiple) {
                updatedModel = angular.copy(_modelController.$viewValue);

                var choiceIndex = _arrayObjectIndexOf(_modelController.$viewValue, choice);

                if (choiceIndex !== -1) {
                    updatedModel.splice(choiceIndex, 1);
                } else {
                    updatedModel.push(choice);
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
            if (lxSelect.multiple) {
                var choiceIndex = _arrayObjectIndexOf(lxSelect.viewValue, choice);

                if (choiceIndex !== -1) {
                    lxSelect.viewValue.splice(choiceIndex, 1);
                } else {
                    lxSelect.viewValue.push(choice);
                }
            } else {
                lxSelect.viewValue = choice;
            }
        }

        /////////////////////////////
        //                         //
        //    Public attributes    //
        //                         //
        /////////////////////////////

        /**
         * The active choice index useful when navigating with keybord arrow keys.
         *
         * @type {number}
         */
        lxSelect.activeChoiceIndex = 0;

        /**
         * Wether the dropdown is open or not.
         *
         * @type {boolean}
         */
        lxSelect.isOpen = false;

        /**
         * The dropdown unique identifier.
         *
         * @type {string}
         */
        lxSelect.dropdownUuid = LxUtilsService.generateUUID();

        /**
         * The filter model.
         *
         * @type {string}
         */
        lxSelect.filterModel = undefined;

        /**
         * The dropdown target unique identifier.
         *
         * @type {string}
         */
        lxSelect.targetUuid = LxUtilsService.generateUUID();

        /**
         * The model view value.
         *
         * @type {string}
         */
        lxSelect.viewValue = undefined;

        /////////////////////////////
        //                         //
        //     Public functions    //
        //                         //
        /////////////////////////////

        /**
         * Close the dropdown menu.
         */
        function closeDropdown() {
             LxDropdownService.close(lxSelect.dropdownUuid);
        }

        /**
         * Disable key events on input wrapper blur.
         */
        function disableKeyEvents() {
            $document.off('keyup', _onKeyUp);
        }

        /**
         * Display the choice according to the choice template.
         *
         * @param  {Object} choice The choice object.
         * @return {string} The choice label.
         */
        function displayChoice(choice) {
            var choiceScope = {
                $choice: choice
            };

            var interpolatedChoice = $interpolate(_choiceTemplate)(choiceScope);
            return $sce.trustAsHtml(interpolatedChoice);
        }

        /**
         * Display the selected item according to the selected template.
         *
         * @param  {Object} [selected] The selected object.
         * @return {string} The selected label.
         */
        function displaySelected(selected) {
            var selectedScope = {
                $selected: angular.isDefined(selected) ? selected : lxSelect.viewValue
            };

            var interpolatedSelected = $interpolate(_selectedTemplate)(selectedScope);
            return $sce.trustAsHtml(interpolatedSelected);
        }

        /**
         * Enable key events on input wrapper focus.
         */
        function enableKeyEvents() {
            $document.on('keyup', _onKeyUp);
        }

        /**
         * Check if the model is empty
         *
         * @return {boolean} Wether the model is empty or not.
         */
        function isModelEmpty() {
            if (lxSelect.multiple) {
                return _modelController.$viewValue.length === 0
            } else {
                return angular.isUndefined(_modelController.$viewValue);
            }
        }

        /**
         * Check if a choice is selected.
         *
         * @param  {Object}  choice The choice object.
         * @return {boolean} Wether the choice is selected or not.
         */
        function isSelected(choice) {
            if (lxSelect.multiple) {
               return _arrayObjectIndexOf(lxSelect.viewValue, choice) !== -1;
            } else {
                return angular.equals(choice, lxSelect.viewValue);
            }
        }

        /**
         * Open the dropdown menu on input wrapper click.
         */
        function openDropdown() {
            LxDropdownService.open(lxSelect.dropdownUuid, '#' + lxSelect.targetUuid);
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
         * @param {string} choiceTemplate The choice template.
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
            if (angular.isDefined(evt) && lxSelect.multiple) {
                evt.stopPropagation();
            }

            if (angular.isDefined(lxSelect.selectionToModel)) {
                lxSelect.selectionToModel({
                    data: choice,
                    callback: function(resp) {
                        _updateModel(resp);
                        _updateViewValue(choice);
                    }
                });
            } else {
                _updateModel(choice);
                _updateViewValue(choice);
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
            lxSelect.activeChoiceIndex = 0;

            if (angular.isDefined(lxSelect.filter)) {
                lxSelect.filter({
                    newValue: lxSelect.filterModel
                });
            }
        }

        /////////////////////////////

        lxSelect.closeDropdown = closeDropdown;
        lxSelect.disableKeyEvents = disableKeyEvents;
        lxSelect.displayChoice = displayChoice;
        lxSelect.displaySelected = displaySelected;
        lxSelect.enableKeyEvents = enableKeyEvents;
        lxSelect.isModelEmpty = isModelEmpty;
        lxSelect.isSelected = isSelected;
        lxSelect.openDropdown = openDropdown;
        lxSelect.registerChoiceTemplate = registerChoiceTemplate;
        lxSelect.registerSelectedTemplate = registerSelectedTemplate;
        lxSelect.select = select;
        lxSelect.setModelController = setModelController;
        lxSelect.updateFilter = updateFilter;

        /////////////////////////////
        //                         //
        //          Events         //
        //                         //
        /////////////////////////////

        /**
         * Add focus class to input wrapper on dropdown open.
         *
         * @param {Event}  evt    The dropdown open event.
         * @param {Object} params The dropdown uuid and the target id.
         */
        $scope.$on('lx-dropdown__open', function onDropdownOpen(evt, params) {
            if (params.uuid === lxSelect.dropdownUuid) {
                lxSelect.isOpen = true;
            }
        });

        /**
         * Remove focus class to input wrapper on dropdown close.
         *
         * @param {Event}  evt    The dropdown open event.
         * @param {Object} params The dropdown uuid and the target id.
         */
        $scope.$on('lx-dropdown__close', function onDropdownOpen(evt, params) {
            if (params.uuid === lxSelect.dropdownUuid) {
                lxSelect.isOpen = false;
            }
        });
    }

    /////////////////////////////

    function lxSelectDirective() {
        function link(scope, el, attrs, ctrls, transclude) {
            ctrls[0].setModelController(ctrls[1]);

            transclude(scope, function(clone) {
                var template = '';

                for (var i = 0; i < clone.length; i++) {
                    template += clone[i].data || clone[i].outerHTML || '';
                }

                ctrls[0].registerChoiceTemplate(template);
            }, null, 'choices');

            transclude(scope, function(clone) {
                var template = '';

                for (var i = 0; i < clone.length; i++) {
                    template += clone[i].data || clone[i].outerHTML || '';
                }

                ctrls[0].registerSelectedTemplate(template);
            }, null, 'selected');
        }

        return {
            bindToController: true,
            controller: lxSelectController,
            controllerAs: 'lxSelect',
            link: link,
            replace: true,
            require: ['lxSelect', 'ngModel'],
            restrict: 'E',
            scope: {
                choices: '=lxChoices',
                displayFilter: '=?lxDisplayFilter',
                displayHelper: '=?lxDisplayHelper',
                filter: '&?lxFilter',
                helper: '@?lxHelper',
                label: '@?lxLabel',
                modelToSelection: '&?lxModelToSelection',
                multiple: '=?lxMultiple',
                selectionToModel: '&?lxSelectionToModel',
            },
            templateUrl: 'components/lx-select/lx-select.html',
            transclude: {
                choices: 'lxSelectChoices',
                selected: 'lxSelectSelected',
            },
        };
    }

    /////////////////////////////

    angular.module('lumx.select').directive('lxSelect', lxSelectDirective);
})();
