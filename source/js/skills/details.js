import js from '../utils/js-commons';
import ajax from '../utils/ajax';
import paginatedListUtils from '../utils/paginated-list';

var viewName = 'skillDetails';
var skillsEmployeesListReduxId = 'skillDetailsEmployees';
var skillsEmployeesListHtmlId = 'skill-details-employees';
var addEmployeesListReduxId = 'skillDetailsAddEmployees';
var addEmployeesListHtmlId = 'skill-details-add-employees';
var htmlNodes = 'Initialized on view load';

function skillReducer(state, action) {
    if (typeof state === "undefined") {
        state = {};
    }

    switch (action.type) {
        case 'skillData':
            return action.skill;
        case 'skillName':
            return {
                ...state,
                Name: action.name
            };
        case 'skillEmployees':
            return {
                ...state,
                Employees: action.employees
            };
        default:
            return state;
    }
}

function readOnlyReducer(state, action) {
    if (typeof state === "undefined") {
        state = true;
    }

    switch (action.type) {
        case 'skillReadOnly':
            return action.readOnly;
        default:
            return state;
    }
}

var viewReducer = Redux.combineReducers({
    skillEmployeesList: paginatedListUtils.getReducer(skillsEmployeesListReduxId),
    addEmployeesList: paginatedListUtils.getReducer(addEmployeesListReduxId),
    skill: skillReducer,
    readOnly: readOnlyReducer
});

function viewRenderer(state) {
    viewRenderer.readOnly(state);
    viewRenderer.skillName(state);
    viewRenderer.skillEmployees(state);
    viewRenderer.foundEmployees(state);
}

var addEmployeesListRenderer = paginatedListUtils.getRenderer(addEmployeesListHtmlId, '<i>No employees found</i>',
function (employee) {
    return `<li class="list-group-item">
                <span class="add-employee" data-employee-id="${ employee.Id }">
                    <i class="fa fa-plus text-success"></i> ${ employee.Name }
                </span>
            </li>`;
});
viewRenderer.foundEmployees = state => addEmployeesListRenderer(state.addEmployeesList);

viewRenderer.skillName = function(state) {
    htmlNodes.pageTitle.html(state.skill.Name);
    htmlNodes.elementName.val(state.skill.Name);
};

var skillEmployeesListRenderer = paginatedListUtils.getRenderer(skillsEmployeesListHtmlId,
'<i>No employees found</i>', function (employee, viewState) {
    var html = `<li class="list-group-item">
                    <a class="reset" onclick="window.Navigate('employee-details-section',
                    { employeeId: ${ employee.Id }, readOnly: true});" href="#">
                        ${ employee.Name }
                    </a>
                </li>`;
    if (!viewState.readOnly) {
        html = `<li class="list-group-item">
                    <span class="remove-employee" data-employee-id="${employee.Id}">
                        <i class="fa fa-times text-danger"></i> ${ employee.Name }
                    </span>
                </li>`;
    }
    return html;
});
viewRenderer.skillEmployees = state => skillEmployeesListRenderer(state.skillEmployeesList, state);

viewRenderer.readOnly = function(state) {
    htmlNodes.addEmployeesList.wrapper.hide();
    htmlNodes.editButton.hide();
    htmlNodes.editButton.removeAttr('onclick');
    htmlNodes.deleteButton.hide();
    htmlNodes.pageTitle.text('Skill not found');            
    htmlNodes.saveButton.hide();
    htmlNodes.cancelButton.hide();
    htmlNodes.cancelButton.removeAttr('onclick');

    if (state.readOnly) {
        htmlNodes.elementName.attr('disabled', 'disabled');
        if (state.skill.Id > 0) {
            htmlNodes.pageTitle.text(state.skill.Name);
            htmlNodes.editButton.attr('onclick', `window.Navigate('skill-details-section',
            { skillId: ${ state.skill.Id }, readOnly: false });`);
            htmlNodes.editButton.show();
            htmlNodes.deleteButton.show();
        }
    }
    else {
        htmlNodes.elementName.removeAttr('disabled');                
        if (state.skill.Id >= 0) {
            htmlNodes.pageTitle.text('New skill');
            htmlNodes.addEmployeesList.wrapper.show();
            htmlNodes.saveButton.show();
            htmlNodes.cancelButton.show();
            htmlNodes.cancelButton.attr('onclick', 'window.Navigate(\'skills-list-section\')');

            if (state.skill.Id > 0) {
                htmlNodes.pageTitle.text(state.skill.Name);
                htmlNodes.cancelButton.attr('onclick', `window.Navigate('skill-details-section',
                { skillId: ${ state.skill.Id }, readOnly: true });`);
            }
        }
    }
};

// Nodes must be initialized once the paginated lists renderers have been defined
htmlNodes = {
    addEmployeesList: paginatedListUtils.getHtmlNodes(addEmployeesListHtmlId),
    pageTitle : $('#skill-page-title'),
    elementName : $('#skill-model-name'),
    skillEmployeesList : paginatedListUtils.getHtmlNodes(skillsEmployeesListHtmlId),
    editButton : $('#skill-edit-button'),
    deleteButton : $('#skill-delete-button'),
    saveButton : $('#skill-save-button'),
    cancelButton : $('#skill-cancel-button')
};

