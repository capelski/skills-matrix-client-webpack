(function (js, ajax, paginatedListUtils) {

    var viewName = 'employeeDetails';
    var employeesSkillsListReduxId = 'employeeDetailsSkills';
    var employeesSkillsListHtmlId = 'employee-details-skills';
    var addSkillsListReduxId = 'employeeDetailsAddSkills';
    var addSkillsListHtmlId = 'employee-details-add-skills';
    var readOnly = 'Initialized on view load'; // TODO Should this variable exist?

    function viewDetails(state, action) {
        if (typeof state === "undefined") {
            state = {
                employee: {
                    Id: -1,
                    Name: '',
                    Skills: []
                },
                readOnly: true
            };
        }

        switch (action.type) {
            case 'employeeLoaded':
                return {
                    ...state,
                    readOnly: action.readOnly,
                    employee: action.employee
                };
            case 'employeeName':
                return {
                    ...state,
                    employee: {
                        ...state.employee,
                        Name: action.name
                    }
                };
            case 'employeeSkills':
                return {
                    ...state,
                    employee: {
                        ...state.employee,
                        Skills: action.skills
                    }
                };
            default:
                return state;
        }
    }

    var viewReducer = Redux.combineReducers({
        employeeSkillsList: paginatedListUtils.getReducer(employeesSkillsListReduxId),
        addSkillsList: paginatedListUtils.getReducer(addSkillsListReduxId),
        viewDetails
    });

    var htmlNodes = {
        addSkillsList: paginatedListUtils.getHtmlNodes(addSkillsListHtmlId),
        pageTitle : $('#employee-page-title'),
        elementName : $('#employee-model-name'),
        employeeSkillsList : paginatedListUtils.getHtmlNodes(employeesSkillsListHtmlId),
        editButton : $('#employee-edit-button'),
        deleteButton : $('#employee-delete-button'),
        saveButton : $('#employee-save-button'),
        cancelButton : $('#employee-cancel-button')
    };

    function viewRenderer(state) {
        viewRenderer.readOnly(state);
        viewRenderer.employeeName(state);
        viewRenderer.employeeSkills(state);
        viewRenderer.foundSkills(state);
    }

    var addSkillsListRenderer = paginatedListUtils.getRenderer(addSkillsListHtmlId, '<i>No skills found</i>',
    function (skill) {
        return '<li class="list-group-item"><span class="add-skill" data-skill-id="' + skill.Id +
        '"><i class="fa fa-plus text-success"></i> ' + skill.Name + '</span></li>';
    });
    viewRenderer.foundSkills = state => addSkillsListRenderer(state.addSkillsList);

    viewRenderer.employeeName = function(state) {
        htmlNodes.pageTitle.html(state.viewDetails.employee.Name);
        htmlNodes.elementName.val(state.viewDetails.employee.Name);
    };

    var employeeSkillsListRenderer = paginatedListUtils.getRenderer(employeesSkillsListHtmlId,
    '<i>No employees found</i>', function (employee) {
        var html = '<li class="list-group-item"><a class="reset" href="/skills/details?id=' +
        employee.Id + '">' + employee.Name + '</a></li>';
        if (!readOnly) {
            html = '<li class="list-group-item"><span class="remove-skill" data-skill-id="' +
            employee.Id + '"><i class="fa fa-times text-danger"></i> ' + employee.Name + '</span></li>';
        }
        return html;
    });
    viewRenderer.employeeSkills = state => employeeSkillsListRenderer(state.employeeSkillsList);

    viewRenderer.readOnly = function(state) {
        htmlNodes.addSkillsList.wrapper.hide();
        htmlNodes.editButton.hide();
        htmlNodes.editButton.attr('href', '#');
        htmlNodes.deleteButton.hide();
        htmlNodes.pageTitle.text('Employee not found');            
        htmlNodes.saveButton.hide();
        htmlNodes.cancelButton.hide();
        htmlNodes.cancelButton.attr('href', '#');

        if (state.viewDetails.readOnly) {
            htmlNodes.elementName.attr('disabled', 'disabled');
            if (state.viewDetails.employee.Id > 0) {
                htmlNodes.pageTitle.text(state.viewDetails.employee.Name);
                htmlNodes.editButton.attr('href', '/employees/edit?id=' + state.viewDetails.employee.Id);
                htmlNodes.editButton.show();
                htmlNodes.deleteButton.show();
            }
        }
        else {
            htmlNodes.elementName.removeAttr('disabled');                
            if (state.viewDetails.employee.Id >= 0) {
                htmlNodes.pageTitle.text('New employee');
                htmlNodes.addSkillsList.wrapper.show();
                htmlNodes.saveButton.show();
                htmlNodes.cancelButton.show();
                htmlNodes.cancelButton.attr('href', '/employees/');

                if (state.viewDetails.employee.Id > 0) {
                    htmlNodes.pageTitle.text(state.viewDetails.employee.Name);
                    htmlNodes.cancelButton.attr('href', '/employees/details?id=' +
                    state.viewDetails.employee.Id);
                }
            }
        }
    };

    var actionBinders = function(store) {
        function getSkillId(event) {
            var $element = $(event.target);
            if ($element.hasClass('fa')) {
                $element = $element.parent();
            }
            var skillId = $element.data('skill-id');
            return skillId;
        }

        htmlNodes.elementName.on('blur', function(event) {
            store.dispatch({
                type: 'employeeName',
                name: event.target.value
            });
        });

        htmlNodes.deleteButton.on('click', function(event) {
            store.dispatch(function (dispatch) {
                var state = store.getState()[viewName];
    
                js.actionModal('<div>Are you sure you want to delete ' + state.viewDetails.employee.Name + '?</div>',
                'Delete')
                .then(function() {
                    dispatch({
                        type: 'loading',
                        reason: 'removing-employee'
                    });
                    return ajax.remove('/api/employee?id=' + state.viewDetails.employee.Id);
                })
                .then(function (employee) {
                    if (employee) {
                        document.location.href = '/employees/';
                    }
                    else {
                        basicModal.close();
                        dispatch({
                            type: 'loaded',
                            reason: 'removed-employee'
                        });
                    }
                });
            });
        });

        htmlNodes.saveButton.on('click', function(event) {
            store.dispatch(function (dispatch) {
                dispatch({
                    type: 'loading',
                    reason: 'saving-employee'
                });
                var state = store.getState()[viewName];
                
                ajax.save('/api/employee', state.viewDetails.employee)
                .then(function (employee) {
                    if (employee) {
                        document.location.href = '/employees/details/' + employee.Id;
                    }
                    else {
                        dispatch({
                            type: 'loaded',
                            reason: 'saved-employee'
                        });
                    }
                });
            });
        });

        htmlNodes.addSkillsList.list.on('click', '.add-skill', function(event) {
            var state = store.getState()[viewName];
            var skillId = getSkillId(event);
            var skill = state.addSkillsList.results.find(function(skill) {
                return skill.Id === skillId;
            });
            if (skill) {
                var skills = state.viewDetails.employee.Skills.concat([skill]);
                store.dispatch({
                    type: 'employeeSkills',
                    skills
                });
                store.dispatch({
                    type: 'paginatedListResults',
                    listId: employeesSkillsListReduxId,
                    results: {
                        Items: skills,
                        TotalPages: 0
                    }
                });
            }
            store.dispatch({
                type: 'paginatedListResults',
                listId: addSkillsListReduxId,
                results: paginatedListUtils.getDefaultResults(),
                keywords: ''
            });
        });

        htmlNodes.employeeSkillsList.list.on('click', '.remove-skill', function(event) {
            var state = store.getState()[viewName];
            var skillId = getSkillId(event);
            var skills = state.viewDetails.employee.Skills.filter(function(skill) {
                return skill.Id !== skillId;
            });
            store.dispatch({
                type: 'employeeSkills',
                skills
            });
            store.dispatch({
                type: 'paginatedListResults',
                listId: employeesSkillsListReduxId,
                results: {
                    Items: skills,
                    TotalPages: 0
                }
            });
        });

        // TODO List actions
        // paginatedListService.attachActions(elements.addSkillsList, store);
    };

    var viewLoader = function(viewData, store) {
        store.dispatch({
            type: 'paginatedListInitialize',
            listId: employeesSkillsListReduxId,
            loadPhase: 'none'
        });
        store.dispatch({
            type: 'paginatedListInitialize',
            listId: addSkillsListReduxId,
            config: {
                hasSearcher: true,
                searcherPlaceholder: 'Add skills...'
            },
            loadPhase: 'none'
        });
    
        var state = store.getState()[viewName];
        readOnly = viewData.readOnly;
    
        var employeePromise = Promise.resolve(state.viewDetails.employee);
        if (viewData.employeeId > 0) {
            employeePromise = ajax.get('/api/employee/getById', {
                id: viewData.employeeId
            }, state.viewDetails.employee);
        }
    
        employeePromise
        .then(function(employee) {
            if (viewData.employeeId == 0 && !readOnly) {
                employee.Id = viewData.employeeId;
                employee.Name = 'New employee';
            }
            else if (employee.Id == -1) {
                employee.Name = 'Employee not found';
                readOnly = true;
            }
            store.dispatch({
                type: 'employeeLoaded',
                employee,
                readOnly
            });
            store.dispatch({
                type: 'paginatedListResults',
                listId: employeesSkillsListReduxId,
                results: {
                    Items: employee.Skills,
                    TotalPages: 0
                },
                loadPhase: 'none'
            });
        });  
    };
    
    window.Views = window.Views || [];
    window.Views.push({
        name: viewName,
        htmlNodeId: 'employee-details-section',
        reducer: viewReducer,
        renderer: viewRenderer,
        actionBinders,
        loader: viewLoader
    });

})(window.JsCommons, window.Ajax, window.PaginatedListUtils);
