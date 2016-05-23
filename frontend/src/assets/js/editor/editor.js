var editorModule = angular.module("duck.editor");

editorModule.controller("EditorController", function (DocumentModel, TaxonomyService,
                                                      $stateParams, AbandonComponent, ObjectUtils, $scope, $rootScope) {

    var controller = this;

    var documentId = ObjectUtils.notNull($stateParams.documentId) ? $stateParams.documentId : null;
    controller.noDocument = documentId === null;

    if (controller.noDocument) {
        return;
    }

    controller.active = true;

    var unregisterDirtyCheck = $rootScope.$on("$stateChangeStart", function (event, toState) {
        if (!DocumentModel.dirty) {
            return;
        }
        AbandonComponent.open(event, toState);
    });

    $scope.$on("$destroy", function () {
        unregisterDirtyCheck();
    });

    initializeCompletions();


    controller.toggleEdit = function (statement) {
        DocumentModel.toggleEdit(statement);
    };

    controller.editing = function (statement) {
        return DocumentModel.editing(statement);
    };

    controller.editAll = function () {
        return DocumentModel.document.statements.forEach(function (statement) {
            DocumentModel.edit(statement);
        });
    };

    controller.closeAll = function () {
        return DocumentModel.document.statements.forEach(function (statement) {
            DocumentModel.close(statement);
        });
    };

    controller.dirty = function () {
        return DocumentModel.dirty;
    };

    controller.revert = function () {
        return DocumentModel.revert();
    };

    controller.deleteStatement = function (statement) {
        DocumentModel.deleteStatement(statement);
    };

    controller.addStatement = function () {
        // useScope: "cloud services defined in the services agreement", qualifier: "account", dataCategory: "data", sourceScope: "those cloud services",
        //             action: "provide", resultScope: "cloud services defined in the service agreement"
        DocumentModel.addStatement({
            useScope: null,
            qualifier: null,
            dataCategory: null,
            sourceScope: null,
            action: null,
            resultScope: null
        });
    };

    controller.hasErrors = function (statement) {
        var errors = statement.errors;
        if (ObjectUtils.isNull(errors)) {
            return false;
        }
        return errors.useScope.active || errors.action.active;
    };

    controller.emptyStatement = function (statement) {
        return DocumentModel.emptyStatement(statement);
    };

    DocumentModel.initialize(documentId).then(function () {
        // ng-sortable requires the use of $scope
        $scope.document = DocumentModel.document;
    }, function (status) {
        // FIXME display error
        alert("Failed: " + status);
    });


    // setup the sortable control listener
    controller.dragControlListeners = {
        allowDuplicates: true,
        orderChanged: function (event) {
            DocumentModel.markDirty();
        }
    };

    function initializeCompletions() {

        // setup autocompletes - requires $scope
        $scope.useScopeCompletion = {
            suggest: function (term) {
                return TaxonomyService.lookup("scope", "eng", term)
            },
            on_detach: function(value){
                DocumentModel.validateSyntax();
            }
        };

        $scope.qualifierCompletion = {
            suggest: function (term) {
                return TaxonomyService.lookup("qualifier", "eng", term)
            },
            on_detach: function(value){
                DocumentModel.validateSyntax();
            }
        };

        $scope.dataCategoryCompletion = {
            suggest: function (term) {
                return TaxonomyService.lookup("dataCategory", "eng", term)
            },
            on_detach: function(value){
                DocumentModel.validateSyntax();
            }
        };

        $scope.sourceScopeCompletion = {
            suggest: function (term) {
                return TaxonomyService.lookup("scope", "eng", term)
            },
            on_detach: function(value){
                DocumentModel.validateSyntax();
            }
        };

        $scope.actionCompletion = {
            suggest: function (term) {
                return TaxonomyService.lookup("action", "eng", term)
            },
            on_detach: function(value){
                DocumentModel.validateSyntax();
            }
        };

        $scope.resultScopeCompletion = {
            suggest: function (term) {
                return TaxonomyService.lookup("scope", "eng", term)
            },
            on_detach: function(value){
                DocumentModel.validateSyntax();
            }
        };
    }

});