function addEmployeesFetcher(state) {
    var employeesPromise = Promise.resolve(paginatedListUtils.getDefaultResults());
    if (state.addEmployeesList.keywords.length > 0) {
        employeesPromise = js.stallPromise(ajax.get('/api/employee', {
            keywords: state.addEmployeesList.keywords
        }, paginatedListUtils.getDefaultResults()), 1500);
    }
    return employeesPromise
    .then(function(results) {
        results.Items = js.arrayDifference(results.Items, state.skill.Employees, 'Id');
        return results;
    });
}

var actionBinders = function(store) {
    function getEmployeeId(event) {
        var $element = $(event.target);
        if ($element.hasClass('fa')) {
            $element = $element.parent();
        }
        var employeeId = $element.data('employee-id');
        return employeeId;
    }

    htmlNodes.elementName.on('blur', function(event) {
        store.dispatch({
            type: 'skillName',
            name: event.target.value
        });
    });

    htmlNodes.deleteButton.on('click', function(event) {
        store.dispatch(function (dispatch) {
            var state = store.getState()[viewName];

            js.actionModal('<div>Are you sure you want to delete ' + state.skill.Name + '?</div>',
            'Delete')
            .then(function() {
                dispatch({
                    type: 'loading',
                    reason: 'removing-skill'
                });
                return ajax.remove('/api/skill?id=' + state.skill.Id);
            })
            .then(function (skill) {
                basicModal.close();
                if (skill) {
                    window.Navigate('skills-list-section');
                }
                else {
                    dispatch({
                        type: 'loaded',
                        reason: 'removed-skill'
                    });
                }
            });
        });
    });

    htmlNodes.saveButton.on('click', function(event) {
        store.dispatch(function (dispatch) {
            dispatch({
                type: 'loading',
                reason: 'saving-skill'
            });
            var state = store.getState()[viewName];
            
            ajax.save('/api/skill', state.skill)
            .then(function (skill) {
                if (skill) {
                    window.Navigate('skill-details-section', {
                        skillId: skill.Id,
                        readOnly: true
                    });
                }
                else {
                    dispatch({
                        type: 'loaded',
                        reason: 'saved-skill'
                    });
                }
            });
        });
    });

    htmlNodes.addEmployeesList.list.on('click', '.add-employee', function(event) {
        var state = store.getState()[viewName];
        var employeeId = getEmployeeId(event);
        var employee = state.addEmployeesList.results.find(function(employee) {
            return employee.Id === employeeId;
        });
        if (employee) {
            var employees = state.skill.Employees.concat([employee]);
            store.dispatch({
                type: 'skillEmployees',
                employees
            });
            store.dispatch({
                type: 'paginatedListResults',
                listId: skillsEmployeesListReduxId,
                results: {
                    Items: employees,
                    TotalPages: 0
                }
            });
        }
        store.dispatch({
            type: 'paginatedListResults',
            listId: addEmployeesListReduxId,
            results: paginatedListUtils.getDefaultResults(),
            keywords: ''
        });
    });

    htmlNodes.skillEmployeesList.list.on('click', '.remove-employee', function(event) {
        var state = store.getState()[viewName];
        var employeeId = getEmployeeId(event);
        var employees = state.skill.Employees.filter(function(employee) {
            return employee.Id !== employeeId;
        });
        store.dispatch({
            type: 'skillEmployees',
            employees
        });
        store.dispatch({
            type: 'paginatedListResults',
            listId: skillsEmployeesListReduxId,
            results: {
                Items: employees,
                TotalPages: 0
            }
        });
    });

    var actionDispatchers = paginatedListUtils.getActionDispatchers(
        store,
        addEmployeesListReduxId,
        addEmployeesFetcher,
        viewName
    );
    paginatedListUtils.bindDefaultEventHandlers(htmlNodes.addEmployeesList, actionDispatchers);
};

var viewLoader = function(viewData, dispatch) {
    dispatch({
        type: 'skillData',
        skill: {
            Id: viewData.skillId,
            Name: 'New skill',
            Employees: []
        }
    });
    dispatch({
        type: 'skillReadOnly',
        readOnly: viewData.readOnly
    });

    dispatch({
        type: 'paginatedListInitialize',
        listId: skillsEmployeesListReduxId,
        loadPhase: 'none',
        results: paginatedListUtils.getDefaultResults()
    });
    dispatch({
        type: 'paginatedListInitialize',
        listId: addEmployeesListReduxId,
        config: {
            hasSearcher: true,
            searcherPlaceholder: 'Add employees...'
        },
        loadPhase: 'none',
        results: paginatedListUtils.getDefaultResults()
    });

    if (viewData.skillId != 0) {
        ajax.get('/api/skill/getById', {
            id: viewData.skillId
        }, null)
        .then(skill => {
            if (skill) {
                dispatch({
                    type: 'skillData',
                    skill
                });
                dispatch({
                    type: 'paginatedListResults',
                    listId: skillsEmployeesListReduxId,
                    results: {
                        Items: skill.Employees,
                        TotalPages: 0
                    },
                    loadPhase: 'none'
                });
            }
            else {
                dispatch({
                    type: 'skillData',
                    skill: {
                        Id: -1,
                        Name: 'Skill not found',
                        Employees: []
                    }
                });
                dispatch({
                    type: 'skillReadOnly',
                    readOnly: true
                });
            }
        })
    } 
};

export default {
    name: viewName,
    htmlNodeId: 'skill-details-section',
    reducer: viewReducer,
    renderer: viewRenderer,
    actionBinders,
    loader: viewLoader
};
