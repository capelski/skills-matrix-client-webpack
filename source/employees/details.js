import js from '../utils/js-commons';
import ajax from '../utils/ajax';
import paginatedListUtils from '../utils/paginated-list';

var viewName = 'employeeDetails';
var employeesSkillsListReduxId = 'employeeDetailsSkills';
var employeesSkillsListHtmlId = 'employee-details-skills';
var addSkillsListReduxId = 'employeeDetailsAddSkills';
var addSkillsListHtmlId = 'employee-details-add-skills';
var htmlNodes = 'Initialized on view load';

function employeeReducer(state, action) {
    if (typeof state === "undefined") {
        state = {};
    }

    switch (action.type) {
        case 'employeeData':
            return action.employee;
        case 'employeeName':
            return {
                ...state,
                Name: action.name
            };
        case 'employeeSkills':
            return {
                ...state,
                Skills: action.skills
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
        case 'employeeReadOnly':
            return action.readOnly;
        default:
            return state;
    }
}

var viewReducer = Redux.combineReducers({
    employeeSkillsList: paginatedListUtils.getReducer(employeesSkillsListReduxId),
    addSkillsList: paginatedListUtils.getReducer(addSkillsListReduxId),
    employee: employeeReducer,
    readOnly: readOnlyReducer
});

function viewRenderer(state) {
    viewRenderer.readOnly(state);
    viewRenderer.employeeName(state);
    viewRenderer.employeeSkills(state);
    viewRenderer.foundSkills(state);
}

var addSkillsListRenderer = paginatedListUtils.getRenderer(addSkillsListHtmlId, '<i>No skills found</i>',
function (skill) {
    return `<li class="list-group-item">
                <span class="add-skill" data-skill-id="${ skill.Id }">
                    <i class="fa fa-plus text-success"></i> ${ skill.Name }
                </span>
            </li>`;
});
viewRenderer.foundSkills = state => addSkillsListRenderer(state.addSkillsList);

viewRenderer.employeeName = function(state) {
    htmlNodes.pageTitle.html(state.employee.Name);
    htmlNodes.elementName.val(state.employee.Name);
};

var employeeSkillsListRenderer = paginatedListUtils.getRenderer(employeesSkillsListHtmlId,
'<i>No skills found</i>', function (skill, viewState) {
    var html = `<li class="list-group-item">
                    <a class="reset" onclick="window.Navigate('skill-details-section',
                    { skillId: ${ skill.Id }, readOnly: true});" href="#">
                        ${ skill.Name }
                    </a>
                </li>`;
    if (!viewState.readOnly) {
        html = `<li class="list-group-item">
                    <span class="remove-skill" data-skill-id="${skill.Id}">
                        <i class="fa fa-times text-danger"></i> ${ skill.Name }
                    </span>
                </li>`;
    }
    return html;
});
viewRenderer.employeeSkills = state => employeeSkillsListRenderer(state.employeeSkillsList, state);

viewRenderer.readOnly = function(state) {
    htmlNodes.addSkillsList.wrapper.hide();
    htmlNodes.editButton.hide();
    htmlNodes.editButton.removeAttr('onclick');
    htmlNodes.deleteButton.hide();
    htmlNodes.pageTitle.text('Employee not found');            
    htmlNodes.saveButton.hide();
    htmlNodes.cancelButton.hide();
    htmlNodes.cancelButton.removeAttr('onclick');

    if (state.readOnly) {
        htmlNodes.elementName.attr('disabled', 'disabled');
        if (state.employee.Id > 0) {
            htmlNodes.pageTitle.text(state.employee.Name);
            htmlNodes.editButton.attr('onclick', `window.Navigate('employee-details-section',
            { employeeId: ${ state.employee.Id }, readOnly: false });`);
            htmlNodes.editButton.show();
            htmlNodes.deleteButton.show();
        }
    }
    else {
        htmlNodes.elementName.removeAttr('disabled');                
        if (state.employee.Id >= 0) {
            htmlNodes.pageTitle.text('New employee');
            htmlNodes.addSkillsList.wrapper.show();
            htmlNodes.saveButton.show();
            htmlNodes.cancelButton.show();
            htmlNodes.cancelButton.attr('onclick', 'window.Navigate(\'employees-list-section\')');

            if (state.employee.Id > 0) {
                htmlNodes.pageTitle.text(state.employee.Name);
                htmlNodes.cancelButton.attr('onclick', `window.Navigate('employee-details-section',
                { employeeId: ${ state.employee.Id }, readOnly: true });`);
            }
        }
    }
};

// Nodes must be initialized once the paginated lists renderers have been defined
htmlNodes = {
    addSkillsList: paginatedListUtils.getHtmlNodes(addSkillsListHtmlId),
    pageTitle : $('#employee-page-title'),
    elementName : $('#employee-model-name'),
    employeeSkillsList : paginatedListUtils.getHtmlNodes(employeesSkillsListHtmlId),
    editButton : $('#employee-edit-button'),
    deleteButton : $('#employee-delete-button'),
    saveButton : $('#employee-save-button'),
    cancelButton : $('#employee-cancel-button')
};

function addSkillsFetcher(state) {
    var skillsPromise = Promise.resolve(paginatedListUtils.getDefaultResults());
    if (state.addSkillsList.keywords.length > 0) {
        skillsPromise = js.stallPromise(ajax.get('/api/skill', {
            keywords: state.addSkillsList.keywords
        }, paginatedListUtils.getDefaultResults()), 1500);
    }
    return skillsPromise
    .then(function(results) {
        results.Items = js.arrayDifference(results.Items, state.employee.Skills, 'Id');
        return results;
    });
}

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

            js.actionModal('<div>Are you sure you want to delete ' + state.employee.Name + '?</div>',
            'Delete')
            .then(function() {
                dispatch({
                    type: 'loading',
                    reason: 'removing-employee'
                });
                return ajax.remove('/api/employee?id=' + state.employee.Id);
            })
            .then(function (employee) {
                basicModal.close();
                if (employee) {
                    window.Navigate('employees-list-section');
                }
                else {
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
            
            ajax.save('/api/employee', state.employee)
            .then(function (employee) {
                if (employee) {
                    window.Navigate('employee-details-section', {
                        employeeId: employee.Id,
                        readOnly: true
                    });
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
            var skills = state.employee.Skills.concat([skill]);
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
        var skills = state.employee.Skills.filter(function(skill) {
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

    var actionDispatchers = paginatedListUtils.getActionDispatchers(
        store,
        addSkillsListReduxId,
        addSkillsFetcher,
        viewName
    );
    paginatedListUtils.bindDefaultEventHandlers(htmlNodes.addSkillsList, actionDispatchers);
};

var viewLoader = function(viewData, dispatch) {
    dispatch({
        type: 'employeeData',
        employee: {
            Id: viewData.employeeId,
            Name: 'New employee',
            Skills: []
        }
    });
    dispatch({
        type: 'employeeReadOnly',
        readOnly: viewData.readOnly
    });

    dispatch({
        type: 'paginatedListInitialize',
        listId: employeesSkillsListReduxId,
        loadPhase: 'none',
        results: paginatedListUtils.getDefaultResults()
    });
    dispatch({
        type: 'paginatedListInitialize',
        listId: addSkillsListReduxId,
        config: {
            hasSearcher: true,
            searcherPlaceholder: 'Add skills...'
        },
        loadPhase: 'none',
        results: paginatedListUtils.getDefaultResults()
    });

    if (viewData.employeeId != 0) {
        ajax.get('/api/employee/getById', {
            id: viewData.employeeId
        }, null)
        .then(employee => {
            if (employee) {
                dispatch({
                    type: 'employeeData',
                    employee
                });
                dispatch({
                    type: 'paginatedListResults',
                    listId: employeesSkillsListReduxId,
                    results: {
                        Items: employee.Skills,
                        TotalPages: 0
                    },
                    loadPhase: 'none'
                });
            }
            else {
                dispatch({
                    type: 'employeeData',
                    employee: {
                        Id: -1,
                        Name: 'Employee not found',
                        Skills: []
                    }
                });
                dispatch({
                    type: 'employeeReadOnly',
                    readOnly: true
                });
            }
        })
    } 
};

export default {
    name: viewName,
    htmlNodeId: 'employee-details-section',
    reducer: viewReducer,
    renderer: viewRenderer,
    actionBinders,
    loader: viewLoader
};
